<template>
    <div>
        <div id="payment" class="woocommerce-checkout-payment">
            <ul class="wc_payment_methods payment_methods methods">
                <li class="wc_payment_method payment_method_cheque">
                    <label for="payment_method_cheque">
                        <input type="radio" class="input-radio" name="payment_method" value="cheque" data-order_button_text="" checked="">
                        Credit / Debit Cart
                        <img src="https://brooklyn.memoshishcatering.com/wp-content/plugins/wc-gateway-stripe/assets/images/credit-cards/visa.png" alt="visa" scale="0">
                        <img src="https://brooklyn.memoshishcatering.com/wp-content/plugins/wc-gateway-stripe/assets/images/credit-cards/mastercard.png" alt="mastercard" scale="0">
                        <img src="https://brooklyn.memoshishcatering.com/wp-content/plugins/wc-gateway-stripe/assets/images/credit-cards/american-express.png" alt="american-express" scale="0">
                        <img src="https://brooklyn.memoshishcatering.com/wp-content/plugins/wc-gateway-stripe/assets/images/credit-cards/discover.png" alt="discover" scale="0">
                        <span class="checkmark"></span>
                    </label>
                    <p>Pay securely using your credit card.</p>
                    <div class="stripe-form" style="margin-left: 0">
                        <div class="row mt15">
                            <div class="col-md-12">
                                <label for="card_number">Card number <span class="required">*</span></label>
                                <div class="uk-form-controls">
                                    <div id="card-number" class="form-control" :class="{ 'is-invalid': cardNumberError }"></div>
                                    <small class="text-danger" v-if="cardNumberError">
                                        {{cardNumberError}}
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div class="row mt15">
                            <div class="col-md-6">
                                <label for="billing_last_name">Expiry (MM/YY) <span class="required">*</span></label>
                                <div class="uk-form-controls">
                                    <div id="card-expiry" class="form-control" :class="{ 'is-invalid': cardExpiryError }"></div>
                                    <small class="text-danger" v-if="cardExpiryError">
                                        {{cardExpiryError}}
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label for="billing_first_name">Card code <span class="required">*</span></label>
                                <div class="uk-form-controls">
                                    <div id="card-cvc" class="form-control" :class="{ 'is-invalid': cardCvcError }"></div>
                                    <small class="text-danger" v-if="cardCvcError">
                                        {{cardCvcError}}
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <small class="text-danger" v-if="stripeError">
                                    {{stripeError}}
                                </small>
                            </div>
                        </div>
                    </div>

                </li>
            </ul>
            <div class="form-row place-order">
                <button type="submit" class="au-btn au-btn--hover has-bg" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    &nbsp;{{ buttonText }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>

import { events } from '../main.js'
import Vue from 'vue'
import axios from 'axios'

export default {
    data () {
        return {
            card: {
            cvc: '',
            number: '',
            expiry: ''
            },
            //elements
            cardNumber: '',
            cardExpiry: '',
            cardCvc: '',
            stripe: null,

            // errors
            stripeError: '',
            cardCvcError: '',
            cardExpiryError: '',
            cardNumberError: '',
            loading: false,
            calcData: [],
            buttonText: 'Place order'
        }
    },
    mounted() {

        this.setUpStripe();
        events.$on('payEmit', this.pay)
    },
    methods: {
        setUpStripe() {
            if (window.Stripe === undefined) {
                alert('Stripe V3 library not loaded!');
            } else {
                const stripe = window.Stripe(localStorage.stripe_key);
                this.stripe = stripe;
                const elements = stripe.elements();
                this.cardCvc = elements.create('cardCvc');
                this.cardExpiry = elements.create('cardExpiry');
                this.cardNumber = elements.create('cardNumber',{
                    placeholder: '•••• •••• •••• ••••'
                });

                this.cardCvc.mount('#card-cvc');
                this.cardExpiry.mount('#card-expiry');
                this.cardNumber.mount('#card-number');

                this.listenForErrors();
            }
        },

        listenForErrors() {
            const vm = this;

            this.cardNumber.addEventListener('change', (event) => {
                vm.toggleError(event);
                vm.cardNumberError = ''
                vm.card.number = event.complete ? true : false
            });

            this.cardExpiry.addEventListener('change', (event) => {
                vm.toggleError(event);
                vm.cardExpiryError = ''
                vm.card.expiry = event.complete ? true : false
            });

            this.cardCvc.addEventListener('change', (event) => {
                vm.toggleError(event);
                vm.cardCvcError = ''
                vm.card.cvc = event.complete ? true : false
            });
        },

        toggleError (event) {
            if (event.error) {
                this.stripeError = event.error.message;
            } else {
                this.stripeError = '';
            }
        },

        pay() {
            this.clearCardErrors();
            let valid = true;

            if (!this.card.number) {
                valid = false;
                this.cardNumberError = "Card Number is Required";
            }
            if (!this.card.cvc) {
                valid = false;
                this.cardCvcError = "CVC is Required";
            }
            if (!this.card.expiry) {
                valid = false;
                this.cardExpiryError = "Month is Required";
            }
            if (this.stripeError) {
                valid = false;
            }
            if (valid) {
                this.loading = true
                this.buttonText = 'Please Wait...'
                this.createToken()
            }
        },

        createToken() {
        this.stripe.createToken(this.cardNumber).then((result) => {
            if (result.error) {
                this.stripeError = result.error.message;
                this.loading = false

            } else {
                const token = result.token.id
                this.calcData = JSON.parse(localStorage.calc)

                //send calc data (uid, stripeKey, form fields)
                axios.post('https://api.easy.restaurant/order/new', {
                    uid: this.calcData.uid,
                    stripe_token: token,
                    tip: this.calcData.tip,
                    firstname: this.calcData.fields.firstname,
                    lastname: this.calcData.fields.lastname,
                    address: this.calcData.fields.address,
                    extra_address: this.calcData.fields.extra_address,
                    city: this.calcData.fields.city,
                    state: this.calcData.fields.state,
                    zip_code: this.calcData.fields.zip_code,
                    phone: this.calcData.fields.phone,
                    email: this.calcData.fields.email,
                    special_request: this.calcData.fields.special_request,
                    delivery: this.calcData.fields.delivery
                })
                .then(response => {
                    this.$emit('paymentData', response.data)
                    this.loading = false
                    //console.log(response.data)
                })
                .catch(err => {
                    this.loading = false
                })
            }
            })
        },
        clearCardErrors() {
            this.stripeError = ''
            this.cardCvcError = ''
            this.cardExpiryError = ''
            this.cardNumberError = ''
        },
    }
}

</script>
