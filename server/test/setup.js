const express = require('express')
const app = new express()
const config = require('../config/environment')
const graphqlHTTP = require('express-graphql')
const schema = require('../schema')
const auth = require('../schema/auth/auth.service')
const authPassport = require('../schema/auth/auth.passport')
const User = require('../schema/user/user.model')

const start = async () => {
  await config.mongo.connect()

  await User.deleteMany()

  const newUser = new User({
    username: 'gableh',
    password: 's3cr3tp4ssw0rd',
    role: 'admin'
  })
  await newUser.save()

  authPassport.setup(User)

  app.use('/graphql', auth.validateAuthorization, graphqlHTTP((req, res, params) => {
    return ({
      schema: schema,
      context: { req, res, params }
    })
  }))


  await app.listen(config.port, config.host)
  console.log(`Server listening on http://${config.host}:${config.port}`)
}

module.exports = async () => {
  await start()
}
