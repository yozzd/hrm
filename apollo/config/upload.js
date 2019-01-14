import { ApolloLink } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'

export default (ctx) => {
  const middlewareLink = new ApolloLink((operation, forward) => {
    const token = ctx.app.$auth.token
    if(token) {
      operation.setContext({
        headers: { authorization: `Bearer ${token}` }
      })
    }
    return forward(operation)
  })
  const link = middlewareLink.concat(createUploadLink())
  return {
    link,
    cache: new InMemoryCache(),
    defaultHttpLink: false
  }
}
