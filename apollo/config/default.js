import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default (ctx) => {
  const httpLink = new HttpLink()
  const middlewareLink = new ApolloLink((operation, forward) => {
    const token = ctx.app.$auth.token
    if(token) {
      operation.setContext({
        headers: { authorization: `Bearer ${token}` }
      })
    }
    return forward(operation)
  })
  const link = middlewareLink.concat(httpLink)
  return {
    link,
    cache: new InMemoryCache(),
    defaultHttpLink: false
  }
}
