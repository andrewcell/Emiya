<template>
  <v-app>
    <Toolbar
      :title="title"
      @toggle-drawer="$refs.drawer.drawer = !$refs.drawer.drawer"
    />
    <Drawer
      ref="drawer"
    />
  </v-app>
</template>
<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import Drawer from './Drawer.vue';
import Toolbar from './Toolbar.vue';

@Component({
  components: {Drawer, Toolbar}
})
export default class Layout extends Vue {
    private title = 'DodoSeki'
}
</script>