<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-card-text
          class="justify-space-between d-flex align-center flex-column flex-sm-row"
        >
          <span class="text-h6 d-block"> Select shift to publish </span>
          <v-btn
            color="primary"
            class="ml-4 mt-4 mt-sm-0"
            :disabled="ids.length === 0"
            :loading="loading"
            @click="publish"
          >
            Publish
          </v-btn>
        </v-card-text>
        <v-divider class="mx-4 my-2" />
        <v-card-text>
          <v-row>
            <v-col
              v-for="shift in shifts"
              :key="shift.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <v-card height="100%">
                <v-card-title>
                  <v-checkbox
                    v-model="ids"
                    class="mt-0"
                    :label="shift.name"
                    :value="shift.id"
                    :disabled="Boolean(shift.published)"
                    :indeterminate="Boolean(shift.published)"
                    hide-details=""
                    dense
                  ></v-checkbox>
                </v-card-title>
                <v-card-text>
                  <div>
                    {{ convertTime(shift.start) }} -
                    {{ convertTime(shift.end) }}
                  </div>
                  <div class="text-body-1 secondary--text">
                    at {{ convertDate(shift.start) }}
                  </div>
                </v-card-text>
                <v-card-text class="text-center">
                  <v-btn color="primary" nuxt :to="'/shift/' + shift.id"
                    >See detail</v-btn
                  >
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-snackbar v-model="toast" :color="error.length ? 'error' : 'success'">
        {{ error.length ? error : 'your change has been saved' }}

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
import ShiftListGQL from '@/graphql/shift/list.graphql'

import PublishShiftGQL from '@/graphql/shift/publish.graphql'
import {
  ShiftListQuery,
  ShiftListQueryVariables,
  Shift,
  PublishShiftMutationVariables,
  PublishShiftMutation
} from '@/types/graphql'
import moment from 'moment'

import Vue from 'vue'
export default Vue.extend({
  async asyncData({ app, error }) {
    const request = await app.apolloProvider?.defaultClient.query({
      query: ShiftListGQL,
      variables: {
        params: {
          orderBy: 'start',
          limit: 12
        }
      } as ShiftListQueryVariables
    })

    if (request?.errors) {
      error({
        message: 'something unexpected happened!',
        statusCode: 400
      })
      return
    }

    const { shifts }: ShiftListQuery = request?.data

    if (shifts.error) {
      error({ message: shifts.error.message, statusCode: 400 })
      return
    }

    return {
      shifts: shifts.data
    }
  },
  data: () => ({
    shifts: [] as Shift[],
    ids: [] as number[],
    error: '',
    loading: false,
    toast: false
  }),
  fetch({ store }) {
    store.dispatch('setTitle', 'My shifts')
  },
  methods: {
    /**
     * Convert unix timestamp to time
     */
    convertTime(time: string) {
      return moment.unix(Number(time) / 1000).format('h:mm a')
    },
    /**
     * Convert unix timestamp to date
     */
    convertDate(date: string) {
      return moment.unix(Number(date) / 1000).format('MMM D, YYYY')
    },
    /**
     * Handle publish button
     */
    async publish() {
      if (this.loading) {
        return
      }

      this.loading = true
      this.error = ''

      const { data, errors } = await this.$apolloProvider.defaultClient.mutate({
        mutation: PublishShiftGQL,
        variables: {
          ids: this.ids
        } as PublishShiftMutationVariables
      })

      this.loading = false

      if (errors) {
        this.error = 'something unexpected happened, please try again!'
        this.toast = true
        return
      }

      const { publishShift }: PublishShiftMutation = data

      if (publishShift.error) {
        this.error = publishShift.error.message
        this.toast = true
        return
      }

      if (publishShift.bulkingErrors.length) {
        let bulkingErrors = ''
        publishShift.bulkingErrors.forEach((error, index) => {
          if (index > 0) {
            bulkingErrors += ', '
          }
          bulkingErrors += this.shifts[error.id].name
        })

        this.error = 'Failed to publish shift: ' + bulkingErrors
        this.toast = true
        return
      }

      this.toast = true

      setTimeout(() => {
        this.redirectSuccess()
      }, 3000)
    },
    redirectSuccess() {
      if (this.error) {
        return
      }
      window.location.reload()
    }
  }
})
</script>
