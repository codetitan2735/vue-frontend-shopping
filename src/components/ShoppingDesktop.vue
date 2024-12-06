<template>
  <div>
    <div id="woocommerce_widget_cart-2" class="widget woocommerce widget_shopping_cart">
      <div class="widget_shopping_cart_content">
        <div v-if="total_items > 0">
          <ul class="woocommerce-mini-cart cart_list product_list_widget ">

            <li v-for="(item, index) in items" class="woocommerce-mini-cart-item mini_cart_item clearfix" :key="index">
              <a href="#" class="remove remove_from_cart_button" aria-label="Remove this item" v-on:click.prevent="deleteItem(index, item)">
                <span class="lnr lnr-cross"></span>
              </a>
              <a href="#" class="image-holder">
                <img :src="item.photo.small" class="attachment-shop_thumbnail size-shop_thumbnail wp-post-image" :alt="item.title">
                <span class="product-name">{{ item.title }}</span>
              </a>
              <span class="quantity" v-if="item.price > 0">
                  {{ item.quantity }} x
                  <strong>${{ item.price }}</strong>
              </span>
              <span class="quantity" v-for="(ext, index) in item.opts" :key="index">
                  <small>
                    x{{ ext.quantity}} {{ ext.label}} - <strong>{{ ext.price }}</strong>
                  </small>
              </span>
            </li>

          </ul>
          <p class="woocommerce-mini-cart__total total">
            <strong>Subtotal:</strong>
              ${{ total_amount | amount }}
          </p>
        </div>
        <div v-else class="text-center">
            <span>No products in the cart.</span>
        </div>
        <p v-if="total_items > 0" class="woocommerce-mini-cart__buttons buttons">
          <router-link  v-if="$route.path != '/'" :to="{ name: 'Home' }" class="button">Back to menu</router-link>
          <router-link  v-if="$route.path == '/'" :to="{ name: 'Viewcart' }" class="button">View cart</router-link>
          <router-link  v-if="$route.path != '/' && $route.path != '/viewcart'" :to="{ name: 'Viewcart' }" class="button checkout">View cart</router-link>
          <button  v-if="$route.path == '/' || $route.path == '/viewcart'" class="button checkout" type="button" @click.prevent="checkout()">Checkout</button>
        </p>
      </div>
    </div>
    <!-- END WIDGET SHOPPING -->
  </div>
</template>

<script>
export default {
    props:['total_items', 'items', 'total_amount'],
    methods: {
        deleteItem(index, item){
    	    this.$parent.deleteItem(index, item);
        },
        checkout() {
          this.$parent.checkout()
        }
    }
}
</script>

