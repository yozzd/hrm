const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql')
const ld = require('lodash')
const auth = require('../auth/auth.service')
const User = require('./user.model')
const { UserType, UserDeleteInputType } = require('./user.type')
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
  },
  userDetail: {
    type: UserType,
    args: {
      id: { type: GraphQLString }
    },
    resolve: async (_, args, ctx) => {
      try {
        const user = await User.findById(args.id)
        return user
      } catch(err) {
        throw err
      }
    }
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
        if(err.errors.username) {
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
  userChangePassword: {
    type: UserType,
    args: {
      id: { type: GraphQLString },
      oldPassword: { type: GraphQLString },
      newPassword: { type: GraphQLString }
    },
    resolve: auth.isAuthenticated(async (_, args, ctx) => {
      try {
        const user = await User.findById(args.id)
        const auth = await user.authenticate(args.oldPassword)
        if(auth) {
          user.password = args.newPassword
          return await user.save()
        } else {
          throw new UserError('Password anda tidak sama')
        }
      } catch(err) {
        throw err
      }
    })
  },
  userDelete: {
    type: new GraphQLList(UserType),
    args: {
      delete: { type: new GraphQLList(UserDeleteInputType) }
    },
    resolve: auth.hasRole('admin', async (_, args, ctx) => {
      try {
        await Promise.all(args.delete.map(async (val) => {
          await User.findOneAndDelete({ _id : val.id })
        }))
        return args.delete
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
