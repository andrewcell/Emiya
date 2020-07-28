<template>
  <v-app v-if="pageStatus === 0">
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
  <v-app v-else-if="pageStatus === 1 || pageStatus === 2">
    <Layout />
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="8"
      >
        <v-progress-linear
          indeterminate
          rounded
          height="30"
          width="30"
          color="green"
        >
          {{ pageStatus === 1 ? l('campsite.layout.retrieving') : l('campsite.layout.processing') }}
        </v-progress-linear>
      </v-col>
    </v-row>
  </v-app>
</template>
<script lang='ts'>
  import {Vue, Component} from 'vue-property-decorator';
  import Layout from '../vuetify/Layout.vue';
  import {l} from '../locale';
  import {EmiyaJ} from '../emiyaj/sendWithToken';
  import {url} from '../api';

  enum PageStatus {
    NORMAL = 0,
    RETRIEVING = 1,
    PROCESSING = 2,
    UNAUTHORIZED = 3,
    EMPTY = 4
  }

  @Component({
    components: {
      Layout
    }
  })
  export default class App extends Vue {
    private title = 'Campsite'
    l = l;
    pageStatus = PageStatus.RETRIEVING

    created(): void {
      EmiyaJ.getInstance().get(EmiyaJ.path('campsite/'))
        .then(r => {
          console.log(r)
          this.pageStatus = PageStatus.PROCESSING;
          this.pageStatus = PageStatus.NORMAL;
        })
    }

    isPageLoaded(): boolean {
      return this.pageStatus === PageStatus.NORMAL;
    }
  }
</script>
<style lang="sass">
.title
  color: hotpink
</style>