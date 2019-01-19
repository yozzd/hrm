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
      alamatSekarang
      alamatKTP
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

export const KARYAWAN_ONE_ID = gql`
query karyawanDetail($id: String!) {
  karyawanDetail(id: $id) {
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
      alamatSekarang
      alamatKTP
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
      alamatSekarang
      alamatKTP
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
      alamatSekarang
      alamatKTP
      telepon
    }
  }
}`

export const KARYAWAN_KELUARGA = gql`
query karyawanDetail($id: String!) {
  karyawanDetail(id: $id) {
    id
    no
    nama
    personal {
      alamatSekarang
      alamatKTP
    }
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

export const KARYAWAN_KONTAK = gql`
query karyawanDetail($id: String!) {
  karyawanDetail(id: $id) {
    id
    no
    nama
    personal {
      alamatSekarang
      alamatKTP
    }
    kontak {
      id
      nama
      hubunganKeluarga
      telepon
      alamat
    }
  }
}`

export const KARYAWAN_CREATE_KONTAK = gql`
mutation karyawanKontakCreate($id: String!, $kontak: KaryawanKontakInputType) {
  karyawanKontakCreate(id: $id, kontak: $kontak) {
    id
    kontak {
      id
      nama
      hubunganKeluarga
      telepon
      alamat
    }
  }
}`

export const KARYAWAN_IMAGE = gql`
query karyawanDetail($id: String!) {
  karyawanDetail(id: $id) {
    id
    no
    nama
    image {
      path
      filename
    }
  }
}`


export const KARYAWAN_UPDATE_IMAGE = gql`
mutation karyawanImageUpdate($id: String!, $image: Upload!) {
  karyawanImageUpdate(id: $id, image: $image) {
    id
    image {
      path
      filename
    }
  }
}`

export const KARYAWAN_DELETE = gql`
mutation karyawanDelete($delete: [KaryawanDeleteInputType]!) {
  karyawanDelete(delete: $delete) {
    id
  }
}`
