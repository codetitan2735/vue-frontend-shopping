<template>
    <div>
        <main>
            <app-menu :data="data"></app-menu>
        </main>
    </div>
</template>

<script>

import Menu from './Menu.vue';

export default {
  components: {
    'app-menu': Menu,
  },
  props:['data']
}

</script>
