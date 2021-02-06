import { Context } from '@nuxt/types'
import { RootState } from '~/store'

export default ({ store, env }: Context) => {
  return {
    httpEndpoint: env.GRAPHQL_URL,
    httpLinkOptions: {
      credentials: 'include'
    },
    getAuth: () => {
      const state: RootState = store.state
      const accessToken =
        state.auth.accessToken === '' ? '' : `Bearer ${state.auth.accessToken}`
      return accessToken
    }
  }
}
