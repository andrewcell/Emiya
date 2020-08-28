<template>
  <v-app>
    <Layout />
    <v-container>
      <v-card>
        <v-text-field
          :label="l('translations.search')"
          outlined
        />
      </v-card>
    </v-container>
  </v-app>
</template>
<script lang="ts" src="./App.ts" />
