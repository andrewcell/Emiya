<template>
  <v-dialog
    v-model="dialog"
  >
    <v-card>
      <v-card-title>Login</v-card-title>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class LoginDialog extends Vue {

}
</script>