<template>
  <v-card>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title>{{ l('about.devinfo.lastcommit') }}</v-list-item-title>
        <v-list-item-subtitle>{{ lastCommitTime }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title>{{ l('about.devinfo.lastbuild') }}</v-list-item-title>
        <v-list-item-subtitle>{{ lastBuildTime }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title>{{ l('about.devinfo.location') }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-avatar
        class="elevation-3"
        tile
        width="40"
        height="30"
      >
        <img
          style="border: solid 0.3px lightgray"
          src="https://cdn.jsdelivr.net/npm/flag-icon-css@3.5.0/flags/4x3/jp.svg"
          alt="japan"
        >
      </v-list-item-avatar>
    </v-list-item>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { l } from '../locale';

@Component
export default class DevInfo extends Vue {
  @Prop(String) lastCommitTime: string | undefined;
  @Prop(String) lastBuildTime: string | undefined;
  l = l;
}
</script>