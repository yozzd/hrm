const request = require('supertest')
const uri = 'http://0.0.0.0:3000'
const config = require('../../config/environment')

let token, id, keluargaId

const field = {
  auth: {
    username: 'gableh',
    password: 's3cr3tp4ssw0rd'
  },
  create: {
    no: 'B.5555',
    nama: 'John Doe',
    tempatLahir: 'Batam',
    tanggalLahir: '1992-05-21',
    tanggalBergabung: '2018-10-15',
    jenisKelamin: 'L',
    agama: 'Islam',
    statusPernikahan: 'M1',
    alamat: '',
    telepon: '082157777231',
  },
  update: {
    no: 'B.5555',
    nama: 'John Doe',
    tempatLahir: 'Medan',
    tanggalLahir: '1992-05-21',
    tanggalBergabung: '2018-10-15',
    jenisKelamin: 'L',
    agama: 'Islam',
    statusPernikahan: 'M1',
    alamat: 'Perumahan Mekar Sari Blok D No. 40 RT 001 RW 005 Kelurahan Tiban Lama Kecamatan Sekupang Batam',
    telepon: '082157777231',
    keluarga: [{
      nama: 'Jane Doe',
      hubunganKeluarga: 'Istri',
      jenisKelamin: 'P',
      tempatLahir: 'Batam',
      tanggalLahir: '1994-01-22',
      pendidikan: 'S1',
      pekerjaan: 'Karyawan Swasta',
      alamat: 'Tes'
    }]
  }
}

describe('karyawan schema test', () => {

  test('harusnya berhasil mendapatkan token', async (done) => {
    const { auth } = field
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query: `
        query auth($username: String!, $password: String!) {
          auth(username: $username, password: $password) {
            id
            token
          }
        }`,
        variables: {
          username: auth.username,
          password: auth.password
        }
      })
      .expect(200)

    const { data } = response.body
    token = data.auth.token
    expect(data.auth.token).toBeTruthy()
    done()
  })

  test('harusnya berhasil create karyawan', async (done) => {
    const { create } = field
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
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
              alamat
              telepon
            }
          }
        }`,
        variables: {
          no: create.no,
          nama: create.nama,
          personal: {
            tempatLahir: create.tempatLahir,
            tanggalLahir: create.tanggalLahir,
            tanggalBergabung: create.tanggalBergabung,
            jenisKelamin: create.jenisKelamin,
            agama: create.agama,
            statusPernikahan: create.statusPernikahan,
            alamat: create.alamat,
            telepon: create.telepon
          }
        }
      })
      .expect(200)

    const { data } = response.body
    id = data.karyawanCreate.id
    expect(data.karyawanCreate.no).toEqual(create.no)
    done()
  })

  test('harusnya gagal save ketika create karyawan dengan no yang sama', async (done) => {
    const { create } = field
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
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
              alamat
              telepon
            }
          }
        }`,
        variables: {
          no: create.no,
          nama: create.nama,
          personal: {
            tempatLahir: create.tempatLahir,
            tanggalLahir: create.tanggalLahir,
            tanggalBergabung: create.tanggalBergabung,
            jenisKelamin: create.jenisKelamin,
            agama: create.agama,
            statusPernikahan: create.statusPernikahan,
            alamat: create.alamat,
            telepon: create.telepon
          }
        }
      })
      .expect(200)

    const { errors } = response.body
    expect(errors[0].message).toEqual(`No Karyawan "${create.no}" sudah terpakai`)
    done()
  })

  test('harusnya berhasil update karyawan', async (done) => {
    const { update } = field
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
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
              alamat
              telepon
            }
          }
        }`,
        variables: {
          id: id,
          no: update.no,
          nama: update.nama,
          personal: {
            tempatLahir: update.tempatLahir,
            tanggalLahir: update.tanggalLahir,
            tanggalBergabung: update.tanggalBergabung,
            jenisKelamin: update.jenisKelamin,
            agama: update.agama,
            statusPernikahan: update.statusPernikahan,
            alamat: update.alamat,
            telepon: update.telepon
          }
        }
      })
      .expect(200)

    const { data } = response.body
    expect(data.karyawanUpdate.personal.tempatLahir).toEqual(update.tempatLahir)
    done()
  })

  test('harusnya berhasil create keluarga karyawan', async (done) => {
    const { update } = field
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
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
        }`,
        variables: {
          id: id,
          keluarga: {
            nama: update.keluarga[0].nama,
            hubunganKeluarga: update.keluarga[0].hubunganKeluarga,
            jenisKelamin: update.keluarga[0].jenisKelamin,
            tempatLahir: update.keluarga[0].tempatLahir,
            tanggalLahir: update.keluarga[0].tanggalLahir,
            pendidikan: update.keluarga[0].pendidikan,
            pekerjaan: update.keluarga[0].pekerjaan,
            alamat: update.keluarga[0].alamat
          }
        }
      })
      .expect(200)

    const { data } = response.body
    keluargaId = data.karyawanKeluargaCreate.keluarga[0].id
    expect(data.karyawanKeluargaCreate.keluarga[0].nama).toEqual(update.keluarga[0].nama)
    done()
  })

  test('harusnya berhasil update keluarga karyawan', async (done) => {
    const { update } = field
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
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
        }`,
        variables: {
          id: id,
          keluarga: {
            id: keluargaId,
            nama: 'Jenny Doe',
            hubunganKeluarga: update.keluarga[0].hubunganKeluarga,
            jenisKelamin: update.keluarga[0].jenisKelamin,
            tempatLahir: update.keluarga[0].tempatLahir,
            tanggalLahir: update.keluarga[0].tanggalLahir,
            pendidikan: update.keluarga[0].pendidikan,
            pekerjaan: update.keluarga[0].pekerjaan,
            alamat: update.keluarga[0].alamat
          }
        }
      })
      .expect(200)

    const { data } = response.body
    expect(data.karyawanKeluargaUpdate.keluarga[0].nama).toEqual('Jenny Doe')
    done()
  })

  test('harusnya berhasil delete keluarga karyawan', async (done) => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
        mutation karyawanKeluargaDelete($id: String!, $delete: [KaryawanDeleteInputType]!) {
          karyawanKeluargaDelete(id: $id, delete: $delete) {
            id
          }
        }`,
        variables: {
          id: id,
          delete: [{ id: keluargaId }]
        }
      })
      .expect(200)

    const { data } = response.body
    expect(data.karyawanKeluargaDelete[0].id).toEqual(keluargaId)
    done()
  })

  test('harusnya berhasil delete karyawan', async (done) => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
        mutation karyawanDelete($delete: [KaryawanDeleteInputType]!) {
          karyawanDelete(delete: $delete) {
            id
          }
        }`,
        variables: {
          delete: [{id: id}]
        }
      })
      .expect(200)

    const { data } = response.body
    expect(data.karyawanDelete[0].id).toEqual(id)
    done()
  })
})
