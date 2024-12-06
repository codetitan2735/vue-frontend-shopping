<template>
  <main>
    <v-dialog/>
    <div v-if="type=='desktop'">
        <ShoppingDesktop :items="items" :total_items="total_items" :total_amount="total_amount"></ShoppingDesktop>
    </div>
    <div v-else>
      <ShoppingMobile :items="items" :total_items="total_items" :total_amount="total_amount"></ShoppingMobile>
    </div>
  </main>
</template>

<script>

import { itemsStorage } from '../main.js'
import ShoppingDesktop from './ShoppingDesktop.vue'
import ShoppingMobile from './ShoppingMobile.vue'
import moment from 'moment'

export default {
  components: {
    'ShoppingDesktop': ShoppingDesktop,
    'ShoppingMobile': ShoppingMobile,
  },
  props:['total_items', 'type', 'min_order_amount', 'message'],
	data () {
		return {
      items: [],
      total_amount : 0
		}
	},
  mounted() {

		if (localStorage.items) {
      this.items = JSON.parse(localStorage.items)
    }

    //console.log(this.items)

    if (localStorage.total_amount) {
      this.total_amount = localStorage.total_amount
    }

    itemsStorage.$on('updateItem', (i) => {
      if(localStorage.items.length > 0){
          this.items = JSON.parse(localStorage.items)
          this.total_amount = localStorage.total_amount
      }
    });

  },
  methods: {
    deleteItem: function(index, item) {

			var extraPrices = item.opts.reduce((total, value) => Number(total) + (Number(value.price) * Number(value.quantity)), 0)
      this.items.splice(index, 1)
      localStorage.items = JSON.stringify(this.items)
      localStorage.total_items = localStorage.total_items - item.quantity
      localStorage.total_amount = localStorage.total_amount - (item.quantity * item.price) - extraPrices
      localStorage.last_update = moment()

      itemsStorage.$emit('updateItem', localStorage)
    },
    checkout: function() {
      if(this.total_amount >= Number(this.$props.min_order_amount)){
        this.$router.push({name: 'Checkout'})
      }
      else{
        this.$modal.show('dialog', {
          title: 'Notice!',
          text: this.$props.message.min_order_amount,
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
