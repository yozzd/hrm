const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
} = require('graphql');
const { AgamaType, AgamaDeleteInputType } = require('./agama.type');
const Agama = require('./agama.model');
const { UserError } = require('graphql-errors');
const auth = require('../auth/auth.service');
const ld = require('lodash');

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
  agamaUpdate: {
    type: AgamaType,
    args: {
      id: { type: GraphQLString },
      label: { type: GraphQLString },
    },
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const agama = await Agama.findById(args.id);
        const merge = ld.merge(agama, args);
        return await merge.save();
      } catch (err) {
        throw err;
      }
    }),
  },
  agamaDelete: {
    type: new GraphQLList(AgamaType),
    args: {
      delete: { type: new GraphQLList(AgamaDeleteInputType) },
    },
    resolve: auth.hasRole('personal', async (_, args, ctx) => {
      try {
        await Promise.all(
          args.delete.map(async val => {
            await Agama.findOneAndDelete({ _id: val.id });
          }),
        );
        return args.delete;
      } catch (err) {
        throw err;
      }
    }),
  },
};

module.exports = {
  Query,
  Mutation,
};
