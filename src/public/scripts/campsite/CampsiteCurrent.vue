<template>
  <v-card v-if="using === true">
    <v-card-title>Current test</v-card-title>
    <v-card-text>
      <v-text-field
        label="Name"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        text
      >
        Delete
      </v-btn>
      <v-btn
        text
      >
        Done
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else>
    <v-card-title>You are not using Campsite. Click below to start use.</v-card-title>
    <v-card-text>
      <v-text-field
        label="Name"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        text
      >
        Delete
      </v-btn>
      <v-btn
        text
      >
        Done
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {Vue, Component, Prop} from 'vue-property-decorator';
import {CampsiteContent} from './CampsiteObjects';

@Component
export default class CampsiteCurrent extends Vue {
  @Prop(Boolean) using: boolean | undefined
  // this.$store.state.CampsiteStore.current
}
</script>