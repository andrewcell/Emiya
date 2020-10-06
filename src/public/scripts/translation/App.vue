<template>
  <v-app>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"
      rel="stylesheet"
    >
    <Layout />
    <v-tabs
      v-model="method"
      background-color="green"
      dark
      style="flex: 0 !important"
      onchange="clearContent()"
    >
      <v-tab>{{ l('translations.itemvillagercreature') }}</v-tab>
      <v-tab>{{ l('translations.item') }}</v-tab>
      <v-tab>{{ l('translations.villager') }}</v-tab>
      <v-tab>{{ l('translations.creature') }}</v-tab>
      <v-tab>{{ l('translations.npc') }}</v-tab>
      <v-tab>{{ l('translations.recipe') }}</v-tab>
      <v-tab>{{ l('translations.reaction') }}</v-tab>
    </v-tabs>
    <v-container>
      <v-form
        v-model="valid"
        @submit.prevent="true"
      >
        <v-text-field
          v-model="search"
          :label="l('translations.search') + ' + Enter'"
          outlined
          dense
          color="green"
          :rules="atLeastFour"
          @keyup.enter="query"
        />
        <v-row
          justify="space-between"
          dense
          no-gutters
        >
          <v-col md="4">
            <v-checkbox
              v-model="showImage"
              :label="l('translations.viewimage')"
              class="ma-0 pa-0"
            />
          </v-col>
          <v-col
            md="4"
            class="text-right"
          >
            <v-btn
              rounded
              dark
              color="green"
              @click="query"
            >
              {{ l('translations.manualbutton') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    </v-form>
    <v-row>
      <v-col
        v-for="r in result"
        :key="r.name"
        lg="4"
        md="6"
        sm="12"
      >
        <v-card>
          <img
            v-if="showImage && r.image"
            :src="r.image"
            alt=""
            width="128"
          >
          <v-card-title>{{ r.name }}</v-card-title>
          <v-list dense>
            <v-list-item
              v-for="locale in r.result"
              :key="locale.language"
            >
              <v-list-item-avatar>
                <span :class="'flag-icon flag-icon-' + getCountryCode(locale.language)" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="locale.name" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    </v-container>
  </v-app>
</template>
<script lang="ts" src="./App.ts" />
