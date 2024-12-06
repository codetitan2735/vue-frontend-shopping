<template>
    <div>
        <ul>
            <li v-for="(item, index) in items" :key="index" class="cart-products">
                <div class="left">
                    <img :src="item.photo.small" :alt="item.title">
                </div>
                <div class="right">
                    <div class="info">
                        <span class="product-name">{{ item.title }}</span>
                        <span class="quantity" v-if="item.price > 0">{{ item.quantity }} x <strong>${{ item.price }}</strong></span>
                    </div>
                    <div class="info" v-for="(ext, index) in item.opts" :key="index">
                        <small>
                            x{{ ext.quantity}} {{ ext.label}} - <strong>{{ ext.price }}</strong>
                        </small>
                    </div>
                    <a href="#" aria-label="Remove this item" class="remove-item" v-on:click.prevent="deleteItem(index, item)">
                        <span class="lnr lnr-cross"></span>
                    </a>
                </div>
            </li>
        </ul>

        <p class="total">
            <strong>Subtotal:</strong> ${{ total_amount | amount }}
        </p>

        <div class="buttons">
            <router-link  v-if="$route.path != '/'" :to="{ name: 'Home' }" class="button">Back to menu</router-link>
            <router-link  v-if="$route.path == '/'" :to="{ name: 'Viewcart' }" class="button">View cart</router-link>
            <router-link  v-if="$route.path != '/' && $route.path != '/viewcart'" :to="{ name: 'Viewcart' }" class="button checkout">View cart</router-link>
            <button  v-if="$route.path == '/' || $route.path == '/viewcart'" class="button checkout" @click.prevent="checkout()">Checkout</button>
        </div>
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