<template>
  <div>
    <Layout />
    <v-container>
    </v-container>
  </div>
</template>
<script lang='ts'>
  import {Vue, Component} from 'vue-property-decorator';
  import Layout from '../vuetify/Layout.vue';
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