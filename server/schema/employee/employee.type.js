const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLEnumType } = require('graphql')
const { GraphQLDate } = require('graphql-iso-date')

const GenderEnumType = new GraphQLEnumType({
  name: 'GenderEnumType',
  values: {
    Male: { value: 0 },
    Female: { value: 1 }
  }
})

const ReligionEnumType = new GraphQLEnumType({
  name: 'ReligionEnumType',
  values: {
    Islam: { value: 0 },
    Kristen: { value: 1 },
    Budha: { value: 2 },
    Hindu: { value: 3 }
  }
})

const MaritalStatusEnumType = new GraphQLEnumType({
  name: 'MaritalStatusEnumType',
  values: {
    S: { value: 0 },
    M0: { value: 1 },
    M1: { value: 2 },
    M2: { value: 3 },
    M3: { value: 4 }
  }
})

const EmployeeType = new GraphQLObjectType({
  name: 'EmployeeType',
  fields: () => ({
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
  })
})

const EmployeeTypeInput = new GraphQLInputObjectType({
  name: 'EmployeeTypeInput',
  fields: () => ({
    id: { type: GraphQLString }
  })
})

module.exports = {
  EmployeeType,
  EmployeeTypeInput,
  GenderEnumType,
  ReligionEnumType,
  MaritalStatusEnumType
}
