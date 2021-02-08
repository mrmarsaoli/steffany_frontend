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
import EditShiftGQL from '@/graphql/shift/edit.graphql'
import {
  Shift,
  ShiftDetailQueryVariables,
  ShiftDetailQuery,
  DeleteShiftMutationVariables,
  DeleteShiftMutation,
  PublishShiftMutationVariables,
  PublishShiftMutation,
  EditShiftInput,
  EditShiftMutationVariables,
  EditShiftMutation
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
    toast: false,
    date: moment().format('YYYY-MM-DD'),
    field: {
      name: '',
      start: '',
      end: '',
      published: 0
    } as EditShiftInput,
    errors: {
      name: '',
      start: '',
      end: '',
      published: ''
    } as { [key: string]: any }
  }),
  fetch({ store }) {
    store.dispatch('setTitle', 'My shifts')
  },
  mounted() {
    this.date = moment
      .unix(Number(this.shift.start) / 1000)
      .format('YYYY-MM-DD')
    this.field.name = this.shift.name
    this.field.start = moment
      .unix(Number(this.shift.start) / 1000)
      .format('HH:mm')
    this.field.end = moment.unix(Number(this.shift.end) / 1000).format('HH:mm')
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
    },
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

      const { data, errors } = await this.$apolloProvider.defaultClient.mutate({
        mutation: EditShiftGQL,
        variables: {
          params: {
            ...this.field,
            id: this.shift.id,
            start: moment(this.date + ' ' + this.field.start).toISOString(),
            end: moment(this.date + ' ' + this.field.end).toISOString()
          }
        } as EditShiftMutationVariables
      })

      this.loading = false

      if (errors) {
        this.error = 'something unexpected happened, please try again!'
        this.toast = true
        return
      }

      const { editShift }: EditShiftMutation = data
      const specificError = ['name', 'start', 'end', 'published']

      if (editShift.errors.length) {
        editShift.errors.forEach((error) => {
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
    }
  }
})
</script>
