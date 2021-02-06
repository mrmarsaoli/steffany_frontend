<template>
  <v-app id="inspire">
    <v-app-bar
      app
      :color="$vuetify.theme.dark ? '' : 'white'"
      class="px-3 flex-grow-0"
      style="z-index: 9"
    >
      <nuxt-link to="/">
        <h1 color="primary">SteffAny</h1>
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

      <template v-if="$store.state.auth.user.id">
        <v-menu offset-y bottom left>
          <template #activator="{ on, attrs }">
            <v-btn v-bind="attrs" icon v-on="on">
              <v-icon size="20">mdi-account</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in userMenu"
              :key="index"
              nuxt
              :to="item.path"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-else>
        <v-btn icon nuxt to="/login">
          <v-icon size="20">mdi-login</v-icon>
        </v-btn>
      </template>

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
      <template #prepend>
        <v-text-field
          solo
          label="Search"
          dense
          outlined
          flat
          class="pa-4 d-block d-md-none"
          active-class="grey lighten-2"
          append-icon="mdi-magnify"
          hide-details
        ></v-text-field>
      </template>
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

    <v-main :class="$vuetify.theme.dark ? '' : 'grey lighten-3'">
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" lg="2" class="order-2 order-lg-1">
            <v-sheet rounded="lg" min-height="268">
              <!--  -->
            </v-sheet>
          </v-col>

          <v-col cols="12" lg="8" class="order-1 order-lg-2">
            <v-sheet min-height="70vh" rounded="lg">
              <nuxt />
            </v-sheet>
          </v-col>

          <v-col cols="12" sm="6" lg="2" class="order-3">
            <v-sheet rounded="lg" min-height="268">
              <!--  -->
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import LogoutMutationGQL from '@/graphql/user/logout.graphql'

export default Vue.extend({
  name: 'DefaultLayout',
  data: () => ({
    links: [
      {
        title: 'Home',
        path: '/'
      },
      {
        title: 'Schedule',
        path: '/akademie'
      }
    ],
    userMenu: [
      {
        title: 'My Shift',
        path: '/user/course'
      },
      {
        title: 'Settings',
        path: '/user/settings'
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
