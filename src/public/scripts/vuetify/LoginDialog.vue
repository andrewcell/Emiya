<template>
  <v-dialog
    v-model="toprightdialog"
    max-width="450px"
  >
    <v-card>
      <v-card-title>Login</v-card-title>
      <v-card-text>
        Do not loose your data! login to save.
        <v-container>
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="username"
              :rules="usernameRules"
              label="Username"
              required
            />
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              type="password"
              label="Password"
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
          Close
        </v-btn>
        <v-btn
          color="green"
          text
          @click="login"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Register } from '../register';
import Axios, { AxiosResponse } from 'axios';
import { b64 } from '../b64';

@Component
export default class LoginDialog extends Vue {
  valid = false;
  validateUsername = Register.validateUsername
  usernameRules = [
    (v: string) => !!v || 'Username empty',
    (v: string) => this.validateUsername(v) || 'Wrong Username'
  ]
  passwordRules = [
    (v: string) => !!v || 'Password empty',
    (v: string) => this.validatePassword(v) || 'Wrong Password'
  ]
  validatePassword = Register.validatePassword
  username = '';
  password = '';
  toprightdialog = true;

  login() {
      if (this.valid) {
        Axios.post(new b64('L2FkbWluL2xvZ2lu').decode(), {username: this.username, password: this.password})
          .then((res: AxiosResponse) => {
            const result = res.data
            switch (result.code as string) {
              case 'login00':
                console.log(result.comment)
                localStorage.setItem('token', result.comment)
                location.reload()
                break;
              default:
                console.log(result.comment)
                break;
            }
          })
        alert('login clicked')
      }
  }
}
</script>