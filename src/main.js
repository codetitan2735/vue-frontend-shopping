import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import BackToTop from 'vue-backtotop'
import VueScrollactive from 'vue-scrollactive'
import vueHeadful from 'vue-headful';
import VModal from 'vue-js-modal'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
//import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/fonts/linearicons/style.css'
import './assets/fonts/material-design-iconic-font/css/material-design-iconic-font.min.css'
import './assets/fonts/font-awesome-5/css/fontawesome-all.min.css'
import './assets/css/animate.css'
import './assets/css/style.css'

export const itemsStorage = new Vue()
export const events = new Vue()

if(!localStorage.total_items){
  localStorage.total_items = 0
}

if(!localStorage.total_amount){
  localStorage.total_amount = 0
}

if(!localStorage.calc){
  localStorage.calc = []
}

if(!localStorage.items){
  localStorage.items = []
}

if(!localStorage.stripe_key){
  localStorage.stripe_key = ''
}

if(!localStorage.last_update){
  localStorage.last_update = ''
}

Vue.config.productionTip = false

Vue.use(VueScrollactive)
Vue.use(BackToTop)
Vue.use(VModal, { dialog: true })
Vue.component('vue-headful', vueHeadful);
//Vue.use(BootstrapVue);

Vue.filter('amount', function (value) {
  if (!value) return ''
  return Number(value).toFixed(2)
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})