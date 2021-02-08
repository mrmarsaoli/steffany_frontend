<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-card-title class="text-h3 font-weight-medium">
          Welcome to SteffAny
        </v-card-title>
        <v-divider />
        <v-card-subtitle class="text-h5">
          Schedule your work efficiently
        </v-card-subtitle>
        <v-card-text>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Facilis,
          cupiditate corporis officiis vel laudantium, culpa animi sed harum
          repellendus aliquid libero eveniet, omnis saepe maxime excepturi
          laboriosam repellat dolor quos. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Nisi, quam. Accusamus animi tempore vel, illum,
          corporis doloribus iste officia, quia inventore ea voluptas ratione
          dolorem eius debitis facere voluptatem natus.
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  fetch({ store }) {
    store.dispatch('setTitle', 'Home')
  }
})
</script>
