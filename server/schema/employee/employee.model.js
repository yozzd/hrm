const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uuidv1 = require('uuid/v1')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const timestamps = require('mongoose-timestamp')

const EmployeeSchema = new Schema({
  _id: {
    type: String,
    default: uuidv1
  },
  no: {
    type: String,
    unique: 'The specified Employee No "{VALUE}" is already in use'
  },
  name: String,
  placeOfBirth: String,
  dateOfBirth: Date,
  dateOfJoin: Date,
  gender: {
    type: Number,
    enum: [0, 1]
  },
  religion: {
    type: Number,
    enum: [0, 1, 2, 3]
  },
  maritalStatus: {
    type: Number,
    enum: [0, 1, 2, 3, 4]
  },
  phoneNumber: String
})

EmployeeSchema.plugin(beautifyUnique)
EmployeeSchema.plugin(timestamps)

module.exports = mongoose.model('Employee', EmployeeSchema, 'employee')
