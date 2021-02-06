import { Context } from '@nuxt/types'
import { RootState } from '~/store'

export default ({ store, env }: Context) => {
  return {
    httpEndpoint: env.API_URL + '/graphql',
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
