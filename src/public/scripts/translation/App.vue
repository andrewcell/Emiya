<template>
  <v-app>
    <Layout />
    <v-container>
      <v-text-field
        :label="l('translations.search') + ' + Enter'"
        outlined
        @keyup.enter="() => {}"
      />
      <v-card>
        <v-list>
          <v-list-item
            v-for="locale in locales"
            :key="locale.language"
          >
            <v-list-item-avatar>
              <v-icon v-text="asd" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="'sbsdfbsdfbsdfbfdb'" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
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
