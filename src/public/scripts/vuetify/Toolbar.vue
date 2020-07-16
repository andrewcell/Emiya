<template>
  <v-app-bar
    absolute
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
      color="green"
      depressed
      class="white--text"
      @click="$emit('toggle-toprightdialog')"
    >
      Login
    </v-btn>
  </v-app-bar>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class Toolbar extends Vue {
    @Prop(String) readonly title: string | undefined;
}
</script>