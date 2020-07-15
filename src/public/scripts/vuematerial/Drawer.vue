<template>
  <v-navigation-drawer
    v-model="drawer"
    absolute
    bottom
    temporary
  >
    <v-list
      nav
      dense
    >
      <v-list-item-group
        v-model="group"
      >
        <v-list-item>
          <v-list-item-title>Test1</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync, Inject } from 'vue-property-decorator'

@Component
export default class Drawer extends Vue {
    @Prop(Boolean) drawer: boolean | undefined
    @Inject('group') readonly group!: void
}
</script>