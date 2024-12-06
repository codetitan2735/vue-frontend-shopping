<template>
  <div>
    <div id="my-modal" class="modal fade" ref="modal">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-body product-modal">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <div class="row d-block checkout-page shop-single">
              <div class="col-md-6 float-left text-center" v-if="item.img_url">
                <img v-bind:src="item.img_url.large" v-bind:alt="item.title">
              </div>
              <div class="col-md-6 float-left">
                <h4>{{ item.title }}</h4>
                <small>{{ item.description }}</small>
                <div class="checkout woocommerce-checkout">
                  <div v-for="(optGroup, index) in item.opt_groups" class="opt-group" :key="index">
                    <p class="label">{{ optGroup.label }}:</p>
                    <div class="form-row" :class="optGroup.type" v-for="(opt, key) in optGroup.opts" :key="key">
                      <label>
                        <template v-if="optGroup.type==='radio'">
                          <input type="radio" class="input-radio float-left" :name="'opt'+[index]" :value="opt.id"
                                 :id="opt.id" v-on:change="onChange(index, opt, optGroup)">
                          <label :for="opt.id"></label>
                        </template>
                        <template v-else>
                          <input type="checkbox" class="input-radio" :name="'opt'+[opt.id]" :value="opt.id"
                                 v-model="checkbox[opt.id]" v-on:change="onChange(index, opt, optGroup)">
                        </template>
                        {{ opt.label }}

                        <span v-if="opt.price > 0"><small>$</small>{{ opt.price }}</span>
                      </label>
                      <input type="number" class="float-right" style="width:50px; margin-left:20px" min="1"
                             v-model="extraQuantity[opt.id]" v-if="checkbox[opt.id]"
                             v-on:change="onChange(index, opt, optGroup, true)">
                    </div>
                  </div>

                  <p class="label">Special Request?</p>
                  <small class="text-muted">Add them here. We’ll do our best to make it happen.</small>
                  <div class="form-row">
                    <textarea class="form-control" name="note" v-model="note"></textarea>
                  </div>

                  <div class="woocommerce-checkout-review-order-wrap">
                    <div class="cart-total" v-if="total">
                      <div class="cart-subtotal">
                        <p>
                          <span class="title">Order total:</span>
                          <span class="woocommerce-Price-amount amount">
                              <span class="woocommerce-Price-currencySymbol">$</span>{{ total | amount }}
                            </span>
                        </p>
                      </div>
                    </div>

                    <div class="d-block mb-4 alert alert-message" v-if="online == 0">
                      <p>{{ offlineMsg }}</p>
                    </div>

                    <div v-if="requiredFields.length === 0" class="quantity float-left">
                      <input type="number" class="input-text qty text" min="1" size="4" value="1" v-model="quantity"
                             required>
                      <div class="icon">
                        <a href="javascript:void(0)" v-on:click="changeQuantity(1)" class="number-button plus">+</a>
                        <a href="javascript:void(0)" v-on:click="changeQuantity(0)" class="number-button minus">-</a>
                      </div>
                    </div>

                    <button type="submit" @click="checkout" class="au-btn au-btn--hover has-bg extra-long float-right"
                            v-if="total > 0 && !hasUncheckedRequiredField && online == 1">
                      <i class="fa fa-cart-plus"></i>Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {itemsStorage} from '../main.js';
import moment from 'moment'

