<template>
  <v-app>
    <v-app-bar
      app
      :color="$vuetify.theme.dark ? '' : 'white'"
      class="px-3 flex-grow-0"
    >
      <nuxt-link to="/">
        <h1>SteffAny</h1>
      </nuxt-link>

      <v-tabs centered class="ml-n9 d-none d-md-block" color="grey darken-1">
        <v-tab v-for="link in links" :key="link.title" :to="link.path" nuxt>
          {{ link.title }}
        </v-tab>
      </v-tabs>

      <v-spacer></v-spacer>

      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon v-if="!$vuetify.theme.dark" size="20">mdi-lightbulb-on</v-icon>
        <v-icon v-else size="20">mdi-lightbulb-on-outline</v-icon>
      </v-btn>

      <v-app-bar-nav-icon
        size="20"
        class="d-block d-md-none"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      fixed
      right
      temporary
      class="d-flex flex-column"
    >
      <v-list nav>
        <v-list-item-group>
          <v-list-item
            v-for="(link, index) in links"
            :key="index"
            nuxt
            :to="link.path"
          >
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
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
import LogoutMutationGQL from '@/graphql/user/logout.graphql'
import { RootState } from '~/store'

export default Vue.extend({
  name: 'AuthLayout',
  data: () => ({
    links: [
      {
        title: 'Start',
        path: '/'
      },
      {
        title: 'Akademie',
        path: '/akademie'
      }
    ],
    drawer: false
  }),
  mounted() {
    const state: RootState = this.$store.state

    if (state.auth.user?.id) {
      this.$router.push('/')
    }
  },

  methods: {
    logout() {
      this.$apolloProvider.defaultClient
        .mutate({
          mutation: LogoutMutationGQL
        })
        .then(({ data }) => {
          if (!data) {
            return this.$log('error')
          }

          if (!data.logout) {
            return this.$log('error')
          }

          this.$store.dispatch('resetAuthentication')

          this.$nextTick(() => {
            this.$router.push('/login')
          })
        })
        .catch((err) => {
          this.$log(err.message)
        })
    }
  }
})
</script>
