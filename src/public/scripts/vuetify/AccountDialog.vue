<template>
  <div>
    <v-dialog
      v-model="toprightdialog"
      max-width="450px"
    >
      <v-card>
        <v-card-title>{{ username }}</v-card-title>
        <v-card-text>
          {{ l('layout.login.username') }}: {{ username }}<br>
          {{ l('layout.register.email') }}: {{ this.$store.state.LoginStatusStore.email }}
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red"
            text
            @click="terminate()"
          >
            {{ l('layout.account.terminate') }}
          </v-btn>
          <v-btn
            color="inherit"
            text
            @click="redirectToLogout()"
          >
            {{ l('layout.account.logout') }}
          </v-btn>
          <v-btn
            color="inherit"
            text
            @click="toprightdialog = false"
          >
            {{ l('layout.account.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { l } from '../locale';

@Component
export default class AccountDialog extends Vue {
  @Prop(String) username: string | undefined;
  toprightdialog = false;
  l = l;

  redirectToLogout(): void {
    localStorage.removeItem('token');
    window.location.replace('/admin/logout');
  }

  terminate(): void {

  }
}
</script>
