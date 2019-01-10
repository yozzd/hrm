const request = require('supertest')
const uri = 'http://0.0.0.0:3000'

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
    telepon: '082157777231',
    alamat1: {
      perumahan: 'Mekar Sari',
      blok: 'C',
      no: '40',
      rt: '001',
      rw: '005',
      kelurahan: 'Tiban Lama',
      kecamatan: 'Sekupang',
      kota: 'Batam',
      alamatLengkap: ''
    },
    alamat2: {
      perumahan: 'Mekar Sari',
      blok: 'D',
      no: '40',
      rt: '001',
      rw: '005',
      kelurahan: 'Tiban Lama',
      kecamatan: 'Sekupang',
      kota: 'Batam',
      alamatLengkap: ''
    },
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
            telepon: update.telepon
          }
        }
      })
      .expect(200)

    const { data } = response.body
    expect(data.karyawanUpdate.personal.tempatLahir).toEqual(update.tempatLahir)
    done()
  })

  test('harusnya berhasil update alamat1 karyawan', async (done) => {
    const { update } = field
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
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
        }`,
        variables: {
          id: id,
          alamat: {
            perumahan: update.alamat1.perumahan,
            blok: update.alamat1.blok,
            no: update.alamat1.no,
            rt: update.alamat1.rt,
            rw: update.alamat1.rw,
            kelurahan: update.alamat1.kelurahan,
            kecamatan: update.alamat1.kecamatan,
            kota: update.alamat1.kota,
            alamatLengkap: update.alamat1.alamatLengkap
          }
        }
      })
      .expect(200)

    const { data } = response.body
    expect(data.karyawanAlamatUpdate.alamat.perumahan).toEqual(update.alamat1.perumahan)
    done()
  })

  test('harusnya berhasil update alamat2 karyawan', async (done) => {
    const { update } = field
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
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
        }`,
        variables: {
          id: id,
          alamat: {
            perumahan: update.alamat2.perumahan,
            blok: update.alamat2.blok,
            no: update.alamat2.no,
            rt: update.alamat2.rt,
            rw: update.alamat2.rw,
            kelurahan: update.alamat2.kelurahan,
            kecamatan: update.alamat2.kecamatan,
            kota: update.alamat2.kota,
            alamatLengkap: update.alamat2.alamatLengkap
          }
        }
      })
      .expect(200)

    const { data } = response.body
    expect(data.karyawanAlamatUpdate.alamat.perumahan).toEqual(update.alamat2.perumahan)
    done()
  })

  test('create keluarga karyawan', async (done) => {
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

  test('update keluarga karyawan', async (done) => {
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

  test('delete keluarga karyawan', async (done) => {
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

  test('should delete karyawan with valid authorization', async (done) => {
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
