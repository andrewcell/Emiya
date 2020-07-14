<template>
  <div>
    <Layout />
    <h1 class="title">
      It works! - {{ title }}
    </h1>
  </div>
</template>
<script lang='ts'>
  import {Vue, Component} from 'vue-property-decorator';
  import Layout from '../vuematerial/Layout.vue';
  @Component({
    components: {
      Layout
    }
  })
  export default class App extends Vue {
    private title = 'Campsite'
  }
</script>
<style lang="sass">
.title
  color: hotpink
</style>