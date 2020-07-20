<template>
  <v-app>
    <Layout />
    <v-container>
      <div class="pa-1 text-h4">
        {{ l('about.title') }}
      </div>
      <HelpSection />
      <v-divider />

      <v-row no-gutters>
        <v-col
          class="px-1"
          cols="12"
          sm="4"
        >
          <div class="pa-4 text-h5">
            Useful Links
          </div>
          <v-card>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Github</v-list-item-title>
                <v-list-item-subtitle>Github link of Emiya.</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>E-mail</v-list-item-title>
                <v-list-item-subtitle>mailto link to Developer.</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col
          class="px-1"
          cols="12"
          sm="4"
        >
          <div class="pa-4 text-h5">
            Useful Links
          </div>
          <v-card>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Github</v-list-item-title>
                <v-list-item-subtitle>Github link of Emiya.</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>E-mail</v-list-item-title>
                <v-list-item-subtitle>mailto link to Developer.</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
        <v-col
          class="px-1"
          cols="12"
          sm="4"
        >
          <div class="pa-4 text-h5">
            Useful Links
          </div>
          <v-card>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>Github</v-list-item-title>
                <v-list-item-subtitle>Github link of Emiya.</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title>E-mail</v-list-item-title>
                <v-list-item-subtitle>mailto link to Developer.</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>
<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';
import Layout from '../vuetify/Layout.vue';
import HelpSection from '../about/HelpSection.vue';
import {l} from '../locale';

@Component({
  components: {
    Layout, HelpSection
  }
})
export default class App extends Vue {
  private title = 'Resident Services'
  l = l
}
</script>
<style>

</style>