import gql from 'graphql-tag'

export const EMPLOYEE_ALL = gql`
query {
  employeeAll {
    id
    no
    name
    placeOfBirth
    dateOfBirth
    dateOfJoin
    gender
  }
}`

export const EMPLOYEE_ALL_ID = gql`
query {
  employeeAll {
    id
    no
    name
  }
}`

export const EMPLOYEE_CREATE = gql`
mutation employeeCreate($no: String!, $name: String!, $placeOfBirth: String!, $dateOfBirth: Date!, $dateOfJoin: Date!, $gender: GenderEnumType!, $religion: ReligionEnumType!, $maritalStatus: MaritalStatusEnumType!, $phoneNumber: String!) {
  employeeCreate(no: $no, name: $name, placeOfBirth: $placeOfBirth, dateOfBirth: $dateOfBirth, dateOfJoin: $dateOfJoin, gender: $gender, religion: $religion, maritalStatus: $maritalStatus, phoneNumber: $phoneNumber) {
    id
    no
    name
    placeOfBirth
    dateOfBirth
    dateOfJoin
    gender
    religion
    maritalStatus
    phoneNumber
  }
}`

export const EMPLOYEE_PERSONAL = gql`
query employeeDetail($id: String!) {
  employeeDetail(id: $id) {
    id
    no
    name
    placeOfBirth
    dateOfBirth
    dateOfJoin
    gender
    religion
    maritalStatus
    phoneNumber
  }
}`

export const EMPLOYEE_UPDATE_PERSONAL = gql`
mutation employeeUpdate($id: String!, $no: String!, $name: String!, $placeOfBirth: String!, $dateOfBirth: Date!, $dateOfJoin: Date!, $gender: GenderEnumType!, $religion: ReligionEnumType!, $maritalStatus: MaritalStatusEnumType!, $phoneNumber: String!) {
  employeeUpdate(id: $id, no: $no, name: $name, placeOfBirth: $placeOfBirth, dateOfBirth: $dateOfBirth, dateOfJoin: $dateOfJoin, gender: $gender, religion: $religion, maritalStatus: $maritalStatus, phoneNumber: $phoneNumber) {
    id
    no
    name
    placeOfBirth
    dateOfBirth
    dateOfJoin
    gender
    religion
    maritalStatus
    phoneNumber
  }
}`

export const EMPLOYEE_DELETE = gql`
mutation employeeDelete($input: [EmployeeTypeInput]!) {
  employeeDelete(input: $input) {
    id
  }
}`
