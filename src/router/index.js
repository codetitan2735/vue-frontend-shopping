import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Checkout from '@/components/Checkout'
import Viewcart from '@/components/Viewcart'

Vue.use(Router)

export default new Router({
  mode: 'history',

  routes: [
    {
      path: '/',
      name: 'Home',
      component: Index
    },
    {
      path: '/checkout',
      name: 'Checkout',
      component: Checkout
    },
	{
      path: '/viewcart',
      name: 'Viewcart',
      component: Viewcart
    }
  ],
  scrollBehavior (to, from, savedPosition) {
      return { x: 0, y: 0 }
  },
})
