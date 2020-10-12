<template>
  <v-app>
    <Layout />
    <v-tabs
      background-color="green"
      dark
      style="flex: 0 !important"
    >
      <v-tab
        to="/downloadlog"
        exact
      >
        Emibo download log
      </v-tab>
      <v-tab
        to="/newswrite"
        exact
      >
        Users
      </v-tab>
    </v-tabs>
    <router-view />
  </v-app>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import Layout from '../vuetify/Layout.vue';

@Component({
  components: {
    Layout
  }
})
export default class Cp extends Vue {
  mounted() {

  }
}
</script>