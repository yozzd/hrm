const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const _ = require('lodash');
const Auth = require('./auth/auth.schema');
const User = require('./user/user.schema');
const Agama = require('./agama/agama.schema');
const Karyawan = require('./karyawan/karyawan.schema');

const query = new GraphQLObjectType({
  name: 'Query',
  fields: _.merge(Auth.Query, User.Query, Agama.Query, Karyawan.Query),
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: _.merge(User.Mutation, Agama.Mutation, Karyawan.Mutation),
});

module.exports = new GraphQLSchema({
  query,
  mutation,
});
