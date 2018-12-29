const { GraphQLSchema, GraphQLObjectType } = require('graphql')
const _ = require('lodash')
const Auth = require('./auth/auth.schema')
const User = require('./user/user.schema')
const Karyawan = require('./karyawan/karyawan.schema')

const query = new GraphQLObjectType({
  name: 'Query',
  fields: _.merge(
    Auth.Query,
    User.Query,
    Karyawan.Query
  )
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: _.merge(
    User.Mutation,
    Karyawan.Mutation
  )
})

module.exports = new GraphQLSchema({
  query,
  mutation
})
