<template>
  <div>
    <footer>
      <!-- FOOTER TOP -->
      <div class="ft-top">
        <div class="container">
          <div class="ft-top-wrapper">

            <div class="social">
                <template v-for="(social, key) in data.social_links">
                  <a :href="social.url" :key="key" :class="social.icon" target="_blank"></a>
                </template>
            </div>

            <div class="ft-logo">
              <router-link to="/">
                <img v-bind:src="data.logo_img_url">
              </router-link>
            </div>

            <div class="row justify-content-between justify-content-xl-start">
              <div class="col-md-12 ft-col" v-html="data.address_on_footer">
              </div>
            </div>

          </div>
        </div>
      </div>
      <div class="ft-bot">
        <div class="container">
          @ 2019 All Rights Reserved
        </div>
      </div>
    </footer>




    <!-- CLICK TO TOP -->
    <back-to-top visibleoffset="450">
        <router-link :to="{ name: 'Checkout' }" class="fixedcheckout">
            <i class="fa fa-shopping-cart"></i>Checkout
        </router-link>
      <div class="click-to-top">
        <span class="lnr lnr-arrow-up"></span>
      </div>
    </back-to-top>

  </div>
</template>

<script>

export default {
  props:['data'],
  data () {
    return {
    }
  }
}

</script>
