<template>
  <div>
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
    <AccountDialog
      v-else
      ref="toprightdialog"
      :username="username"
    />
  </div>
</template>
<script lang="ts">
import {Vue, Component, Watch} from 'vue-property-decorator';
import Drawer from './Drawer.vue';
import Toolbar from './Toolbar.vue';
import LoginDialog from './LoginDialog.vue';
import AccountDialog from './AccountDialog.vue';
import Axios, {AxiosResponse} from 'axios';
import {decrypt} from '../encryption/AES';

@Component({
  components: {Drawer, Toolbar, LoginDialog, AccountDialog}
})
export default class Layout extends Vue {
  private title = 'DodoSeki';
  loginStatus = false;
  username: string | null = null;

  beforeCreate() {
    Axios.get('/admin/loginstatus')
      .then((res: AxiosResponse) => {
        const encryptedData = res.data.data;
        const data = JSON.parse(decrypt(encryptedData)) as { username: string; email: string };
        this.$store.commit('setLoginStatus', true)
        this.loginStatus = true;
        this.$store.commit('setUsername', data.username);
        this.username = data.username;
      })
      .catch(() => {
        this.$store.commit('setLoginStatus', false)
        this.loginStatus = false;
        this.$store.commit('setUsername', null);
        this.username = null;
      })
  }

}
</script>