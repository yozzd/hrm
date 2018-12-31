const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql')
const { GraphQLDate } = require('graphql-iso-date')
const Karyawan = require('./karyawan.model')
const { KaryawanType, KaryawanTypeInput, JenisKelaminEnumType, AgamaEnumType, MaritalStatusEnumType } = require('./karyawan.type')
const { UserError } = require('graphql-errors')
const auth = require('../auth/auth.service')
const ld = require('lodash')

const Query = {
  karyawanAll: {
    type: new GraphQLList(KaryawanType),
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const karyawan = await Karyawan.find().sort('no')
        return karyawan
      } catch(err) {
        throw err
      }
    })
  },
  karyawanDetail: {
    type: KaryawanType,
    args: {
      id: { type: GraphQLString }
    },
    resolve: async (_, args, ctx) => {
      try {
        const karyawan = await Karyawan.findById(args.id)
        return karyawan
      } catch(err) {
        throw err
      }
    }
  }
}

const Mutation = {
  karyawanCreate: {
    type: KaryawanType,
    args: {
      no: { type: GraphQLString },
      nama: { type: GraphQLString },
      tempatLahir: { type: GraphQLString },
      tanggalLahir: { type: GraphQLDate },
      tanggalBergabung: { type: GraphQLDate },
      jenisKelamin: { type: JenisKelaminEnumType },
      agama: { type: AgamaEnumType },
      statusPerkawinan: { type: MaritalStatusEnumType },
      telepon: { type: GraphQLString }
    },
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const newKaryawan = new Karyawan(args)
        return await newKaryawan.save()
      } catch(err) {
        if(err.errors.no) {
          throw new UserError(err.errors.no.message)
        }
        throw err
      }
    })
  },
  karyawanUpdate: {
    type: KaryawanType,
    args: {
      id: { type: GraphQLString },
      no: { type: GraphQLString },
      nama: { type: GraphQLString },
      tempatLahir: { type: GraphQLString },
      tanggalLahir: { type: GraphQLDate },
      tanggalBergabung: { type: GraphQLDate },
      jenisKelamin: { type: JenisKelaminEnumType },
      agama: { type: AgamaEnumType },
      statusPerkawinan: { type: MaritalStatusEnumType },
      telepon: { type: GraphQLString },
      perumahan: { type: GraphQLString },
      blok: { type: GraphQLString },
      noP: { type: GraphQLString },
      rt: { type: GraphQLString },
      rw: { type: GraphQLString },
      kelurahan: { type: GraphQLString },
      kecamatan: { type: GraphQLString },
      kota: { type: GraphQLString }
    },
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const karyawan = await Karyawan.findById(args.id)
        const merge = ld.merge(karyawan, args)
        return await merge.save()
      } catch(err) {
        throw err
      }
    })
  },
  karyawanDelete: {
    type: new GraphQLList(KaryawanType),
    args: {
      input: { type: new GraphQLList(KaryawanTypeInput) }
    },
    resolve: auth.hasRole('personal', async (_, args, ctx) => {
      try {
        await Promise.all(args.input.map(async (val) => {
          await Karyawan.findOneAndDelete({ _id : val.id })
        }))
        return args.input
      } catch(err) {
        throw err
      }
    })
  }
}

module.exports = {
  Query,
  Mutation
}
