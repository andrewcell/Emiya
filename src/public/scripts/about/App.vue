<template>
  <v-app>
    <Layout />
    <div
      v-if="loaded()"
    >
      <link
        href="https://use.fontawesome.com/releases/v5.0.13/css/all.css"
        rel="stylesheet"
      >
      <v-container>
        <div class="pa-1 text-h4">
          {{ l('about.title') }}
        </div>
        <v-banner>
          Do you want recover your account? Click here.
        </v-banner>
        <HelpSection />
        <v-divider />
        <v-row no-gutters>
          <v-col
            class="px-1"
            cols="12"
            sm="4"
          >
            <div class="pa-4 text-h5">
              {{ l('about.links.title') }}
            </div>
            <v-card>
              <v-list-item-group
                v-for="link in links"
                :key="link[0]"
              >
                <v-list-item
                  two-line
                  :href="link[1]"
                >
                  <v-list-item-avatar
                    tile
                    width="30"
                    height="30"
                  >
                    <span
                      style="vertical-align: initial"
                      class="fa-lg"
                      :class="link[2]"
                    />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ l('about.links.' + link[0] + '.title') }}</v-list-item-title>
                    <v-list-item-subtitle>{{ l('about.links.' + link[0] + '.desc') }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-card>
          </v-col>
          <v-col
            class="px-1"
            cols="12"
            sm="4"
          >
            <div class="pa-4 text-h5">
              {{ l('about.service.title') }}
            </div>
            <v-card>
              <v-list-item two-line>
                <v-list-item-avatar
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
                <v-list-item-content>
                  <v-list-item-title>{{ l('about.service.emiya') }}</v-list-item-title>
                  <v-list-item-subtitle class="orange--text">
                    Warning
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-avatar
                  tile
                  width="40"
                  height="30"
                >
                  <img
                    style="border: solid 0.3px lightgray"
                    src="https://cdn.jsdelivr.net/npm/flag-icon-css@3.5.0/flags/4x3/us.svg"
                    alt="unitedstates"
                  >
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ l('about.service.emiyaj') }}</v-list-item-title>
                  <v-list-item-subtitle class="green--text">
                    Normal
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-avatar
                  tile
                  width="40"
                  height="30"
                >
                  <img
                    style="border: solid 0.3px lightgray"
                    src="https://cdn.jsdelivr.net/npm/flag-icon-css@3.5.0/flags/4x3/nl.svg"
                    alt="netherlands"
                  >
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ l('about.service.emiyap') }}</v-list-item-title>
                  <v-list-item-subtitle class="red--text">
                    Critical
                  </v-list-item-subtitle>
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
              {{ l('about.devinfo.title') }}
            </div>
            <DevInfo
              :last-commit-time="lastCommitTime"
              :last-build-time="lastBuildTime"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>
    <div v-else>
      <v-overlay
        :value="!loaded()"
      >
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>
    </div>
  </v-app>
</template>
<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import Layout from '../vuetify/Layout.vue';
  import HelpSection from '../about/HelpSection.vue';
  import DevInfo from './DevInfo.vue';
  import {l} from '../locale';
  import Axios, {AxiosResponse} from 'axios';
  import {decrypt} from '../encryption/AES';
  import {PageStatus} from '../points/enums';

  @Component({
  components: {
    Layout, HelpSection, DevInfo
  }
})
export default class App extends Vue {
  private title = 'Resident Services';
  private links = [
    ['github', 'https://github.com/EmiyaSuite', 'fab fa-github'],
    ['email', 'mailto:judy@ij.rs', 'fas fa-envelope'],
    ['board', 'https://', 'fas fa-chalkboard']
  ]
  l = l;
  pageStatus = PageStatus.LOADING
  lastCommitTime = '';
  lastBuildTime = '';
  created(): void {
    Axios.get('/status')
      .then((r: AxiosResponse) => {
        const data = JSON.parse(decrypt(r.data.data)) as {lastBuildTime: string, lastCommitTime: string, title: string};
        this.lastBuildTime = data.lastBuildTime;
        this.lastCommitTime = data.lastCommitTime;
        this.pageStatus = PageStatus.LOADED;
      })
  }

  loaded(): boolean {
    return this.pageStatus === PageStatus.LOADED
  }
}
</script>
<style>

</style>