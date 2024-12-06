<template>
  <div>
    <main>
      <v-dialog/>
      <section class="section-primary pt-75 complete-order" v-if="Object.keys(paymentData).length > 0">
        <div class="container">
          <div class="row">
            <div class="wrapper red d-block mx-auto" v-if="!paymentData.status">
              <div class="header__wrapper">
                <div class="header">
                  <div class="sign"><span></span></div>
                </div>
              </div>
              <h1>Whooops</h1>
              <p>{{ paymentData.message }}</p>

              <router-link :to="{ name: 'Home' }">Back to Home</router-link>
            </div>

            <div class="wrapper green d-block mx-auto" v-if="paymentData.status">
              <div class="header__wrapper">
                <div class="header">
                  <div class="sign"><span></span></div>
                </div>
              </div>
              <h1>Thank you!</h1>
              <p>{{ paymentData.message }}</p>
              <p>Order ID: {{ paymentData.order_id }}</p>
              <router-link :to="{ name: 'Home' }">Back to Home</router-link>
            </div>
          </div>
        </div>
      </section>
      <!-- SHOPPING CHECKOUT -->
      <section class="checkout-page section-primary" v-else>
        <div class="container">
          <div class="d-block mb-4">
            <router-link :to="{ name: 'Home' }" class="au-btn au-btn--hover has-bg extra-long active">
              <span class="lnr lnr-arrow-left"></span>
              <span style="padding-left:10px">Back to Home</span>
            </router-link>
          </div>
          <div class="woocommerce">

            <form method="post" class="checkout woocommerce-checkout" @submit.prevent="pay">
              <div class="row">
                <div class="col-md-6 col-lg-7">
                  <div class="woocommerce-billing-fields">
                    <h5>Billing and Shipping Details</h5>
                    <div class="woocommerce-billing-fields__field-wrapper">

                      <div class="row">
                        <div class="col-md-6">
                          <p
                            class="form-row form-row-first validate-required woocommerce-invalid woocommerce-invalid-required-field">
                            <label for="billing_first_name">First Name
                              <span class="required" title="required">*</span>
                            </label>
                            <input class="form-control" type="text" v-model="fields.firstname" required>
                          </p>
                        </div>
                        <div class="col-md-6">
                          <p class="form-row form-row-last validate-required">
                            <label for="billing_last_name">Last Name
                              <span class="required" title="required">*</span>
                            </label>
                            <input class="form-control" type="text" v-model="fields.lastname" required>
                          </p>
                        </div>
                      </div>

                      <p class="form-row form-row-wide address-field validate-required">
                        <label for="billing_address_1" class="">Address
                          <span class="required" title="required">*</span>
                        </label>
                        <input type="text" class="form-control" v-model="fields.address" placeholder="Street Address"
                               required>
                        <input type="text" class="form-control" v-model="fields.extra_address"
                               placeholder="Apartment, suite, unit etc. (optional)">
                      </p>

                      <div class="row">
                        <div class="col-md-4">
                          <p class="form-row form-row-first validate-required">
                            <label for="billing_city">City
                              <span class="required" title="required">*</span></label>
                            <input type="text" class="form-control" v-model="fields.city" required>
                          </p>
                        </div>
                        <div class="col-md-4">
                          <p class="form-row form-row-last validate-required">
                            <label for="billing_state">State
                              <span class="required" title="required">*</span>
                            </label>
                            <select class="form-control" v-model="fields.state">
                              <template v-for="(state, index) in data.states">
                                <option :key="index" :value="state.id">{{ state.name }}</option>
                              </template>
                            </select>
                          </p>
                        </div>
                        <div class="col-md-4">
                          <p class="form-row form-row-first validate-required">
                            <label for="billing_postcode">ZIP code
                              <span class="required" title="required">*</span>
                            </label>
                            <input type="text" class="form-control" v-model="fields.zip_code" @change="changeDelivery()"
                                   required>
                          </p>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-12">
                          <p class="form-row form-row-wide address-field validate-required">
                            <label for="billing_delivery">Delivery
                              <span class="required" title="required">*</span>
                            </label>
                          <div class="delivery_labels">
                            <label v-for="(del, index) in delivery" :key="index">
                              <input type="radio" name="del" :value="del.value" :checked="del.value == fields.delivery"
                                     v-model="fields.delivery" @change="changeDelivery()">{{ del.label }}
                            </label>
                          </div>
                          </p>
                        </div>
                      </div>

                      <div class="woocommerce-additional-fields" v-if="data.address && fields.delivery == 1">
                        <div class="woocommerce-additional-fields__field-wrapper">
                          <p class="form-row">
                            <label>
                              <small></small>
                            </label>
                          </p>
                          <p id="pickup_location">
                            {{ data.address }}
                          </p>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <p class="form-row form-row-first validate-required validate-phone">
                            <label for="billing_phone" class="">Phone
                              <span class="required" title="required">*</span>
                            </label>
                            <input type="tel" class="form-control" v-model="fields.phone" required>
                          </p>
                        </div>
                        <div class="col-md-6">
                          <p class="form-row form-row-last validate-required validate-email">
                            <label for="billing_email" class="">Email address
                              <span class="required" title="required">*</span>
                            </label>
                            <input type="email" class="form-control" v-model="fields.email" required>
                          </p>
                        </div>
                      </div>

                      <div class="woocommerce-additional-fields">
                        <h5>Additional information</h5>
                        <div class="woocommerce-additional-fields__field-wrapper">
                          <p class="form-row notes">
                            <label for="order_comments" class="">Order notes</label>
                            <textarea name="order_comments" class="form-control" v-model="fields.special_request"
                                      placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                          </p>
                        </div>
                      </div>


                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-lg-5">
                  <div class="woocommerce-checkout-review-order-wrap">
                    <h5 id="order_review_heading">Your order</h5>

                    <div id="order_review" class="woocommerce-checkout-review-order">
                      <table class="shop_table woocommerce-checkout-review-order-table">
                        <thead>
                        <th>Product</th>
                        <th>Total</th>
                        </thead>
                        <tbody>
                        <tr class="cart_item" v-for="(item, index) in items" :key="index">
                          <td class="product-name">
                            <div class="review-wrap">
                              <div v-if="item.price > 0">
                                <span class="product-quantity">x{{ item.quantity }}</span>
                                <span class="rv-titel">{{ item.title }} - ${{ item.price }}</span>
                              </div>
                              <div v-else>
                                <span class="rv-titel">{{ item.title }}</span>
                              </div>
                              <span class="rv-titel">
																	<small>{{ item.special_request }}</small>
																</span>
                            </div>

                            <div class="quantity" v-for="(ext, index) in item.opts" :key="index">
                              <small>
                                <span class="product-quantity">x{{ ext.quantity }}</span>
                                <span class="rv-titel">{{ ext.label}} - ${{ ext.price}}</span>
                              </small>
                            </div>
                          </td>
                          <td class="product-total">
                            ${{ price(item) | amount }}
                          </td>
                        </tr>
                        <template v-if="subTotal > 0">
                          <tr class="price-total">
                            <td><strong>Subtotal</strong></td>
                            <td class="product-total">${{ subTotal | amount }}</td>
                          </tr>
                          <tr class="price-total" v-if="getData.tax > 0">
                            <td><strong>Tax</strong></td>
                            <td class="product-total">${{ getData.tax | amount }}</td>
                          </tr>
                          <tr class="price-total" v-if="showTip > 0">
                            <td><strong>Tip</strong></td>
                            <td class="product-total">${{ showTip | amount }}</td>
                          </tr>
                          <tr class="price-total" v-if="promo_description">
                            <td><strong>Applied promo</strong></td>
                            <td class="product-total" style="color: green">{{promo_description}}</td>
                          </tr>
                          <tr class="price-total">
                            <td><strong>Total</strong></td>
                            <td class="product-total">${{ total | amount }}</td>
                          </tr>
                        </template>
                        </tbody>
                      </table>
                      <div v-if="subTotal>0">
                        <div class="row">
                          <div class="col-sm-12">
                            <label for="tip-amount">Tip amount</label>
                            <input type="number" class="form-control" id="tip-amount" placeholder="Tip amount" name="tip" v-model="tip" @blur="addTip">
                          </div>
                        </div>
                        <div class="row" v-if="promo_description===null">
                          <div class="col-sm-12">
                            <label for="promo-code">Promo code</label>
                            <input type="text" class="form-control" id="promo-code" placeholder="Promo Code" name="promo_code" v-model="promo_code" @blur="applyPromo">
                          </div>
                        </div>
                      </div>
                      <cardElement v-if="subTotal > 0" @paymentData="getPaymentData"></cardElement>
                    </div>
                  </div>
                </div>
              </div>
            </form>

          </div>
        </div>
        <!--Delivery modal-->
        <div class="delivery-modal">
          <div class="modal fade" ref="deliveryModal" id="deliveryModal" tabindex="-1" role="dialog"
               aria-labelledby="exampleModalLabel" aria-hidden="true" data-keyboard="false" data-backdrop="static">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel"><i class="fas fa-truck"></i>
                    Delivery Type</h5>
                </div>
                <div class="modal-body">
                  <div class="address-field validate-required">
                    <div class="delivery_labels">
                      <label v-for="(del, index) in delivery" :key="index" style="font-size: 25px">
                        <input type="radio" name="del" :value="del.value" :checked="del.value == fields.delivery"
                               v-model="fields.delivery" @change="changeDeliveryModal()">{{ del.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--Delivery modal-->
      </section>
    </main>
  </div>
</template>

<script>

  const url = process.env.CALC_API

  import {events, itemsStorage} from '../main.js'
  import cardElement from './CardElement.vue'
  import axios from 'axios'
  import moment from 'moment'

  export default {
    components: {
      'cardElement': cardElement
    },
    props: ['data'],
    data() {
      return {
        delivery: [
          {value: 1, label: 'Pick up'},
          {value: 2, label: 'Delivery'}
        ],
        tip: '',
        promo_code: null,
        promo_description: null,
        showTip: 0,
        subTotal: 0,
        items: [],
        fields: {
          firstname: '',
          lastname: '',
          address: '',
          // delivery: 1,
          delivery: null,
          extra_address: '',
          city: '',
          state: 33,
          zip_code: '',
          phone: '',
          email: '',
          special_request: '',
        },
        calcData: [],
        getData: [],	//comes from central server,
        paymentData: []
      }
    },
    mounted() {
      if (localStorage.items) {
        this.items = JSON.parse(localStorage.items)
      }
      if (localStorage.total_amount) {
        this.subTotal = localStorage.total_amount
      }
      itemsStorage.$on('updateItem', (i) => {
          if(localStorage.items.length > 1){
              this.items = JSON.parse(localStorage.items);
              this.subTotal = localStorage.total_amount;
              this.calc()
          }
      });

      localStorage.last_update = moment();
      this.calc()

      $('#deliveryModal').modal();
    },
    computed: {
      total: function () {
        return Number(this.subTotal) + Number(this.getData.tax) + Number(this.showTip)
      }
    },
    methods: {
      calc: function () {
        //send items to central server and get some data (total, subtotal, uid, tax)
        axios.post(url, {
          items: this.items,
          promo_code: this.promo_code
        })
          .then(response => {
            console.log(this.items);
            //console.log(response.data)
            this.getData = response.data;
            this.subTotal = this.getData.sub_total;
            if (this.getData.promo_description)
              this.promo_description = this.getData.promo_description;
          })
          .catch(err => {
          })
      },
      price: function (item) {
        var extraPrices = item.opts.reduce((total, value) => Number(total) + (Number(value.price) * Number(value.quantity)), 0)
        return Number((item.quantity * item.price) + extraPrices)
      },
      addTip: function () {
        this.showTip = this.tip
      },

      applyPromo: function () {
        this.calc();

      },
      changeDelivery: function () {
        let zip = parseInt(this.fields.zip_code);

        if (this.fields.delivery === 2 && !this.$props.data.accepted_zips.includes(zip)) {
          this.$nextTick(() => {
            this.fields.delivery = 1;
          });

          var alertText = this.$props.data.messages.unsupported_address;

          if (this.fields.zip_code === '') {
            alertText = 'Please, add your zip code first'
          }

          this.$modal.show('dialog', {
            title: 'Notice!',
            text: alertText,
            buttons: [
              {
                title: 'Close',
              }
            ]
          })
        }
      },
      pay() {

        if (this.$props.data.pnline === 0) {
          this.$modal.show('dialog', {
            title: 'Notice!',
            text: this.$props.data.messages.offline,
            buttons: [
              {
                title: 'Close',
              }
            ]
          })
        } else {
          if (this.subTotal >= Number(this.$props.data.min_order_amount)) {
            localStorage.calc = JSON.stringify({uid: this.getData.uid, fields: this.fields, tip: this.showTip});
            events.$emit('payEmit')
          } else {
            this.$modal.show('dialog', {
              title: 'Notice!',
              text: this.$props.data.messages.min_order_amount,
              buttons: [
                {
                  title: 'Close',
                }
              ]
            })
          }
        }
      },
      getPaymentData(value) {
        this.paymentData = value;
        if (this.paymentData.status) {
          localStorage.items = [];
          localStorage.calc = [];
          localStorage.total_items = 0;
          localStorage.total_amount = 0;
          itemsStorage.$emit('updateItem', localStorage);
          window.scrollTo(0,0);
        }
      },

      changeDeliveryModal() {
        $('#deliveryModal').modal('hide');
      }
    }
  }

</script>
