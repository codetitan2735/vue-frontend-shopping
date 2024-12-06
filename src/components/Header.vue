<template>
  <header>
    <!-- HEADER ON DESKTOP -->
    <nav class="navbar-desktop">
      <div class="left">
      </div>
      <div class="left">
        <router-link :to="{ name: 'Home' }" class="logo">
          <img v-bind:src="data.logo_img_url">
        </router-link>
      </div>
      <div class="right">
        <div class="action">

          <div class="notify">
            <div class="cart-icon">
              <span class="fa fa-shopping-cart"></span>
              <span class="show-side-header">Cart</span>
              <span class="cart-total">{{ total_items }}</span>
            </div>
            <shopping :total_items="total_items" :type="'desktop'" :min_order_amount="data.min_order_amount" :message="data.messages"></shopping>
          </div>
          <span class="cl-img search-icon" data-toggle="modal" data-target="#modalSearch"></span>
        </div>
      </div>
    </nav>
    
    <nav class="navbar navbar-mobile fixed-top">
        <div class="heading">
          <a :href="data.rest_ws_url" class="logo">
            <img v-bind:src="data.logo_img_url">
          </a>
          <div class="right">
              <button class="navbar-toggler navbar-dark collapsed" @click="showShopping">
                  <i class="fa fa-shopping-cart"></i>
              </button>
              <button v-if="$route.path == '/'" class="navbar-toggler navbar-dark collapsed" @click="showMenu">
                  Menu
              </button>
              <button v-else class="navbar-toggler navbar-dark collapsed" @click="showHome">
                  <router-link :to="{ name: 'Home' }"><i class="fa fa-home"></i></router-link>
              </button>
          </div>
        </div>
        <div class="hide" id="shoppingCart" :class="showShoppingClass">
            <shopping :total_items="total_items" :type="'mobile'" :min_order_amount="data.min_order_amount" :message="data.messages"></shopping>
        </div>
        <div class="hide" id="navbarCollapse" :class="showHomeClass">
            <scrollactive>
                <ul class="navbar-nav mr-auto">
                    <li v-for="(c, index) in data.categories" :key="index">
                        <a :href="'#'+c.title" class="scrollactive-item" data-toggle="collapse" data-target="#navbarCollapse" >{{ c.title }}</a>
                    </li>
                </ul>
            </scrollactive>
        </div>
    </nav>
  </header>
</template>

<script>
import Vue from 'vue'
import { itemsStorage } from '../main.js';
import Shopping from './Shopping.vue';

  export default {
    components: {
      'shopping': Shopping,
    },
    props:['data'],
    data () {
    return {
        'total_items': 0,
        'showShoppingClass': "",
        'showHomeClass': ""
      }
    },
    methods: {
        showShopping() {
            if (this.showShoppingClass == "") this.showShoppingClass = "show";
            else this.showShoppingClass = "";
            this.showHomeClass = "";
        },
        showMenu() {
            if(this.showHomeClass == "") this.showHomeClass = "show";
            else this.showHomeClass = "";
            this.showShoppingClass = "";
        },
        showHome() {
            this.showHomeClass = "";
            this.showShoppingClass = "";
        }
    },
    mounted() {
      if (localStorage.total_items) {
        this.total_items = localStorage.total_items
      }
      else{
        this.total_items = 0
      }

      itemsStorage.$on('updateItem', (total) => {
        this.total_items = localStorage.total_items
      });
    }
  }
</script>
