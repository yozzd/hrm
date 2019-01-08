import gql from 'graphql-tag'

export const KARYAWAN_ALL = gql`
query {
  karyawanAll {
    id
    no
    nama
    personal {
      tempatLahir
      tanggalLahir
      tanggalBergabung
      jenisKelamin
      agama
      statusPernikahan
      telepon
    }
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
mutation karyawanCreate($no: String!, $nama: String!, $personal: KaryawanPersonalInputType) {
  karyawanCreate(no: $no, nama: $nama, personal: $personal) {
    id
    no
    nama
    personal {
      tempatLahir
      tanggalLahir
      tanggalBergabung
      jenisKelamin
      agama
      statusPernikahan
      telepon
    }
  }
}`

export const KARYAWAN_PERSONAL = gql`
query karyawanDetail($id: String!) {
  karyawanDetail(id: $id) {
    id
    no
    nama
    personal {
      tempatLahir
      tanggalLahir
      tanggalBergabung
      jenisKelamin
      agama
      statusPernikahan
      telepon
    }
  }
}`

export const KARYAWAN_UPDATE_PERSONAL = gql`
mutation karyawanUpdate($id: String!, $no: String!, $nama: String!, $personal: KaryawanPersonalInputType) {
  karyawanUpdate(id: $id, no: $no, nama: $nama, personal: $personal) {
    id
    no
    nama
    personal {
      tempatLahir
      tanggalLahir
      tanggalBergabung
      jenisKelamin
      agama
      statusPernikahan
      telepon
    }
  }
}`

export const KARYAWAN_ALAMAT = gql`
query karyawanDetail($id: String!) {
  karyawanDetail(id: $id) {
    id
    no
    nama
    alamat {
      perumahan
      blok
      no
      rt
      rw
      kelurahan
      kecamatan
      kota
    }
  }
}`

export const KARYAWAN_UPDATE_ALAMAT = gql`
mutation karyawanAlamatUpdate($id: String!, $alamat: KaryawanAlamatInputType) {
  karyawanAlamatUpdate(id: $id, alamat: $alamat) {
    id
    alamat {
      perumahan
      blok
      no
      rt
      rw
      kelurahan
      kecamatan
      kota
    }
  }
}`

export const KARYAWAN_KELUARGA = gql`
query karyawanDetail($id: String!) {
  karyawanDetail(id: $id) {
    id
    no
    nama
    keluarga {
      id
      nama
      hubunganKeluarga
      jenisKelamin
      tempatLahir
      tanggalLahir
      pendidikan
      pekerjaan
      alamat
    }
  }
}`

export const KARYAWAN_CREATE_KELUARGA = gql`
mutation karyawanKeluargaCreate($id: String!, $keluarga: KaryawanKeluargaInputType) {
  karyawanKeluargaCreate(id: $id, keluarga: $keluarga) {
    id
    keluarga {
      id
      nama
      hubunganKeluarga
      jenisKelamin
      tempatLahir
      tanggalLahir
      pendidikan
      pekerjaan
      alamat
    }
  }
}`

export const KARYAWAN_UPDATE_KELUARGA = gql`
mutation karyawanKeluargaUpdate($id: String!, $keluarga: KaryawanKeluargaInputType) {
  karyawanKeluargaUpdate(id: $id, keluarga: $keluarga) {
    id
    keluarga {
      id
      nama
      hubunganKeluarga
      jenisKelamin
      tempatLahir
      tanggalLahir
      pendidikan
      pekerjaan
      alamat
    }
  }
}`

export const KARYAWAN_DELETE_KELUARGA = gql`
mutation karyawanKeluargaDelete($id: String!, $delete: [KaryawanDeleteInputType]!) {
  karyawanKeluargaDelete(id: $id, delete: $delete) {
    id
  }
}`

export const KARYAWAN_DELETE = gql`
mutation karyawanDelete($delete: [KaryawanDeleteInputType]!) {
  karyawanDelete(delete: $delete) {
    id
  }
}`
