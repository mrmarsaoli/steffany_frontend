<template>
  <v-card outlined class="text-center" flat>
    <v-card-title class="text-h4 my-4 font-semibold justify-center">
      Create an Account</v-card-title
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
          @keydown.enter="register"
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
          @keydown.enter="register"
        />
      </v-form>
    </v-card-text>
    <v-card-text>
      <v-btn outlined nuxt to="/login" class="mr-3">Login</v-btn>
      <v-btn color="primary" @click="register"> Sign up </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  UserResponse,
  RegisterMutationVariables,
  FieldError,
  UserInput
} from '@/types/graphql'
import RegisterMutationGQL from '@/graphql/user/register.graphql'

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
    register() {
      this.$apolloProvider.defaultClient
        .mutate({
          mutation: RegisterMutationGQL,
          variables: {
            params: {
              email: this.field.email,
              password: this.field.password
            }
          } as RegisterMutationVariables
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

          const res: UserResponse = data.register

          if (res.errors.length) {
            this.$log(res.errors)
            this.setError(res.errors)
            return
          }

          this.$router.push('/login')
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
