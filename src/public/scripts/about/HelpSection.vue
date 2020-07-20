<template>
  <v-card
    raised
  >
    <v-card-title>{{ l('about.help.title') }}</v-card-title>
    <v-card-text>
      <v-expansion-panels
        v-for="helpCode in helpCodes"
        :key="helpCode"
        accordion
        popoup
        flat
      >
        <v-expansion-panel>
          <v-expansion-panel-header>
            {{ l('about.help.' + helpCode + '.title') }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            {{ l('about.help.' + helpCode + '.desc') }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import {l} from '../locale';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HelpSection extends Vue {
  l = l;
  helpCodes = ['villagers', 'emibo']
}
</script>