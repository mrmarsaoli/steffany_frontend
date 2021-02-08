<template>
  <v-row>
    <v-col>
      <v-card flat>
        <v-card-text class="text-right">
          <v-btn
            color="error"
            class="mr-4 mb-4 mb-sm-0"
            :loading="loading"
            @click="remove"
            >Delete</v-btn
          >
          <v-btn
            color="primary"
            :disabled="shift.published === 1"
            :loading="loading"
            @click="publish"
          >
            Publish
          </v-btn>
        </v-card-text>
        <v-divider class="mx-4 mt-2" />
        <v-card-text>
          <v-card flat>
            <v-card-title class="text-5">
              {{ shift.name }}
            </v-card-title>
            <v-card-text>
              date: {{ convertDate(shift.start) }}
              <br />
              Time: {{ convertTime(shift.start) }} -
              {{ convertTime(shift.end) }}
            </v-card-text>
          </v-card>
        </v-card-text>
      </v-card>

      <v-snackbar v-model="toast" :color="error.length ? 'error' : 'success'">
        {{ error.length ? error : 'your change been saved' }}

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
import Vue from 'vue'
import ShiftDetailGQL from '@/graphql/shift/detail.graphql'
import DeleteShiftGQL from '@/graphql/shift/delete.graphql'
import PublishShiftGQL from '@/graphql/shift/publish.graphql'
import {
  Shift,
  ShiftDetailQueryVariables,
  ShiftDetailQuery,
  DeleteShiftMutationVariables,
  DeleteShiftMutation,
  PublishShiftMutationVariables,
  PublishShiftMutation
} from '@/types/graphql'
import moment from 'moment'
export default Vue.extend({
  async asyncData({ store, app, error, params }) {
    const request = await app.apolloProvider?.defaultClient.query({
      query: ShiftDetailGQL,
      variables: {
        id: Number(params.detail)
      } as ShiftDetailQueryVariables
    })

    if (request?.errors) {
      error({
        message: 'something unexpected happened!',
        statusCode: 400
      })
      return
    }

    const { shift }: ShiftDetailQuery = request?.data

    if (shift.errors.length) {
      error({ message: shift.errors[0].message, statusCode: 400 })
      return
    }

    if (!shift.data) {
      error({ message: `shift doesn't exist`, statusCode: 400 })
      return
    }

    store.dispatch('setTitle', shift.data.name)

    return {
      shift: shift.data
    }
  },
  data: () => ({
    shift: {} as Shift,
    loading: false,
    error: '',
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
      return moment.unix(Number(time)).format('h:mm a')
    },
    /**
     * Convert unix timestamp to date
     */
    convertDate(date: string) {
      return moment.unix(Number(date)).format('MMM D, YYYY')
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
          ids: [this.shift.id]
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
        publishShift.bulkingErrors.forEach((_, index) => {
          if (index > 0) {
            bulkingErrors += ', '
          }
          bulkingErrors += this.shift.name
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
    /**
     * Handle remove shift
     */
    async remove() {
      if (this.loading) {
        return
      }

      this.loading = true
      this.error = ''

      const { data, errors } = await this.$apolloProvider.defaultClient.mutate({
        mutation: DeleteShiftGQL,
        variables: {
          id: this.shift.id
        } as DeleteShiftMutationVariables
      })

      this.loading = false

      if (errors) {
        this.error = 'something unexpected happened, please try again!'
        this.toast = true
        return
      }

      const { deleteShift }: DeleteShiftMutation = data

      if (deleteShift.error) {
        this.error = deleteShift.error.message
        this.toast = true
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
