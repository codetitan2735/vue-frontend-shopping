<template>
  <div>
    <modal :item="passedItem" :online="data.online" :offlineMsg="offlineMsg"></modal>
    <section class="section-primary pt-75 pb-113 shop-list">
      <div class="container">
        <div class="row">
          <div class="col-md-4 col-lg-3 d-none d-md-block">
            <div class="sidebar sticky-top">
              <div class="widgets widget_search">
                <input class="form-control" type="text" placeholder="Search" v-model="searchTerm">
                <button class="search-icon">
                  <span class="lnr lnr-magnifier"></span>
                </button>
              </div>
              <!-- CATEGORIES -->
              <div class="widgets widget_categories"
                   :style="{ backgroundColor: `${nav_bg === undefined ? '' : nav_bg}`}">
                <scrollactive>
                  <ul>
                    <li v-for="(c, index) in data.categories" :key="index">
                      <a :href="'#'+c.title" class="scrollactive-item">{{ c.title }}</a>
                    </li>
                  </ul>
                </scrollactive>
              </div>
            </div>
          </div>


          <div class="col-md-8 col-lg-9">
            <div class="d-block mb-4" v-if="data.menu_pdf_url">
              <a v-bind:href="data.menu_pdf_url" class="au-btn au-btn--hover has-bg extra-long" target="_blank">Download
                Menu</a>
            </div>

            <div class="d-block mb-4 alert alert-warning" v-if="message">
              <p>{{ message }}</p>
            </div>

            <div v-if="Object.keys(data).length === 0">
              <p>Loading... Please wait...</p>
            </div>


            <div class="searchbox d-block d-md-none">
              <input type="text" placeholder="Search" aria-label="Search" v-model="searchTerm">
              <i class="fa fa-search"></i>
            </div>

            <div v-for="(c, index) in data.categories" class="products" :key="index"
                 v-if="filteredCategories.includes(c.id)">

              <section :id="c.title" class="row">
                <div class="col-md-12">
                  <h3>{{ c.title }}</h3>
                </div>

                <template v-for="(m, key) in filteredItems">
                  <div v-if="m.cat_id == c.id" class="col-sm-6 col-md-6 col-lg-4" :key="key">
                    <div class="item">
                      <div class="thumb text-center">
                        <a @click="toggleModal(m)" href="javascript:void(0)"
                           class="woocommerce-LoopProduct-link woocommerce-loop-product__link">
                          <img v-bind:src="m.img_url.large" v-bind:alt="m.title">
                        </a>
                      </div>
                      <div class="info">
                        <h5 class="woocommerce-loop-product__title">
                          <a @click="toggleModal(m)" href="javascript:void(0)">{{ m.title }}</a>
                        </h5>
                        <span class="price">
                          <span class="woocommerce-Price-amount amount">
                            <span class="woocommerce-Price-currencySymbol">$</span>{{ showPrice(m) }}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                </template>

              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>

import Modal from './ProductModal.vue';
import ScrollActive from 'vue-scrollactive';

export default {
  components: {
    'modal': Modal,
  },
  props: ['data'],
  data() {
    return {
      searchTerm: '',
      passedItem: '',
      message: '',
      offlineMsg: '',
      price: '',
      extra: 0,
      quantity: 1,
      extraQuantity: [],
      nav_bg: ''
    }
  },
  beforeUpdate: function () {
    this.nav_bg = this.$props.data.colors.nav_bg
    this.message = this.$props.data.messages.caution
    this.offlineMsg = this.$props.data.messages.offline
  },
  computed: {
    filteredItems: function () {
      if (this.$props.data.items === undefined) {
        return [];
      }
      return this.$props.data.items.filter(item => {
        return item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      })
    },
    filteredCategories: function () {
      return this.filteredItems.map((item) => item.cat_id)
    }
  },
  methods: {
    showPrice: function (item) {
      if (item.price > 0) {
        return item.price
      } else if (item.min_price == item.max_price) {
        return item.min_price
      } else if (item.min_price == null || item.min_price == 0) {
        return item.max_price
      } else if (item.max_price == null || item.max_price == 0) {
        return item.min_price
      } else {
        return item.min_price + '-' + item.max_price
      }
    },
    toggleModal: function (item) {
      this.passedItem = item;
      $("#my-modal").modal('show');
    }
  }
}
</script>
