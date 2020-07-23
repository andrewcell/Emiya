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
                  <v-list-item-subtitle :class="getServerColor(this.emiya)">
                    {{ getServerStatus(this.emiya) }}
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
                  <v-list-item-subtitle :class="getServerColor(this.emiyaJ)">
                    {{ getServerStatus(this.emiya) }}
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
                  <v-list-item-subtitle :class="getServerColor(this.emiyaP)">
                    {{ getServerStatus(this.emiya) }}
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
import Axios, {AxiosError, AxiosResponse} from 'axios';
import {decrypt} from '../encryption/AES';
import {PageStatus} from '../points/enums';

enum ServerStatus {
  Normal = 0,
  Warning = 1,
  Critical = 2,
  Slow = 3,
  Maintenance = 4,
  Unknown = 9
}

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
  emiya = 9;
  emiyaJ = 9;
  emiyaP = 9;
  created(): void {
    Axios.get('/status')
      .then((r: AxiosResponse) => {
        const data = JSON.parse(decrypt(r.data.data)) as {
          lastBuildTime: string,
          lastCommitTime: string,
          title: string,
          emiya: number,
          emiyaj: number,
          emiyap: number
        };
        this.lastBuildTime = data.lastBuildTime;
        this.lastCommitTime = data.lastCommitTime;
        this.emiya = data.emiya;
        this.emiyaJ = data.emiyaj;
        this.emiyaP = data.emiyap;
        this.pageStatus = PageStatus.LOADED;
      })
      .catch(() => {
        this.pageStatus = PageStatus.ERROR;
      })
  }

  loaded(): boolean {
    return this.pageStatus === PageStatus.LOADED
  }

  getServerColor(status: number | undefined): string {
    switch (status) {
      case 0:
        return 'green--text'
      case 1:
        return 'orange--text'
      case 2:
        return 'red--text'
      default:
        return 'gray--text'
    }
  }

  getServerStatus(status: number | undefined): string {
    switch (status) {
      case 0:
        return 'Normal';
      case 1:
        return 'Warning';
      case 2:
        return 'Critical';
      default:
        return 'Unknown';
    }
  }
}
</script>
<style>

</style>