import { MutationTree, ActionTree } from 'vuex'
import { UserResponse } from '@/types/graphql'
import { checkAuth } from '~/utils/user'

export const state = () => ({
  auth: {
    user: {
      id: 0,
      email: ''
    },
    accessToken: ''
  } as UserResponse
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  SET_AUTHENTICATION: (state, value: UserResponse) => (state.auth = value)
}

export const actions: ActionTree<RootState, RootState> = {
  /**
   * Called when server will be intilialize
   * @param { commit, dispatch }
   * @param context
   */
  async nuxtServerInit({ commit, dispatch }, context) {
    const auth = await dispatch('checkRefreshToken', context)

    if (auth) {
      commit('SET_AUTHENTICATION', auth)
    }

    await checkAuth(context)
  },

  /**
   * Check if refresh token
   * if valid, will return new access token
   * @param { state }
   * @param context
   */
  async checkRefreshToken({ state }, context) {
    const request = await context.$axios.post('/refresh-token')

    if (!request.data) {
      return false
    }

    const data: { ok: boolean; accessToken: string } = request.data

    if (!data.ok) {
      return false
    }

    return {
      user: state.auth.user,
      accessToken: data.accessToken
    }
  },

  /**
   * Reset acccount data and access token
   * @param { commit }
   */
  resetAuthentication({ commit }) {
    commit('SET_AUTHENTICATION', {
      user: {
        id: 0,
        email: ''
      },
      accessToken: ''
    })
  }
}
