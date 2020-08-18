<template>
  <div>
    <v-dialog
      v-model="registerDialog"
      max-width="450px"
    >
      <v-snackbar
        v-model="snackbar"
        :timeout="3000"
      >
        {{ snackbarMessage }}
      </v-snackbar>
      <v-card>
        <v-progress-linear
          :active="loading"
          :indeterminate="loading"
          absolute
          top
          color="green"
        />
        <v-card-title>{{ l('layout.register.title') }}</v-card-title>
        <v-card-text v-if="success">
          {{ l('layout.register.success') }}
        </v-card-text>
        <v-card-text v-else>
          {{ l('layout.register.description') }}
          <v-container>
            <v-form
              ref="form"
              v-model="valid"
            >
              <v-text-field
                v-model="email"
                type="email"
                :rules="emailRules"
                :label="l('layout.register.email')"
                :disabled="loading"
                required
              />
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                type="password"
                :label="l('layout.register.password')"
                :disabled="loading"
                required
                @keyup.enter="login"
              />
              <v-text-field
                v-model="password2"
                :rules="passwordMatchRules"
                type="password"
                :label="l('layout.register.password2')"
                :disabled="loading"
                required
              />
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                :label="l('layout.register.username')"
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
            @click="registerDialog = false"
          >
            {{ l('layout.register.close') }}
          </v-btn>
          <v-btn
            v-if="!success"
            color="green"
            text
            :disabled="loading"
            @click="register"
          >
            {{ l('layout.register.register') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {Register} from '../register';
import {l} from '../locale';
import {AjaxResult} from '../ajax';

@Component
export default class RegisterDialog extends Vue {
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
  email = '';
  emailRules = [
    (v: string) => !!v || l('layout.register.emailempty'),
    (v: string) => this.validateEmail(v) || l('layout.register.emailinvalid')
  ]
  password = '';
  password2 = '';
  passwordMatchRules = [
    (v: string) => v !== this.password || l('layout.register.notmatch')
  ]
  l = l;
  registerDialog = false;
  snackbar = false;
  loading = false;
  success = false;

  validateEmail(mail: string): boolean {
    return  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(mail.toLowerCase());
  }

  register(): void {
    if (this.valid) {
      this.loading = true;
      Register.register(this.username, this.password, this.password2, this.email)
          .then((result: AjaxResult) => {
            this.snackbar = true;
            this.snackbarMessage = result.comment;
            if (result.code === 'register07') {
              this.success = true;
            }
            this.loading = false;
          })
    }
  }
}
</script>