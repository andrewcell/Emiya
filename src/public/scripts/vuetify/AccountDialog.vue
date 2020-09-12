<template>
  <div>
    <v-dialog
      v-model="toprightdialog"
      max-width="450px"
    >
      <v-card>
        <v-card-title>{{ username }}</v-card-title>
        <v-card-text>
          Here is your detail of account. {{ username }}
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="inherit"
            text
            @click="redirectToLogout()"
          >
            Logout
          </v-btn>
          <v-btn
            color="inherit"
            text
            @click="toprightdialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class AccountDialog extends Vue {
  @Prop(String) username: string | undefined;
  toprightdialog = false;

  redirectToLogout(): void {
    localStorage.removeItem('token');
    window.location.replace('/admin/logout');
  }
}
</script>