export default {
  props: ['item', 'online', 'offlineMsg'],
  data() {
    return {
      items: [],
      quantity: 1,
      extraQuantity: [],
      checkbox: [],
      note: '',
      itemPrice: 0,
      extraItems: [],
      requiredFields: [],
      selectedRequiredFields: 0,
      showMainCounter: true
    }
  },
  mounted() {
    //localStorage.clear()
    $(this.$refs.modal).on('shown.bs.modal', () => {
      this.itemPrice = this.$props.item.price
      var _this = this

      $.each(_this.$props.item.opt_groups, function (k, value) {

        if (value.required === 1 && (value.type === 'radio' || value.type === 'checkbox')) {
          _this.showMainCounter = false;
          _this.requiredFields.push({id: value.id})
        }

      });
    })

    if (localStorage.items) {
      this.items = JSON.parse(localStorage.items)

      itemsStorage.$on('updateItem', (items) => {
        this.items = JSON.parse(localStorage.items)
      });
    }

    $(this.$refs.modal).on('hidden.bs.modal', () => {
      this.quantity = 1
      this.requiredFields = []
      this.extraItems = []
      this.extraQuantity = []
      this.checkbox = []
      this.note = ''
      $(".input-radio").prop("checked", false);
    })
  },
  computed: {
    total() {
      var extraPrices = this.extraItems.reduce((total, value) => Number(total) + (Number(value.price) * value.quantity), 0)

      return Number(extraPrices) + (Number(this.itemPrice) * this.quantity)
    },
    hasUncheckedRequiredField() {
      if (this.requiredFields.length === 0) {
        return false
      } else {
        return this.selectedRequiredFields <= 0;
      }
    }
  },
  methods: {
    onChange: function (index, item, optGroup, changeExtraQuantity = false) {
      var _this = this
      var splice = null
      var removeRequiredField = null

      var updateExtra = {
        id: item.id,
        index: "" + index + "",
        label: item.label,
        price: item.price,
        quantity: 0,
        type: optGroup.type
      }
      console.log(item, optGroup)
      if (optGroup.type == 'checkbox') {
        if (changeExtraQuantity == false) {
          this.extraQuantity[item.id] = 1 //will set default value for extra quantity
        }

        //change quantity of checkbox, if quantity is decreased or increased
        updateExtra.quantity = this.extraQuantity[item.id]


        let requiredOption = false;
        if (optGroup.required === 1) {
          requiredOption = true;
        }

        //check id of checkbox. If exists, it will be removed, it not exists, it will be inserted!
        $.each(_this.extraItems, function (k, value) {
          if (item.id === value.id) {
            splice = k
          }
        });

        if (changeExtraQuantity === false) {
          //if checkbox is unselected remove it, if selected push it
          if (splice == null) {
            if (requiredOption) {
              this.selectedRequiredFields++;
            }
            this.extraItems.push(updateExtra)
          } else {
            if (requiredOption) {
              this.selectedRequiredFields--;
            }
            this.extraItems.splice(splice, 1)
          }
        } else {
          //if quantity is changed, update!
          this.extraItems.splice(splice, 1)
          this.extraItems.push(updateExtra)
        }

      } else if (optGroup.type === 'radio') {
        //remove id from required fields
        $.each(_this.requiredFields, function (k, value) {
          if (optGroup.id === value.id) {
            removeRequiredField = k
          }
        });

        if (removeRequiredField != null) {
          this.requiredFields.splice(removeRequiredField, 1)
        }
        //change quantity of radio, if main quantity is changed
        updateExtra.quantity = this.quantity

        //insert extra items of radio to object
        $.each(_this.extraItems, function (k, value) {
          if (value.index === index) {
            splice = k
          }
        });

        if (splice != null) {
          this.extraItems.splice(splice, 1)
        }

        this.extraItems.push(updateExtra)
      }
      //console.log(this.extraItems)
      console.log(this.selectedRequiredFields)
    },
    changeQuantity: function (increment) {
      if (increment === 0 && this.quantity > 1) {
        this.quantity = this.quantity - 1;
      } else if (increment === 1 && this.quantity >= 1) {
        this.quantity = this.quantity + 1;
      } else {
        this.quantity = 1;
      }

      //update extra quantity

      var key = ''
      var _this = this

      $.each(_this.extraItems, function (k, value) {
        if (value.index === 0) {
          key = k
        }
      });

      if (key !== '' && this.extraItems.length !== 0) {
        this.extraItems[key]['quantity'] = this.quantity
      }

      this.extraItems[key]['quantity'] = this.quantity
    },
    checkout: function () {
      this.items.push({
        id: this.item.id,
        title: this.item.title,
        quantity: this.quantity,
        price: this.itemPrice,
        photo: this.item.img_url,
        special_request: this.note,
        opts: this.extraItems
      })

      if (localStorage.items) {
        localStorage.items = JSON.stringify(this.items)
      } else {
        localStorage.items = JSON.stringify(this.items)
      }

      if (localStorage.total_items) {
        var totalAmount = Number(localStorage.total_amount)
        localStorage.total_items = Number(localStorage.total_items) + Number(this.quantity)
        localStorage.total_amount = Number(totalAmount) + Number(this.total)
      } else {
        localStorage.total_items = this.quantity
        localStorage.total_amount = this.total
      }

      localStorage.last_update = moment()
      itemsStorage.$emit('updateItem', localStorage)

      $("#my-modal").modal('toggle')
      //this.$router.push({name: 'Home'})
    }
  }
}
</script>
