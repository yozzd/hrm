const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLEnumType } = require('graphql')
const { GraphQLDate } = require('graphql-iso-date')

const JenisKelaminEnumType = new GraphQLEnumType({
  name: 'JenisKelaminEnumType',
  values: {
    L: { value: 0 },
    P: { value: 1 }
  }
})

const AgamaEnumType = new GraphQLEnumType({
  name: 'AgamaEnumType',
  values: {
    Islam: { value: 0 },
    Kristen: { value: 1 },
    Budha: { value: 2 },
    Hindu: { value: 3 }
  }
})

const MaritalStatusEnumType = new GraphQLEnumType({
  name: 'MaritalStatusEnumType',
  values: {
    BM: { value: 0 },
    M0: { value: 1 },
    M1: { value: 2 },
    M2: { value: 3 },
    M3: { value: 4 }
  }
})

const KaryawanType = new GraphQLObjectType({
  name: 'KaryawanType',
  fields: () => ({
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
  })
})

const KaryawanTypeInput = new GraphQLInputObjectType({
  name: 'KaryawanTypeInput',
  fields: () => ({
    id: { type: GraphQLString }
  })
})

module.exports = {
  KaryawanType,
  KaryawanTypeInput,
  JenisKelaminEnumType,
  AgamaEnumType,
  MaritalStatusEnumType
}
