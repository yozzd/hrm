const express = require('express')
const app = new express()
const config = require('../config/environment')
const host = config.host
const port = config.port

const start = async () => {
  await config.mongo.connect()
  await app.listen(port, host)
  console.log(`Server listening on http://${host}:${port}`)
}

module.exports = async () => {
  await start()
}
