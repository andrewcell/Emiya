<template>
  <v-app-bar>
    <v-app-bar-nav-icon />
    <v-toolbar-title>Title.</v-toolbar-title>
  </v-app-bar>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    @Component({
      components: {}
    })
    export default class Layout extends Vue {
        title = 'Campsite'
    }
</script>