const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString } = require('graphql')

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    role: { type: GraphQLString }
  })
})

const UserTypeInput = new GraphQLInputObjectType({
  name: 'UserTypeInput',
  fields: () => ({
    id: { type: GraphQLString }
  })
})

module.exports = {
  UserType,
  UserTypeInput
}
