<template>
  <v-container>
    <v-card>
      <v-card-title>Add</v-card-title>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator';
  import Axios from 'axios';
  import {EmiyaJ} from '../emiyaj/sendWithToken';

  @Component
  export default class CampsiteMain extends Vue {
    @Prop(String) prop: string | undefined

  }
</script>

<style scoped>

</style>