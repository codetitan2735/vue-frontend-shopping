<template>
  <div :style="mainStyle">
    <vue-headful
    :title="data.title"
    :head="{
        'link[rel=icon]': {href: data.favicon_uri}
    }"
    />
    <app-header v-bind:data="data"></app-header>
    <div>
      <section class="page-info set-bg" v-bind:style="{ backgroundImage: `url('${data.bg_img_url + '?v='+data.last_updated}')`}"></section>
    </div>
    <router-view v-bind:data="data"/>
    <app-footer v-bind:data="data"></app-footer>
  </div>
</template>

<script>



const url = process.env.ROOT_API

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import axios from 'axios'
import moment from 'moment'
import { itemsStorage } from './main.js'

export default {
  components: {
    'app-header': Header,
    'app-footer': Footer,
  },
  data () {
    return {
      data: [],
      lastUpdate: '',
      mainStyle: "--main: #666666; --main-hover: #555555"
    }
  },
  mounted() {
		if (localStorage.last_update) {
			this.lastUpdate = localStorage.last_update
		}
		itemsStorage.$on('updateItem', (i) => {
			this.lastUpdate = localStorage.last_update
    });

    this.clearStorage()
	},
  created: function() {
    axios.get(url)
    .then(response => {
      this.data = response.data.data
      localStorage.stripe_key = this.data.stripe_pub_key
      this.mainStyle = "--main: "+response.data.data.colors.primary+"; --main-hover: "+response.data.data.colors.primary_darker
    })
    .catch(err => {

    })

    this.clearStorage()
  },
  methods: {
    clearStorage: function() {
      var now = moment();
      var duration = moment.duration(now.diff(this.lastUpdate));

      if(localStorage.last_update == '' || duration.asHours() > 3){
        localStorage.items = [];
        localStorage.calc = [];
        localStorage.total_items = 0;
        localStorage.total_amount = 0;
        localStorage.last_update = moment()
      }
    }
  }
}
</script>
