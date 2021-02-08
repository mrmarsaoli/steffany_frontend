<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-sheet max-width="632">
          <v-card-text>
            <v-form>
              <label class="text-h6 mb-3 d-block"> Name your shift </label>
              <v-text-field
                v-model="field.name"
                label="ex. My day shift"
                name="name"
                outlined
                flat
                hide-details=""
                single-line
                dense
                type="text"
                color="primary"
                @keydown.enter="save"
              />
              <span
                v-if="errors.name.length"
                class="error--text text-caption mt-1 d-block"
                >{{ errors.name }}
              </span>
              <label class="text-h6 mt-6 mb-3 d-block"> Choose date </label>
              <v-sheet
                outlined
                color="gray lighten-4"
                style="overflow: hidden"
                rounded
                width="292"
              >
                <v-date-picker v-model="date"></v-date-picker>
              </v-sheet>
              <div class="mt-6 d-flex flex-wrap">
                <div class="mr-0 mr-sm-4 mb-6 mb-sm-0">
                  <label class="text-h6 mb-3 d-block"> Shift start</label>
                  <v-sheet
                    outlined
                    color="gray lighten-4"
                    style="overflow: hidden"
                    rounded
                  >
                    <v-time-picker
                      v-model="field.start"
                      :max="field.end"
                    ></v-time-picker>
                  </v-sheet>

                  <span
                    v-if="errors.start.length"
                    class="error--text text-caption mt-1 d-block"
                    >{{ errors.start }}
                  </span>
                </div>
                <div>
                  <label class="text-h6 mb-3 d-block"> Shift end </label>
                  <v-sheet
                    outlined
                    color="gray lighten-4"
                    style="overflow: hidden"
                    rounded
                  >
                    <v-time-picker
                      v-model="field.end"
                      :min="field.start"
                    ></v-time-picker>
                  </v-sheet>

                  <span
                    v-if="errors.end.length"
                    class="error--text text-caption mt-1 d-block"
                    >{{ errors.end }}
                  </span>
                </div>
              </div>
            </v-form>
          </v-card-text>
          <v-card-text class="text-center mt-4">
            <v-btn
              class="mx-auto d-inline-block"
              color="primary"
              :loading="loading"
              @click="save"
            >
              Save
            </v-btn>
          </v-card-text>
        </v-sheet>
      </v-card>

      <v-snackbar v-model="toast" :color="error.length ? 'error' : 'success'">
        {{ error.length ? error : 'your shift has been saved' }}

        <template #action="{ attrs }">
          <v-btn
            color="primaryy"
            text
            v-bind="attrs"
            @click="
              toast = false
              redirectSuccess()
            "
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import CreateShiftGQL from '@/graphql/shift/create.graphql'
import {
  CreateShiftInput,
  CreateShiftMutation,
  CreateShiftMutationVariables
} from '@/types/graphql'
import moment from 'moment'

import Vue from 'vue'
export default Vue.extend({
  data: () => ({
    date: moment().format('YYYY-MM-DD'),
    field: {
      name: '',
      start: '',
      end: '',
      published: 0
    } as CreateShiftInput,
    error: '',
    loading: false,
    errors: {
      name: '',
      start: '',
      end: '',
      published: ''
    } as { [key: string]: any },
    toast: false
  }),
  fetch({ store }) {
    store.dispatch('setTitle', 'Add new shift')
  },
  head: () => ({
    title: 'Add new shift'
  }),
  methods: {
    /**
     * Save shift
     */
    async save() {
      if (this.loading) {
        return
      }

      this.loading = true
      this.error = ''
      this.errors = {
        name: '',
        start: '',
        end: '',
        published: ''
      }

      if (this.field.name.length === 0) {
        this.errors.name = `name can't be empty`
        this.loading = false
        return
      }

      if (this.field.start.length === 0) {
        this.errors.end = `start time can't be empty`
        this.loading = false
        return
      }

      if (this.field.end.length === 0) {
        this.errors.end = `end time can't be empty`
        this.loading = false
        return
      }

      const params: CreateShiftInput = {
        ...this.field,
        start: moment(this.date + ' ' + this.field.start).toISOString(),
        end: moment(this.date + ' ' + this.field.end).toISOString()
      }

      const { data, errors } = await this.$apolloProvider.defaultClient.mutate({
        mutation: CreateShiftGQL,
        variables: {
          params
        } as CreateShiftMutationVariables
      })

      this.loading = false

      if (errors) {
        this.error = 'something unexpected happened, please try again!'
        this.toast = true
        return
      }

      const { createShift }: CreateShiftMutation = data
      const specificError = ['name', 'start', 'end', 'published']

      if (createShift.errors.length) {
        createShift.errors.forEach((error) => {
          // specific error
          if (specificError.includes(error.field)) {
            this.errors[error.field] = error.message
            return
          }

          // general error
          this.error = error.message
        })

        if (this.error.length) {
          this.toast = true
        }

        return
      }

      this.toast = true

      setTimeout(() => {
        this.redirectSuccess()
      }, 3000)
    },
    /**
     * Redirect to shift list
     */
    redirectSuccess() {
      if (this.error) {
        return
      }
      this.$router.push('/shift', () => {
        window.location.reload()
      })
    }
  }
})
</script>
