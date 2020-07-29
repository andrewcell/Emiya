<template>
  <v-card>
    <CampsiteSearchVillager ref="searchDialog" />
    <v-card-title>새로운 캠핑장 노가다 시작하기</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <p
            v-if="this.$store.state.CampsiteStore.selectedVillager == null"
            class="text-h5"
          >
            선택된 주민이 없습니다.
          </p>
          <p
            v-else
            class="text-h5"
          >
            {{ this.$store.state.CampsiteStore.selectedVillager.nameKor }}
          </p>
        </v-col>
        <v-col cols="2">
          <v-btn
            color="green"
            readonly
            dark
            @click="$refs.searchDialog.dialog = !$refs.searchDialog.dialog"
          >
            주민 검색
          </v-btn>
        </v-col>
        <v-col cols="4">
          <v-menu
            v-model="dateMenu"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="290opx"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="시작일을 선택해주세요."
                readonly
                color="green"
                v-bind="attrs"
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="date"
              :locale="locale"
              color="green darken-2"
              @input="dateMenu = false"
            />
          </v-menu>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import {getLanguage} from '../locale';
import CampsiteSearchVillager from './CampsiteSearchVillager.vue';

@Component({
  components: {
    CampsiteSearchVillager
  }
})
export default class CampsiteEmpty extends Vue {
  dateMenu = false;
  date = new Date().toISOString().substr(0, 10);
  locale = getLanguage().replace('_', '-');
}
</script>

<style scoped>

</style>