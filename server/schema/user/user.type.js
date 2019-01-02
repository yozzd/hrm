const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString } = require('graphql')

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    role: { type: GraphQLString }
  })
})

const UserDeleteInputType = new GraphQLInputObjectType({
  name: 'UserDeleteInputType',
  fields: () => ({
    id: { type: GraphQLString }
  })
})

module.exports = {
  UserType,
  UserDeleteInputType
}
