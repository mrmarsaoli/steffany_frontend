<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12" sm="6" md="6" lg="4" xl="3">
            <nuxt />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { RootState } from '~/store'

export default Vue.extend({
  name: 'AuthLayout',
  mounted() {
    const state: RootState = this.$store.state

    if (state.auth.user?.id) {
      this.$router.push('/')
    }
  }
})
</script>
