const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uuidv1 = require('uuid/v1')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const timestamps = require('mongoose-timestamp')

const KaryawanSchema = new Schema({
  _id: {
    type: String,
    default: uuidv1
  },
  no: {
    type: String,
    unique: 'No Karyawan "{VALUE}" sudah terpakai'
  },
  nama: String,
  tempatLahir: String,
  tanggalLahir: Date,
  tanggalBergabung: Date,
  jenisKelamin: {
    type: Number,
    enum: [0, 1]
  },
  agama: {
    type: Number,
    enum: [0, 1, 2, 3]
  },
  statusPerkawinan: {
    type: Number,
    enum: [0, 1, 2, 3, 4]
  },
  telepon: String
})

KaryawanSchema.plugin(beautifyUnique)
KaryawanSchema.plugin(timestamps)

module.exports = mongoose.model('Karyawan', KaryawanSchema, 'karyawan')
