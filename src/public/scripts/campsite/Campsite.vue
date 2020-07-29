<template>
  <v-container v-if="this.$store.state.CampsiteStore.CampsiteCurrent == null">
    <CampsiteEmpty />
  </v-container>
  <v-container v-else>
    <CampsiteCurrent />
  </v-container>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator';
  import Axios from 'axios';
  import {EmiyaJ} from '../emiyaj/sendWithToken';
  import CampsiteCurrent from './CampsiteCurrent.vue';
  import CampsiteEmpty from './CampsiteEmpty.vue';

  @Component({
    components: {
      CampsiteCurrent, CampsiteEmpty
    }
  })
  export default class CampsiteMain extends Vue {
    @Prop(String) prop: string | undefined

  }
</script>

<style scoped>

</style>