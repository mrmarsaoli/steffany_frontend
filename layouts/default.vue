<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      :permanent="$vuetify.breakpoint.smAndUp"
    >
      <v-list subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title"> SteffAny </v-list-item-title>
            <v-list-item-subtitle> Love you 3000 </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item to="/" nuxt exact>
          <v-list-item-icon> <v-icon>mdi-home</v-icon></v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <template v-if="$store.state.auth.user.id">
          <v-divider />
          <v-list-item
            v-for="(item, index) in userMenu"
            :key="index"
            nuxt
            exact
            :to="item.path"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon></v-list-item-icon
            >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </template>
        <v-divider />
        <v-list-item @click="$vuetify.theme.dark = !$vuetify.theme.dark">
          <v-list-item-icon>
            <v-icon v-if="$vuetify.theme.dark">mdi-lightbulb-on</v-icon>
            <v-icon v-else>mdi-lightbulb-on-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Theme</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item v-if="$store.state.auth.user.id" @click="logout">
          <v-list-item-icon> <v-icon>mdi-logout</v-icon></v-list-item-icon>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.xsOnly"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>{{ $store.state.title }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-row class="mx-0 mx-md-4 mx-sm-2 my-0 my-md-4 my-sm-2" no-gutters>
        <v-col cols="12" md="12" lg="10" xl="8">
          <nuxt />
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import LogoutMutationGQL from '@/graphql/user/logout.graphql'

export default Vue.extend({
  name: 'DefaultLayout',
  data: () => ({
    userMenu: [
      {
        title: 'My Shift',
        path: '/shift',
        icon: 'mdi-account-clock'
      },
      {
        title: 'Add Shift',
        path: '/shift/add',
        icon: 'mdi-alarm-plus'
      }
    ],
    drawer: false
  }),
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
            this.$router.push('/login', () => {
              window.location.reload()
            })
          })
        })
        .catch((err) => {
          this.$log(err.message)
        })
    }
  }
})
</script>
