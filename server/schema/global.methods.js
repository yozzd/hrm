const _ = require('lodash');

const capitalizeWords = str => {
  return Promise.resolve(
    str.replace(/\w\S*/g, txt => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }),
  );
};

const camelCase = w => {
  return Promise.resolve(_.camelCase(w));
};

const getEnum = async model => {
  const obj = await model.find().sort('label');
  return Promise.resolve(
    _.reduce(
      obj,
      (r, v, k) => {
        r[v.value] = { value: k };
        return r;
      },
      {},
    ),
  );
};

module.exports = {
  capitalizeWords,
  camelCase,
  getEnum,
};
