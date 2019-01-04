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
    perumahan: 'Mekar Sari',
    blok: 'C',
    noP: '40',
    rt: '001',
    rw: '005',
    kelurahan: 'Tiban Lama',
    kecamatan: 'Sekupang',
    kota: 'Batam'
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
    perumahan: 'Mekar Sari',
    blok: 'C',
    noP: '40',
    rt: '001',
    rw: '005',
    kelurahan: 'Tiban Lama',
    kecamatan: 'Sekupang',
    kota: 'Batam',
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

  //  test('should update karyawan address with authorization', async (done) => {
  //    const { update } = field
  //    const response = await request(uri)
  //      .post('/graphql')
  //      .set('Accept', 'application/json')
  //      .set('Authorization', `Bearer ${token}`)
  //      .send({ query: `
  //        mutation {
  //          karyawanUpdate(id: "${id}", perumahan: "${update.perumahan}", blok: "${update.blok}", noP: "${update.noP}", rt: "${update.rt}", rw: "${update.rw}", kelurahan: "${update.kelurahan}", kecamatan: "${update.kecamatan}", kota: "${update.kota}")
  //          {
  //            id
  //            perumahan
  //            blok
  //            noP
  //            rt
  //            rw
  //            kelurahan
  //            kecamatan
  //            kota
  //          }
  //        }`
  //      })
  //      .expect(200)
  //
  //    const { data } = response.body
  //    expect(data.karyawanUpdate.perumahan).toEqual(update.perumahan)
  //    done()
  //  })
  //
  //  test('create keluarga karyawan', async (done) => {
  //    const { update } = field
  //    const response = await request(uri)
  //      .post('/graphql')
  //      .set('Accept', 'application/json')
  //      .set('Authorization', `Bearer ${token}`)
  //      .send({ query: `
  //            mutation {
  //              karyawanKeluargaCreate(id: "${id}", keluarga: {nama: "${update.keluarga[0].nama}", hubunganKeluarga: "${update.keluarga[0].hubunganKeluarga}", jenisKelamin: ${update.keluarga[0].jenisKelamin}, tempatLahir: "${update.keluarga[0].tempatLahir}", tanggalLahir: "${update.keluarga[0].tanggalLahir}", pendidikan: ${update.keluarga[0].pendidikan}, pekerjaan: "${update.keluarga[0].pekerjaan}", alamat: "${update.keluarga[0].alamat}"})
  //              {
  //                id
  //                keluarga {
  //                  id
  //                  nama
  //                  hubunganKeluarga
  //                  jenisKelamin
  //                  tempatLahir
  //                  tanggalLahir
  //                  pendidikan
  //                  pekerjaan
  //                  alamat
  //                }
  //              }
  //            }`
  //      })
  //      .expect(200)
  //
  //    const { data } = response.body
  //    keluargaId = data.karyawanKeluargaCreate.keluarga[0].id
  //    expect(data.karyawanKeluargaCreate.keluarga[0].nama).toEqual(update.keluarga[0].nama)
  //    done()
  //  })
  //
  //  test('update keluarga karyawan', async (done) => {
  //    const { update } = field
  //    const response = await request(uri)
  //      .post('/graphql')
  //      .set('Accept', 'application/json')
  //      .set('Authorization', `Bearer ${token}`)
  //      .send({ query: `
  //            mutation {
  //              karyawanKeluargaUpdate(id: "${id}", keluargaId: "${keluargaId}", keluarga: {nama: "Jenny Doe", hubunganKeluarga: "${update.keluarga[0].hubunganKeluarga}", jenisKelamin: ${update.keluarga[0].jenisKelamin}, tempatLahir: "${update.keluarga[0].tempatLahir}", tanggalLahir: "${update.keluarga[0].tanggalLahir}", pendidikan: ${update.keluarga[0].pendidikan}, pekerjaan: "${update.keluarga[0].pekerjaan}", alamat: "${update.keluarga[0].alamat}"})
  //              {
  //                id
  //                keluarga {
  //                  id
  //                  nama
  //                  hubunganKeluarga
  //                  jenisKelamin
  //                  tempatLahir
  //                  tanggalLahir
  //                  pendidikan
  //                  pekerjaan
  //                  alamat
  //                }
  //              }
  //            }`
  //      })
  //      .expect(200)
  //
  //    const { data } = response.body
  //    expect(data.karyawanKeluargaUpdate.keluarga[0].nama).toEqual('Jenny Doe')
  //    done()
  //  })
  //
  //  test('delete keluarga karyawan', async (done) => {
  //    const response = await request(uri)
  //      .post('/graphql')
  //      .set('Accept', 'application/json')
  //      .set('Authorization', `Bearer ${token}`)
  //      .send({ query: `
  //              mutation {
  //                karyawanKeluargaDelete(id: "${id}", delete: [{id: "${keluargaId}"}]) {
  //                  id
  //                }
  //              }`
  //      })
  //      .expect(200)
  //
  //    const { data } = response.body
  //    expect(data.karyawanKeluargaDelete[0].id).toEqual(keluargaId)
  //    done()
  //  })
  //
  //  test('should delete karyawan with valid authorization', async (done) => {
  //    const response = await request(uri)
  //      .post('/graphql')
  //      .set('Accept', 'application/json')
  //      .set('Authorization', `Bearer ${token}`)
  //      .send({ query: `
    //                mutation {
  //                  karyawanDelete(delete: [{id: "${id}"}]) {
  //                    id
  //                  }
  //                }`
    //      })
  //      .expect(200)
  //
  //    const { data } = response.body
  //    expect(data.karyawanDelete[0].id).toEqual(id)
  //    done()
  //  })
})
