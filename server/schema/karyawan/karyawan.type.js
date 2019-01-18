const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLEnumType
} = require('graphql')
const { 
  GraphQLDate,
  GraphQLDateTime
} = require('graphql-iso-date')

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
    Budha: { value: 0 },
    Hindu: { value: 1 },
    Islam: { value: 2 },
    Kristen: { value: 3 }
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

const HubunganKeluargaEnumType = new GraphQLEnumType({
  name: 'HubunganKeluargaEnumType',
  values: {
    Anak: { value: 0 },
    Ayah: { value: 1 },
    Ibu: { value: 2 },
    Istri: { value: 3 },
    Suami: { value: 4 }
  }
})

const PendidikanEnumType = new GraphQLEnumType({
  name: 'PendidikanEnumType',
  values: {
    BB: { value: 0 },
    TB: { value: 1 },
    TK: { value: 2 },
    SD: { value: 3 },
    SMP: { value: 4 },
    SMA: { value: 5 },
    D1: { value: 6 },
    D2: { value: 7 },
    D3: { value: 8 },
    D4: { value: 9 },
    S1: { value: 10 },
    S2: { value: 11 },
    S3: { value: 12 }
  }
})

const personal = () => ({
  tempatLahir: { type: GraphQLString },
  tanggalLahir: { type: GraphQLDate },
  tanggalBergabung: { type: GraphQLDate },
  jenisKelamin: { type: JenisKelaminEnumType },
  agama: { type: AgamaEnumType },
  statusPernikahan: { type: StatusPernikahanEnumType },
  alamatSekarang: { type: GraphQLString },
  alamatKTP: { type: GraphQLString },
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

const keluarga = () => ({
  id: { type: GraphQLString },
  nama: { type: GraphQLString },
  hubunganKeluarga: { type: HubunganKeluargaEnumType },
  jenisKelamin: { type: JenisKelaminEnumType },
  tempatLahir: { type: GraphQLString },
  tanggalLahir: { type: GraphQLDate },
  pendidikan: { type: PendidikanEnumType },
  pekerjaan: { type: GraphQLString },
  alamat: { type: GraphQLString}
})

const KaryawanKeluargaType = new GraphQLObjectType({
  name: 'KaryawanKeluargaType',
  fields: keluarga
})

const KaryawanKeluargaInputType = new GraphQLInputObjectType({
  name: 'KaryawanKeluargaInputType',
  fields: keluarga
})

const image = () => ({
  path: { type: GraphQLString },
  filename: { type: GraphQLString },
  mimetype: { type: GraphQLString },
  encoding: { type: GraphQLString }
})

const KaryawanImageType = new GraphQLObjectType({
  name: 'KaryawanImageType',
  fields: image
})

const KaryawanType = new GraphQLObjectType({
  name: 'KaryawanType',
  fields: () => ({
    id: { type: GraphQLString },
    no: { type: GraphQLString },
    nama: { type: GraphQLString },
    personal: { type: KaryawanPersonalType },
    keluarga: { type: new GraphQLList(KaryawanKeluargaType) },
    image: { type: KaryawanImageType },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime }
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
  KaryawanDeleteInputType
}
