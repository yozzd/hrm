const express = require('express')
const app = new express()
const config = require('../config/environment')

const start = async () => {
  await config.mongo.connect()
  await app.listen(config.port, config.host)
  console.log(`Server listening on http://${config.host}:${config.port}`)
}

module.exports = async () => {
  await start()
}
