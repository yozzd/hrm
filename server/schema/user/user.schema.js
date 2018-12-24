const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql')
const ld = require('lodash')
const auth = require('../auth/auth.service')
const User = require('./user.model')
const { UserType, UserTypeInput } = require('./user.type')
const { UserError } = require('graphql-errors')

const Query = {
  userAll: {
    type: new GraphQLList(UserType),
    resolve: auth.hasRole('admin', async (_, args, ctx) => {
      try {
        const users = await User.find().sort('username')
        return ld.filter(users, o => {
          return o.role !== 'root'
        })
      } catch(err) {
        throw err
      }
    })
  },
  userMe: {
    type: UserType,
    resolve: auth.isAuthenticated(async (_, args, ctx) => {
      try {
        return await User.findById(ctx.req.user._id)
      } catch(err) {
        throw err
      }
    })
  }
}

const Mutation = {
  userCreate: {
    type: UserType,
    args: {
      username: { type: GraphQLString },
      password: { type: GraphQLString },
      role: { type: GraphQLString }
    },
    resolve: async (_, args) => {
      try {
        const newUser = new User(args)
        return await newUser.save()
      } catch(err) {
        if(err.errors) {
          throw new UserError(err.errors.username.message)
        }
        throw err
      }
    }
  },
  userUpdate: {
    type: UserType,
    args: {
      id: { type: GraphQLString },
      username: { type: GraphQLString },
      role: { type: GraphQLString }
    },
    resolve: auth.hasRole('admin', async (_, args, ctx) => {
      try {
        const user = await User.findById(args.id)
        user.username = args.username
        user.role = args.role
        return await user.save()
      } catch(err) {
        throw err
      }
    })
  },
  userDelete: {
    type: new GraphQLList(UserType),
    args: {
      input: { type: new GraphQLList(UserTypeInput) }
    },
    resolve: auth.hasRole('admin', async (_, args, ctx) => {
      try {
        await Promise.all(args.input.map(async (val) => {
          await User.findOneAndDelete({ _id : val.id })
        }))
        return args.input
      } catch(err) {
        throw err
      }
    })
  }
}

module.exports = {
  Query,
  Mutation
}
