const mongoose = require('mongoose')
const Schema = mongoose.Schema
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const timestamps = require('mongoose-timestamp')

const UserSchema = new Schema({
  _id: {
    type: String,
    default: uuidv1
  },
  username: {
    type: String,
    unique: 'Username "{VALUE}" sudah terpakai'
  },
  password: String,
  role: String,
  salt: String
})

UserSchema
  .virtual('profile')
  .get(function() {
    return {
      'username': this.username,
      'role': this.role
    }
  })

UserSchema
  .virtual('token')
  .get(function() {
    return {
      '_id': this._id,
      'role': this.role
    }
  })

const validatePresenceOf = (value) => {
  return value && value.length
}

UserSchema
  .pre('save', async function(next) {
    if(!this.isModified('password')) {
      return next()
    }

    if(!validatePresenceOf(this.password)) {
      return next(new Error('Invalid password'))
    }

    this.salt = await this.makeSalt()
    this.password = await this.encryptPassword(this.password)
    next()
  })

UserSchema.methods = {
  makeSalt: async function () {
    try {
      const bytes = 16
      const salt = await crypto.randomBytes(bytes).toString('base64')
      return salt
    } catch(err) {
      throw err
    }
  },
  encryptPassword: async function (password) {
    try {
      const defaultIterations = 10000
      const defaultKeyLength = 64
      const salt = new Buffer.from(this.salt, 'base64')
      const key = await crypto.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha256').toString('base64')
      return key
    } catch(err) {
      throw err
    }
  },
  authenticate: async function (password) {
    try {
      const pwgen = await this.encryptPassword(password)
      if(this.password === pwgen) {
        return true
      } else {
        return false
      }
    } catch(err) {
      throw err
    }
  }
}

UserSchema.plugin(beautifyUnique)
UserSchema.plugin(timestamps)

module.exports = mongoose.model('User', UserSchema, 'user')
