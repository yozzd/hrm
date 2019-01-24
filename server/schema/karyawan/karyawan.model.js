const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uuidv1 = require('uuid/v1');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const timestamps = require('mongoose-timestamp');
const { capitalizeWords } = require('../global.methods');

const KeluargaSchema = new Schema({
  _id: {
    type: String,
    default: uuidv1,
  },
  nama: String,
  hubunganKeluarga: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
  },
  jenisKelamin: {
    type: Number,
    enum: [0, 1],
  },
  tempatLahir: String,
  tanggalLahir: Date,
  pendidikan: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  },
  pekerjaan: String,
  alamat: String,
});

const KontakSchema = new Schema({
  _id: {
    type: String,
    default: uuidv1,
  },
  nama: String,
  hubunganKeluarga: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
  },
  telepon: String,
  alamat: String,
});

const KaryawanSchema = new Schema({
  _id: {
    type: String,
    default: uuidv1,
  },
  no: {
    type: String,
    unique: 'No Karyawan "{VALUE}" sudah terpakai',
  },
  nama: String,
  personal: {
    tempatLahir: String,
    tanggalLahir: Date,
    tanggalBergabung: Date,
    jenisKelamin: {
      type: Number,
      enum: [0, 1],
    },
    agama: Number,
    statusPernikahan: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
    },
    alamatSekarang: String,
    alamatKTP: String,
    telepon: String,
  },
  keluarga: [KeluargaSchema],
  kontak: [KontakSchema],
  image: {
    path: String,
    filename: String,
    mimetype: String,
    encoding: String,
  },
});

KaryawanSchema.pre('save', async function(next) {
  this.personal.alamatSekarang = await capitalizeWords(
    this.personal.alamatSekarang,
  );
  this.personal.alamatKTP = await capitalizeWords(this.personal.alamatKTP);
});

KaryawanSchema.plugin(beautifyUnique);
KaryawanSchema.plugin(timestamps);

module.exports = mongoose.model('Karyawan', KaryawanSchema, 'karyawan');
