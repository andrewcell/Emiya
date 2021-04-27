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
      v-if="this.$store.state.LoginStatusStore.login === false"
      ref="toprightdialog"
    />
    <AccountDialog
      v-else
      ref="toprightdialog"
      :username="this.$store.state.LoginStatusStore.username"
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

  beforeCreate() {
    Axios.get('/admin/loginstatus')
      .then((res: AxiosResponse) => {
        const encryptedData = res.data.data;
        const data = JSON.parse(decrypt(encryptedData)) as { username: string; email: string };
        this.$store.commit('setLoginStatus', true)
        this.$store.commit('setUsername', data.username);
        this.$store.commit('setEmail', data.email);
      })
      .catch(() => {
        this.$store.commit('setLoginStatus', false);
        this.$store.commit('setUsername', null);
        this.$store.commit('setEmail', null);
      })
  }

}
</script>
