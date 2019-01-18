const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString
} = require('graphql')
const { GraphQLDateTime } = require('graphql-iso-date')

const UserType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    id: { type: GraphQLString },
    username: { type: GraphQLString },
    role: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime }
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
