//import { ApolloLink } from 'apollo-link'
//import { HttpLink } from 'apollo-link-http'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

export default (ctx) => {
  //const httpLink = new HttpLink()
  //  const middlewareLink = new ApolloLink((operation, forward) => {
  //    const token = ctx.app.$auth.token
  //    if(token) {
  //      operation.setContext({
  //        headers: { authorization: token ? `Bearer ${token}` : '' }
  //      })
  //    }
  //    return forward(operation)
  //  })

  const httpLink = createHttpLink({ uri: '/graphql' })

  const authLink = setContext((_, { headers }) => {
    const token = ctx.app.$auth.token
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const link = authLink.concat(httpLink)

  return {
    link,
    cache: new InMemoryCache(),
    defaultHttpLink: false
  }
}
