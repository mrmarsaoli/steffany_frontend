/* eslint-disable no-console */
export default ({ graphQLErrors, networkError, operation, forward }: any) => {
  console.log('Global error handler')
  console.log(graphQLErrors, networkError, operation, forward)
}
