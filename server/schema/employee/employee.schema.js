const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql')
const { GraphQLDate } = require('graphql-iso-date')
const Employee = require('./employee.model')
const { EmployeeType, EmployeeTypeInput, GenderEnumType, ReligionEnumType, MaritalStatusEnumType } = require('./employee.type')
const { UserError } = require('graphql-errors')
const auth = require('../auth/auth.service')
const ld = require('lodash')

const Query = {
  employeeAll: {
    type: new GraphQLList(EmployeeType),
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const employees = await Employee.find().sort('no')
        return employees
      } catch(err) {
        throw err
      }
    })
  },
  employeeDetail: {
    type: EmployeeType,
    args: {
      id: { type: GraphQLString }
    },
    resolve: async (_, args, ctx) => {
      try {
        const employee = await Employee.findById(args.id)
        return employee
      } catch(err) {
        throw err
      }
    }
  }
}

const Mutation = {
  employeeCreate: {
    type: EmployeeType,
    args: {
      no: { type: GraphQLString },
      name: { type: GraphQLString },
      placeOfBirth: { type: GraphQLString },
      dateOfBirth: { type: GraphQLDate },
      dateOfJoin: { type: GraphQLDate },
      gender: { type: GenderEnumType },
      religion: { type: ReligionEnumType },
      maritalStatus: { type: MaritalStatusEnumType },
      phoneNumber: { type: GraphQLString }
    },
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const newEmployee = new Employee(args)
        return await newEmployee.save()
      } catch(err) {
        if(err.errors.no) {
          throw new UserError(err.errors.no.message)
        }
        throw err
      }
    })
  },
  employeeUpdate: {
    type: EmployeeType,
    args: {
      id: { type: GraphQLString },
      no: { type: GraphQLString },
      name: { type: GraphQLString },
      placeOfBirth: { type: GraphQLString },
      dateOfBirth: { type: GraphQLDate },
      dateOfJoin: { type: GraphQLDate },
      gender: { type: GenderEnumType },
      religion: { type: ReligionEnumType },
      maritalStatus: { type: MaritalStatusEnumType },
      phoneNumber: { type: GraphQLString }
    },
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const employee = await Employee.findById(args.id)
        const merge = ld.merge(employee, args)
        return await merge.save()
      } catch(err) {
        throw err
      }
    })
  },
  employeeDelete: {
    type: new GraphQLList(EmployeeType),
    args: {
      input: { type: new GraphQLList(EmployeeTypeInput) }
    },
    resolve: auth.hasRole('personal', async (_, args, ctx) => {
      try {
        await Promise.all(args.input.map(async (val) => {
          await Employee.findOneAndDelete({ _id : val.id })
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
