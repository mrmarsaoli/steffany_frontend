/* eslint-disable no-console */
import { Plugin } from '@nuxt/types'

declare module 'vue/types/vue' {
  interface Vue {
    $log(message?: any, ...optionalParams: any[]): void
    $logError(message?: any, ...optionalParams: any[]): void
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $log(message?: any, ...optionalParams: any[]): void
    $logError(message?: any, ...optionalParams: any[]): void
  }
  interface Context {
    $log(message?: any, ...optionalParams: any[]): void
    $logError(message?: any, ...optionalParams: any[]): void
  }
}

const log: Plugin = ({ env }, inject) => {
  const __prod__ = env.NODE_ENV === 'production'
  inject('log', (message?: any, ...optionalParams: any[]) => {
    if (__prod__) {
      return
    }

    if (!message) {
      return
    }

    if (optionalParams.length === 0) {
      console.log(message)
      return
    }

    console.log(message, ...optionalParams)
  })
  inject('log', (message?: any, ...optionalParams: any[]) => {
    if (__prod__) {
      return
    }

    if (!message) {
      return
    }

    if (optionalParams.length === 0) {
      console.log(message)
      return
    }

    console.log(message, ...optionalParams)
  })
}

export default log
