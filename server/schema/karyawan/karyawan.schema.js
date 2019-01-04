const { GraphQLObjectType, GraphQLList, GraphQLString } = require('graphql')
const { GraphQLDate } = require('graphql-iso-date')
const Karyawan = require('./karyawan.model')
const { KaryawanType, KaryawanPersonalInputType, KaryawanKeluargaInputType, KaryawanDeleteInputType, JenisKelaminEnumType, AgamaEnumType, StatusPerkawinanEnumType } = require('./karyawan.type')
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
      personal: { type: KaryawanPersonalInputType }
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
      statusPerkawinan: { type: StatusPerkawinanEnumType },
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
  karyawanKeluargaCreate: {
    type: KaryawanType,
    args: {
      id: { type: GraphQLString },
      keluarga: { type: KaryawanKeluargaInputType }
    },
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const karyawan = await Karyawan.findById(args.id)
        karyawan.keluarga.push(args.keluarga)
        return await karyawan.save()
      } catch(err) {
        throw err
      }
    })
  },
  karyawanKeluargaUpdate: {
    type: KaryawanType,
    args: {
      id: { type: GraphQLString },
      keluargaId: { type: GraphQLString },
      keluarga: { type: KaryawanKeluargaInputType }
    },
    resolve: auth.hasRole('personalia', async (_, args, ctx) => {
      try {
        const karyawan = await Karyawan.findById(args.id)
        ld.merge(karyawan.keluarga.id(args.keluargaId), args.keluarga)
        return await karyawan.save()
      } catch(err) {
        throw err
      }
    })
  },
  karyawanKeluargaDelete: {
    type: new GraphQLList(KaryawanType),
    args: {
      id: { type: GraphQLString },
      delete: { type: new GraphQLList(KaryawanDeleteInputType) }
    },
    resolve: auth.hasRole('personal', async (_, args, ctx) => {
      try {
        const karyawan = await Karyawan.findById(args.id)
        await Promise.all(args.delete.map(async (val) => {
          karyawan.keluarga.id(val.id).remove()
        }))
        await karyawan.save()
        return args.delete
      } catch(err) {
        throw err
      }
    })
  },
  karyawanDelete: {
    type: new GraphQLList(KaryawanType),
    args: {
      delete: { type: new GraphQLList(KaryawanDeleteInputType) }
    },
    resolve: auth.hasRole('personal', async (_, args, ctx) => {
      try {
        await Promise.all(args.delete.map(async (val) => {
          await Karyawan.findOneAndDelete({ _id : val.id })
        }))
        return args.delete
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
