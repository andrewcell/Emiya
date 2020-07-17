<template>
  <v-app>
    <Toolbar
      :title="title"
      @toggle-drawer="$refs.drawer.drawer = !$refs.drawer.drawer"
      @toggle-toprightdialog="$refs.toprightdialog.toprightdialog = !$refs.toprightdialog.toprightdialog"
    />
    <Drawer
      ref="drawer"
    />
    <LoginDialog
      v-if="loginStatus === false"
      ref="toprightdialog"
    />
  </v-app>
</template>
<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import Drawer from './Drawer.vue';
import Toolbar from './Toolbar.vue';
import LoginDialog from './LoginDialog.vue';
import Axios, {AxiosResponse} from 'axios';
import {decrypt} from '../encryption/AES';
import Vuex from 'vuex';
import LoginStatusStore from './LoginStatusStore';
import {getModule} from 'vuex-module-decorators';

Vue.use(Vuex)

const store = new Vuex.Store({modules: {LoginStatusStore}})

@Component({
  components: {Drawer, Toolbar, LoginDialog}
})
export default class Layout extends Vue {
  private title = 'DodoSeki';
  loginStatus = false;
  username = '';
  module: LoginStatusStore = getModule(LoginStatusStore, this.$store);
  /* mounted() {
    Axios.get('/admin/loginstatus')
            .then((res: AxiosResponse) => {
              const encryptedData = res.data.data;
              const data = JSON.parse(decrypt(encryptedData)) as { username: string; email: string };
              this.module.setLoginStatus(true);
              // this.module.username = data.username;
            })
  }*/
}
</script>