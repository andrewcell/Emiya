<template>
  <v-dialog
    v-model="dialog"
    max-width="450"
  >
    <v-card>
      <v-card-title>주민 검색</v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field
            v-model="name"
            label="주민 이름으로 검색"
            :rules="atLeastTwo"
            required
            @keyup.enter="searchVillager"
          />
        </v-container>
        <v-list
          v-for="villager in result"
          :key="villager.code"
          two-line
        >
          <v-list-item
            @click="setVillager(villager.code)"
          >
            <v-list-item-avatar>
              <v-img :src="getImageSource(villager.code)" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ villager.nameKor }}</v-list-item-title>
              <v-list-item-subtitle>{{ l('villagers.personalities.' + villager.personality) }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { l } from '../locale';
import Axios from 'axios';
import {decrypt, encrypt} from '../encryption/AES';
import { Color, Style } from '../villagers/enums';
import {Villager} from 'animal-crossing/lib/types/Villager';

@Component
export default class CampsiteSearchVillager extends Vue {
  dialog = false;
  result: Villager[] = [];
  name = '';

  l = l;

  atLeastTwo =  [
    (v: string) => !!v || '이름을 입력해주세요.',
    (v: string) => v.length >= 2 || '최소 두 글자는 입력해주세요.',
  ]

  searchVillager(): void {
    this.result = [];
    Axios.post('/villagers/search', {data: encrypt(this.name)})
      .then(r => {
        this.result = JSON.parse(decrypt(r.data.data));
      })
  }

  setVillager(code: string): void {
    const selectedVillager = this.result.filter(v => v.filename === code)
    if (selectedVillager.length === 1) {
      this.$store.commit('setVillager', selectedVillager[0]);
    }
  }

  getImageSource(code: string): string {
    return `/images/villagers/${code}.png`
  }
}
</script>

<style scoped>

</style>