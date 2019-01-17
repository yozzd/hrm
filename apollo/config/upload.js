import { createUploadLink } from 'apollo-upload-client'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default (ctx) => {
  const authLink = setContext((_, { headers }) => {
    const token = ctx.app.$auth.token
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const link = authLink.concat(createUploadLink())

  return {
    link,
    cache: new InMemoryCache(),
    defaultHttpLink: false
  }
}
