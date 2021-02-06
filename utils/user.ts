import { Context } from '@nuxt/types/app'
import jwtDecode from 'jwt-decode'
import authenticateGQL from '~/graphql/user/authenticate.graphql'
import { RootState } from '~/store'
import { AuthenticateQuery } from '~/types/graphql'

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
      userId: number
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
 * Redirect to login if user not authenticated
 * @param context
 */
const redirectToLogin = (context: Context) => {
  const page = context.route.name

  if (page === 'signup' || page === 'login') {
    return
  }

  const url = encodeURIComponent(context.route.path)

  context.redirect('/login', { r: url })
}

/**
 * Handle error
 * @param context
 * @param log
 */
export const handleError = (context: Context, log: any = null) => {
  if (log) {
    context.$log(log)
  }
  context.store.dispatch('resetAuthentication')
  redirectToLogin(context)
}

/**
 * Authenticate user on website
 * If passed, will return user data
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
    .then(({ data }: { data: AuthenticateQuery }) => {
      if (!data.authenticate) {
        handleError(context)
        return
      }

      const auth = data.authenticate

      if (auth.errors.length) {
        handleError(context, auth.errors)
        return
      }

      store.commit('SET_AUTHENTICATION', {
        user: auth.user,
        accessToken: state.auth.accessToken
      })
    })
    .catch((err) => {
      handleError(context, err)
    })
}
