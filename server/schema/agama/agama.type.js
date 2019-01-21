const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
} = require('graphql');
const { GraphQLDateTime } = require('graphql-iso-date');

const AgamaType = new GraphQLObjectType({
  name: 'AgamaType',
  fields: () => ({
    id: { type: GraphQLString },
    label: { type: GraphQLString },
    value: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

const AgamaDeleteInputType = new GraphQLInputObjectType({
  name: 'AgamaDeleteInputType',
  fields: () => ({
    id: { type: GraphQLString },
  }),
});

module.exports = {
  AgamaType,
  AgamaDeleteInputType,
};
