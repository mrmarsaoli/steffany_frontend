<template>
  <v-card outlined class="text-center" flat>
    <v-card-title class="text-h4 my-4 font-semibold justify-center">
      Welcome Back!</v-card-title
    >
    <v-card-text>
      <v-form class="text-center">
        <v-text-field
          v-model="field.email"
          label="Email"
          name="email"
          prepend-inner-icon="mdi-email"
          outlined
          flat
          single-line
          type="text"
          color="primary"
          @keydown.enter="login"
        />
        <v-text-field
          id="password"
          v-model="field.password"
          label="Password"
          name="password"
          prepend-inner-icon="mdi-lock"
          outlined
          flat
          single-line
          type="password"
          color="primary"
          @keydown.enter="login"
        />
      </v-form>
      <span>Forgot your password?</span>
    </v-card-text>
    <v-card-text>
      <v-btn outlined nuxt to="/signup" class="mr-3">Sign up</v-btn>
      <v-btn color="primary" @click="login"> Login </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  UserResponse,
  UserInput,
  LoginMutationVariables,
  FieldError
} from '@/types/graphql'
import LoginMutationGQL from '@/graphql/user/login.graphql'

export default Vue.extend({
  layout: 'auth',
  data: () => ({
    field: {
      email: '',
      password: ''
    } as UserInput,
    errors: {
      email: '',
      password: ''
    }
  }),
  methods: {
    setError(errors: FieldError[]) {
      errors.forEach((item) => {
        this.errors[item.field as 'email' | 'password'] = item.message
      })
    },
    login() {
      this.$apolloProvider.defaultClient
        .mutate({
          mutation: LoginMutationGQL,
          variables: {
            params: {
              email: this.field.email,
              password: this.field.password
            }
          } as LoginMutationVariables
        })
        .then(({ data }) => {
          if (!data) {
            return this.setError([
              {
                field: 'email',
                message: 'Oops! something unexpected happen. Please try again!'
              }
            ])
          }

          const res: UserResponse = data.login

          if (res.errors.length) {
            this.$log(res.errors)
            this.setError(res.errors)
            return
          }

          this.$store.commit('SET_AUTHENTICATION', {
            account: res.user,
            accessToken: res.accessToken
          })

          let route = '/'

          if (this.$route.query.r) {
            route = window.decodeURIComponent(this.$route.query.r as string)
          }

          this.$router.push(route, () => {
            window.location.reload()
          })
        })
        .catch(() => {
          this.setError([
            {
              field: 'email',
              message: 'Oops! something unexpected happen. Please try again!'
            }
          ])
        })
    }
  }
})
</script>
