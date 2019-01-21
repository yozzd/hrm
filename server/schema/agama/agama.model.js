const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv1 = require('uuid/v1');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const timestamps = require('mongoose-timestamp');
const { camelCase } = require('../global.methods');

const AgamaSchema = new Schema({
  _id: {
    type: String,
    default: uuidv1,
  },
  label: {
    type: String,
    unique: 'Agama "{VALUE}" sudah terdaftar',
  },
  value: String,
});

AgamaSchema.pre('save', async function() {
  this.value = await camelCase(this.label);
});

AgamaSchema.plugin(beautifyUnique);
AgamaSchema.plugin(timestamps);

module.exports = mongoose.model('Agama', AgamaSchema, 'agama');
