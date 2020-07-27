<template>
  <h1>dasd</h1>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator';

  @Component
  export default class CampsiteMain extends Vue {
    @Prop(String) prop: string | undefined
  }
</script>

<style scoped>

</style>