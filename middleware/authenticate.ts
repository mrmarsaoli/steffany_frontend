/**
 * Authentication middleware
 */

import { Middleware } from '@nuxt/types'
import { checkAuth } from '~/utils/user'

const authenticate: Middleware = async (context) => {
  if (process.server) {
    return
  }

  await checkAuth(context, true)
}

export default authenticate
