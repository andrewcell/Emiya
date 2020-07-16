<template>
  <v-app>
    <Toolbar
      :title="title"
      @toggle-drawer="$refs.drawer.drawer = !$refs.drawer.drawer"
    />
    <Drawer
      ref="drawer"
    />
    <LoginDialog v-if="loginStatus == false" />
  </v-app>
</template>
<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import Drawer from './Drawer.vue';
import Toolbar from './Toolbar.vue';
import LoginDialog from './LoginDialog.vue';

@Component({
  components: {Drawer, Toolbar, LoginDialog}
})
export default class Layout extends Vue {
    private title = 'DodoSeki';
    loginStatus = false;
}
</script>