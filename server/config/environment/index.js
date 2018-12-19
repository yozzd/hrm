const path = require('path')
const _ = require('lodash')
const environment = require(`./${process.env.NODE_ENV}.js`) || {}
const mongoose = require('mongoose')

const all = {
  env: process.env.NODE_ENV,
  root: path.normalize(`${__dirname}/../../..`),
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 3000,
  userRoles: ['user', 'manager', 'personalia', 'admin', 'root'],
  secret: {
    session: 'super-secret-session'
  },
  mongo: {
    connect: async () => {
      try {
        await mongoose.connect(environment.mongo.uri, {
          useCreateIndex: true,
          useNewUrlParser: true
        })
      } catch(err) {
        console.error(`MongoDB connection error: ${err}`)
        process.exit(-1)
      }
    },
    close: async () => {
      await mongoose.connection.close()
    }
  }
}

module.exports = _.merge(all, environment)
