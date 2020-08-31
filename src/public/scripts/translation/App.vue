<template>
  <v-app>
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/css/flag-icon.min.css"
      rel="stylesheet"
    >
    <Layout />
    <v-container>
      <v-text-field
        :label="l('translations.search') + ' + Enter'"
        outlined
        @keyup.enter="() => {}"
      />
      <v-row>
        <v-col
          v-for="r in result"
          :key="r.name"
        >
          <v-card>
            <v-card-title>{{ r.name }}</v-card-title>
            <v-list dense>
              <v-list-item
                v-for="locale in r.result"
                :key="locale.language"
              >
                <v-list-item-avatar>
                  <span :class="'flag-icon flag-icon-' + getConturyCode(locale.language)" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="'sbsdfbsdfbsdfbfdb'" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-btn
        rounded
        dark
        style="margin-top: 10px"
        color="green"
      >
        {{ l('translations.manualbutton') }}
      </v-btn>

    </v-container>
  </v-app>
</template>
<script lang="ts" src="./App.ts" />
