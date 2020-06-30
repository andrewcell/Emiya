<template>
  <div class="container">
    <h1 class="title">
      It works! - {{ title }}
    </h1>
  </div>
</template>
<script lang='ts'>
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class App extends Vue {
    private title = 'Campsite'
  }
</script>
<style lang="scss">
.title {
  color: hotpink;
}
</style>