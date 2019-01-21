const config = require('../config/environment');

const stop = async () => {
  config.mongo.close();
};

module.exports = async () => {
  await stop();
};
