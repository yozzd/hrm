import gql from 'graphql-tag'

export const KARYAWAN_ALL = gql`
query {
  karyawanAll {
    id
    no
    nama
    tempatLahir
    tanggalLahir
    tanggalBergabung
    jenisKelamin
  }
}`

export const KARYAWAN_ALL_ID = gql`
query {
  karyawanAll {
    id
    no
    nama
  }
}`

export const KARYAWAN_CREATE = gql`
mutation karyawanCreate($no: String!, $nama: String!, $tempatLahir: String!, $tanggalLahir: Date!, $tanggalBergabung: Date!, $jenisKelamin: JenisKelaminEnumType!, $agama: AgamaEnumType!, $statusPerkawinan: MaritalStatusEnumType!, $telepon: String!) {
  karyawanCreate(no: $no, nama: $nama, tempatLahir: $tempatLahir, tanggalLahir: $tanggalLahir, tanggalBergabung: $tanggalBergabung, jenisKelamin: $jenisKelamin, agama: $agama, statusPerkawinan: $statusPerkawinan, telepon: $telepon) {
    id
    no
    nama
    tempatLahir
    tanggalLahir
    tanggalBergabung
    jenisKelamin
    agama
    statusPerkawinan
    telepon
  }
}`

export const KARYAWAN_PERSONAL = gql`
query karyawanDetail($id: String!) {
  karyawanDetail(id: $id) {
    id
    no
    nama
    tempatLahir
    tanggalLahir
    tanggalBergabung
    jenisKelamin
    agama
    statusPerkawinan
    telepon
  }
}`

export const KARYAWAN_UPDATE_PERSONAL = gql`
mutation karyawanUpdate($id: String!, $no: String!, $nama: String!, $tempatLahir: String!, $tanggalLahir: Date!, $tanggalBergabung: Date!, $jenisKelamin: JenisKelaminEnumType!, $agama: AgamaEnumType!, $statusPerkawinan: MaritalStatusEnumType!, $telepon: String!) {
  karyawanUpdate(id: $id, no: $no, nama: $nama, tempatLahir: $tempatLahir, tanggalLahir: $tanggalLahir, tanggalBergabung: $tanggalBergabung, jenisKelamin: $jenisKelamin, agama: $agama, statusPerkawinan: $statusPerkawinan, telepon: $telepon) {
    id
    no
    nama
    tempatLahir
    tanggalLahir
    tanggalBergabung
    jenisKelamin
    agama
    statusPerkawinan
    telepon
  }
}`

export const KARYAWAN_DELETE = gql`
mutation karyawanDelete($input: [KaryawanTypeInput]!) {
  karyawanDelete(input: $input) {
    id
  }
}`
