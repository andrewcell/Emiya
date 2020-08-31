<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    temporary
  >
    <v-list
      nav
      dense
      flat
    >
      <v-list-group
        v-for="item in menuItems"
        :key="item.title"
        no-action
        sub-group
        color="green"
        value="true"
      >
        <template #activator>
          <v-list-item-title v-text="item.title" />
        </template>
        <v-list-item
          v-for="menu in item.menu"
          :key="menu.link"
          :href="menu.link"
        >
          <v-list-item-title>{{ menu.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import menuItems, { MenuItem, MenuEntry } from '../menuItems';

@Component
export default class Drawer extends Vue {
  drawer = false;
  menuItems = menuItems as MenuEntry[];
}
</script>