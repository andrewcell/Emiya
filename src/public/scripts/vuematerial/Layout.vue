<template>
  <v-app>
    <v-app-bar
      absolute
      color="green"
      flat
      @click.stop="drawer = !drawer"
    >
      <v-app-bar-nav-icon class="white--text" />
      <v-toolbar-title
        class="white--text"
      >
        {{ title }}
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        color="green"
        depressed
        class="white--text"
      >
        Login
      </v-btn>
    </v-app-bar>
    <Drawer :drawer="drawer" />
  </v-app>
</template>
<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import Drawer from './Drawer.vue';
@Component({
  components: {Drawer}
})
export default class Layout extends Vue {
    private title = 'DodoSeki'
    drawer = false
    @Watch('group')
    change() {
      this.drawer = false
    }
}
</script>