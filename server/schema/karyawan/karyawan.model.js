const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uuidv1 = require('uuid/v1')
const beautifyUnique = require('mongoose-beautiful-unique-validation')
const timestamps = require('mongoose-timestamp')

const KeluargaSchema = new Schema({
  _id: {
    type: String,
    default: uuidv1
  },
  nama: String,
  hubunganKeluarga: String,
  jenisKelamin: {
    type: Number,
    enum: [0, 1]
  },
  tempatLahir: String,
  tanggalLahir: Date,
  pendidikan: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6, 7]
  },
  pekerjaan: String,
  alamat: String
})

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
  telepon: String,
  perumahan: String,
  blok: String,
  noP: String,
  rt: String,
  rw: String,
  kelurahan: String,
  kecamatan: String,
  kota: String,
  keluarga: [KeluargaSchema]
})

KaryawanSchema.plugin(beautifyUnique)
KaryawanSchema.plugin(timestamps)

module.exports = mongoose.model('Karyawan', KaryawanSchema, 'karyawan')
