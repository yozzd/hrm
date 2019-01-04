const { GraphQLObjectType, GraphQLList, GraphQLInputObjectType, GraphQLString, GraphQLEnumType } = require('graphql')
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

const StatusPernikahanEnumType = new GraphQLEnumType({
  name: 'StatusPernikahanEnumType',
  values: {
    BM: { value: 0 },
    M0: { value: 1 },
    M1: { value: 2 },
    M2: { value: 3 },
    M3: { value: 4 }
  }
})

const PendidikanEnumType = new GraphQLEnumType({
  name: 'PendidikanEnumType',
  values: {
    BB: { value: 0 },
    TK: { value: 1 },
    SD: { value: 2 },
    SMP: { value: 3 },
    SMA: { value: 4 },
    S1: { value: 5 },
    S2: { value: 6 },
    S3: { value: 7 }
  }
})

const personal = () => ({
  tempatLahir: { type: GraphQLString },
  tanggalLahir: { type: GraphQLDate },
  tanggalBergabung: { type: GraphQLDate },
  jenisKelamin: { type: JenisKelaminEnumType },
  agama: { type: AgamaEnumType },
  statusPernikahan: { type: StatusPernikahanEnumType },
  telepon: { type: GraphQLString }
})

const KaryawanPersonalType = new GraphQLObjectType({
  name: 'KaryawanPersonalType',
  fields: personal
})

const KaryawanPersonalInputType = new GraphQLInputObjectType({
  name: 'KaryawanPersonalInputType',
  fields: personal
})

const KaryawanKeluargaType = new GraphQLObjectType({
  name: 'KaryawanKeluargaType',
  fields: () => ({
    id: { type: GraphQLString },
    nama: { type: GraphQLString },
    hubunganKeluarga: { type: GraphQLString },
    jenisKelamin: { type: JenisKelaminEnumType },
    tempatLahir: { type: GraphQLString },
    tanggalLahir: { type: GraphQLDate },
    pendidikan: { type: PendidikanEnumType },
    pekerjaan: { type: GraphQLString },
    alamat: { type: GraphQLString}
  })
})

const KaryawanKeluargaInputType = new GraphQLInputObjectType({
  name: 'KaryawanKeluargaInputType',
  fields: () => ({
    nama: { type: GraphQLString },
    hubunganKeluarga: { type: GraphQLString },
    jenisKelamin: { type: JenisKelaminEnumType },
    tempatLahir: { type: GraphQLString },
    tanggalLahir: { type: GraphQLDate },
    pendidikan: { type: PendidikanEnumType },
    pekerjaan: { type: GraphQLString },
    alamat: { type: GraphQLString}
  })
})

const KaryawanType = new GraphQLObjectType({
  name: 'KaryawanType',
  fields: () => ({
    id: { type: GraphQLString },
    no: { type: GraphQLString },
    nama: { type: GraphQLString },
    personal: { type: KaryawanPersonalType },
    perumahan: { type: GraphQLString },
    blok: { type: GraphQLString },
    noP: { type: GraphQLString },
    rt: { type: GraphQLString },
    rw: { type: GraphQLString },
    kelurahan: { type: GraphQLString },
    kecamatan: { type: GraphQLString },
    kota: { type: GraphQLString },
    keluarga: { type: new GraphQLList(KaryawanKeluargaType) }
  })
})

const KaryawanDeleteInputType = new GraphQLInputObjectType({
  name: 'KaryawanDeleteInputType',
  fields: () => ({
    id: { type: GraphQLString }
  })
})

module.exports = {
  KaryawanType,
  KaryawanPersonalInputType,
  KaryawanKeluargaInputType,
  KaryawanDeleteInputType,
  JenisKelaminEnumType,
  AgamaEnumType,
  StatusPernikahanEnumType
}
