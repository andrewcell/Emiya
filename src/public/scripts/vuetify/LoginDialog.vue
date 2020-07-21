<template>
  <div>
    <v-dialog
      v-model="toprightdialog"
      max-width="450px"
    >
      <v-card>
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          top
          color="green"
        />
        <v-card-title>{{ l('layout.login.title') }}</v-card-title>
        <v-card-text>
          {{ l('layout.login.description') }}
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                :label="l('layout.login.username')"
                :disabled="loading"
                required
              />
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                type="password"
                :label="l('layout.login.password')"
                :disabled="loading"
                required
              />
            </v-form>
          </v-container>
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="inherit"
            text
            @click="toprightdialog = false"
          >
            {{ l('layout.login.close') }}
          </v-btn>
          <v-btn
            color="green"
            text
            :disabled="loading"
            @click="login"
          >
            {{ l('layout.login.login') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {getModule} from 'vuex-module-decorators';
import { Register } from '../register';
import Axios, { AxiosResponse } from 'axios';
import { b64 } from '../b64';
import { l } from '../locale';

@Component
export default class LoginDialog extends Vue {
  snackbarMessage = '';
  valid = false;
  validateUsername = Register.validateUsername
  validatePassword = Register.validatePassword
  usernameRules = [
    (v: string) => !!v || l('layout.login.usernameempty'),
    (v: string) => this.validateUsername(v) || l('layout.login.usernameinvalid')
  ]
  passwordRules = [
    (v: string) => !!v ||  l('layout.login.passwordempty'),
    (v: string) => this.validatePassword(v) || l('layout.login.passwordinvalid')
  ]
  username = '';
  password = '';
  toprightdialog = false;
  snackbar = false;
  loading = false;
  l = l;
  login() {
    /* this.$store.commit('setLoginStatus', true) // to Change value in store
    console.log(this.$store.state.LoginStatusStore.username) // get value from store */
    if (this.valid) {
      this.loading = true;
      Axios.post(new b64('L2FkbWluL2xvZ2lu').decode(), {username: this.username, password: this.password})
        .then((res: AxiosResponse) => {
          const result = res.data
          switch (result.code as string) {
            case 'login00':
              localStorage.setItem('token', result.comment)
              location.reload()
              break;
            default:
              this.snackbar = true;
              this.snackbarMessage = result.comment;
              break;
          }
          this.loading = false;
        })
    }
  }
}
</script>