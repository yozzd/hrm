const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const cfg = require('./config/environment')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
const { maskErrors } = require('graphql-errors')
const passport = require('passport')
const authPassport = require('./schema/auth/auth.passport')
const User = require('./schema/user/user.model')
const auth = require('./schema/auth/auth.service')
const { graphqlUploadExpress } = require('graphql-upload')
maskErrors(schema)

app.set('port', cfg.port)

let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

authPassport.setup(User)

app.use('/graphql',
  auth.validateAuthorization,
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP((req, res, params) => {
    return ({
      schema: schema,
      context: { req, res, params },
      graphiql: process.env.NODE_ENV !== 'production'
    })
  }))

app.use(passport.initialize())

const start = async () => {
  await cfg.mongo.connect()

  const nuxt = new Nuxt(config)

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(nuxt.render)

  await app.listen(cfg.port, cfg.host)
  console.log(`Server listening on http://${cfg.host}:${cfg.port}`)
}
start()
