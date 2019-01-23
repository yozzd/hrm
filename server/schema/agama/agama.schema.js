const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require('graphql');
const { AgamaType } = require('./agama.type');
const Agama = require('./agama.model');
const { UserError } = require('graphql-errors');
const auth = require('../auth/auth.service');

const Query = {
  agamaAll: {
    type: new GraphQLList(AgamaType),
    resolve: auth.hasRole('admin', async (_, args, ctx) => {
      try {
        const agama = await Agama.find().sort('label');
        return agama;
      } catch (err) {
        throw err;
      }
    }),
  },
};

const Mutation = {
  agamaCreate: {
    type: AgamaType,
    args: {
      label: { type: GraphQLString },
      value: { type: GraphQLInt },
    },
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const newAgama = new Agama(args);
        return await newAgama.save();
      } catch (err) {
        if (err.errors.label) {
          throw new UserError(err.errors.label.message);
        }
        throw err;
      }
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
