<template>
  <v-app>
    <Layout />
    <v-tabs
      background-color="green"
      dark
      style="flex: 0 !important"
    >
      <v-tab
        to="/"
        exact
      >
        {{ l('campsite.layout.main') }}
      </v-tab>
      <v-tab
        to="/history"
        exact
      >
        {{ l('campsite.layout.history') }}
      </v-tab>
    </v-tabs>
    <router-view />
  </v-app>
</template>
<script lang='ts'>
  import {Vue, Component} from 'vue-property-decorator';
  import Layout from '../vuetify/Layout.vue';
  import {l} from '../locale';

  @Component({
    components: {
      Layout
    }
  })
  export default class App extends Vue {
    private title = 'Campsite'
    l = l;
  }
</script>
<style lang="sass">
.title
  color: hotpink
</style>