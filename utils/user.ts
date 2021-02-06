import authenticateGQL from '@/graphql/account/authenticate.graphql'
import { RootState } from '@/store'
import { Context } from '@nuxt/types/app'
import jwtDecode from 'jwt-decode'

/**
 * Check token validity
 * @param state
 */
const isTokenValid = (state: RootState) => {
  const accessToken =
    state.auth.accessToken === '' ? '' : `Bearer ${state.auth.accessToken}`

  if (accessToken === '') {
    return false
  }

  try {
    const { exp } = jwtDecode(accessToken) as {
      accountId: number
      exp: number
      iat: number
    }

    const hasExpired = !(Date.now() > exp * 1000)
    return hasExpired
  } catch {
    return false
  }
}

/**
 * Request new access token
 * @param context
 */
const requestToken = async (context: Context) => {
  const auth = await context.store.dispatch('checkRefreshToken', context)

  if (auth) {
    context.store.commit('SET_AUTHENTICATION', auth)
  }
}

/**
 * Authenticate user on website
 * If passed, will return account data
 * @param context
 * @param getToken
 */
export const checkAuth = async (
  context: Context,
  getToken: boolean = false
) => {
  const store = context.store
  const state: RootState = context.store.state

  if (getToken && !isTokenValid(state)) {
    await requestToken(context)
  }

  await context.app.apolloProvider?.defaultClient
    .query({
      query: authenticateGQL,
      fetchPolicy: 'network-only'
    })
    .then(({ data }: any) => {
      if (!data.authenticate) {
        return store.dispatch('resetAuthentication')
      }

      store.commit('SET_AUTHENTICATION', {
        account: data.authenticate,
        accessToken: state.auth.accessToken
      })
    })
    .catch(() => {
      store.dispatch('resetAuthentication')
    })
}
