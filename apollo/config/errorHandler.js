import * as _ from 'lodash'

export default (err) => {
  const { networkError, graphQLErrors } = err

  let errors
  if(networkError) {
    errors = networkError.result.errors
  } else {
    errors = graphQLErrors
  }

  return _.reduce(errors, (r, v, k) => {
    r[k] = v.message
    return r
  }, [])
}

