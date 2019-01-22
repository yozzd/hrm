const _ = require('lodash');

const capitalizeWords = str => {
  return Promise.resolve(
    str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }),
  );
};

module.exports = {
  capitalizeWords,
};
