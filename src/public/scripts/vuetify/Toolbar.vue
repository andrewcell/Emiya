<template>
  <v-app-bar
    color="green"
    flat
  >
    <v-app-bar-nav-icon
      class="white--text"
      @click.stop="$emit('toggle-drawer')"
    />
    <v-toolbar-title
      class="white--text"
    >
      {{ title }}
    </v-toolbar-title>
    <v-spacer />
    <v-btn
      v-if="this.$store.state.LoginStatusStore.login === false"
      color="green"
      depressed
      class="white--text"
      @click="$emit('toggle-toprightdialog')"
    >
      {{ l('layout.login') }}
    </v-btn>
    <v-btn
      v-else
      color="green"
      depressed
      class="white--text"
      @click="$emit('toggle-toprightdialog')"
    >
      {{ this.$store.state.LoginStatusStore.username }}
    </v-btn>
  </v-app-bar>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {l} from '../locale';

@Component
export default class Toolbar extends Vue {
    @Prop(String) readonly title: string | undefined;
    l = l;
}
</script>