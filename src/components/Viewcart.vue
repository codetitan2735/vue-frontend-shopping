<template>
  <div>
    <main>
      <v-dialog/>

      <!-- SHOPPING CHECKOUT -->
      <section class="checkout-page section-primary">
        <div class="container">
          <div class="d-block mb-4">
            <router-link :to="{ name: 'Home' }" class="au-btn au-btn--hover has-bg extra-long active">
              <span class="lnr lnr-arrow-left"></span>
              <span style="padding-left:10px">Back to Home</span>
            </router-link>
          </div>
          <div class="woocommerce">

            <div class="woocommerce-checkout">
              <div class="row">
                <div class="col-md-12 viewcart">
                  <h5 id="order_review_heading">View cart</h5>

                  <div class="row item" v-for="(item, index) in items" :key="index">
                    <div class="col-md-2 col-xs-12 thumb">
                      <img :src="item.photo.large">
                    </div>
                    <div class="col-md-7 col-7">
                      <div class="review-wrap">
                        <span class="product-quantity" v-if="item.price > 0">x{{ item.quantity }}</span>
                        <span class="title">{{ item.title }} <span
                          v-if="item.price > 0">- ${{ item.price }}</span></span>
                      </div>
                      <div class="quantity" v-for="(ext, index) in item.opts" :key="index">
                        <small>
                          <span class="product-quantity">x{{ ext.quantity }}</span>
                          <span class="title">{{ ext.label}} - ${{ ext.price}}</span>
                        </small>
                      </div>
                    </div>
                    <div class="col-md-2 col-3 total">
                      ${{ price(item) | amount }}
                    </div>
                    <div class="col-md-1 col-2 remove">
                      <span class="lnr lnr-cross" @click.prevent="deleteItem(index, item)"></span>
                    </div>
                  </div>

                  <div class="row buttons">
                    <div class="col-md-6 text-center">
                      <router-link :to="{ name: 'Home' }" class="button">Back to menu</router-link>
                    </div>
                    <div class="col-md-6 text-center">
                      <button class="button checkout" @click.prevent="checkout()">Checkout</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>

  const url = process.env.CALC_API

  import {itemsStorage} from '../main.js'
  import cardElement from './CardElement.vue'
  import moment from 'moment'

  export default {
    components: {
      'cardElement': cardElement
    },
    props: ['data'],
    data() {
      return {
        items: [],
        subTotal: 0
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
        this.items = JSON.parse(localStorage.items)
        this.subTotal = localStorage.total_amount
      });
    },
    methods: {
      price: function (item) {
        var extraPrices = item.opts.reduce((total, value) => Number(total) + (Number(value.price) * Number(value.quantity)), 0)

        return Number((item.quantity * item.price) + extraPrices)
      },
      deleteItem: function (index, item) {
        var extraPrices = item.opts.reduce((total, value) => Number(total) + (Number(value.price) * Number(value.quantity)), 0);
        this.items.splice(index, 1);
        localStorage.items = JSON.stringify(this.items);
        localStorage.total_items = localStorage.total_items - item.quantity;
        localStorage.total_amount = localStorage.total_amount - (item.quantity * item.price) - extraPrices;
        localStorage.last_update = moment()

        itemsStorage.$emit('updateItem', localStorage)
      },
      checkout: function () {
        if (this.subTotal >= Number(this.$props.data.min_order_amount)) {
          this.$router.push({name: 'Checkout'})
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
    }
  }

</script>
