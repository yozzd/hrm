const request = require('supertest')
const uri = 'http://0.0.0.0:3000'

let token

const action = {
  auth: {
    username: 'gableh',
    password: 's3cr3tp4ssw0rd'
  },
  create: {
    username: 'bleh',
    password: 'mysecretpassword',
    role: 'user'
  },
  update: {
    username: 'blah',
    password: 'supersecretpassword',
    role: 'user'
  }
}

describe('user schema test', () => {

  test('harusnya sukses mendapatkan token', async (done) => {
    const { auth } = action
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query: `
        query {
          auth(username: "${auth.username}", password: "${auth.password}")
          {
            id
            token
          }
        }`
      })
      .expect(200)

    const { data } = response.body
    token = data.auth.token
    expect(data.auth.token).toBeTruthy()
    done()
  })

  test('harusnya sukes create user', async (done) => {
    const { create } = action
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query: `
        mutation {
          userCreate(username: "${create.username}", password: "${create.password}", role: "${create.role}")
          {
            id
            username
            role
          }
        }`
      })
      .expect(200)

    const { data } = response.body
    user = data.userCreate
    expect(data.userCreate.username).toEqual(create.username)
    done()
  })

  test('harusnya gagal create user dengan username yg sama', async (done) => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query: `
        mutation {
          userCreate(username: "${user.username}", password: "${user.password}", role: "${user.role}")
          {
            id
            username
            role
          }
        }`
      })
      .expect(200)

    const { errors } = response.body
    expect(errors[0].message).toEqual(`Username "${user.username}" sudah terpakai`)
    done()
  })

  test('harusnya sukes update user', async (done) => {
    const { update } = action
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
        mutation {
          userUpdate(id: "${user.id}", username: "${update.username}", role: "${update.role}")
          {
            id
            username
            role
          }
        }`
      })
      .expect(200)

    const { data } = response.body
    expect(data.userUpdate.username).toEqual(update.username)
    done()
  })

  test('harusnya gagal update user tanpa autentikasi', async (done) => {
    const { update } = action
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({ query: `
        mutation {
          userUpdate(id: "${user.id}", username: "${update.username}", role: "${update.role}")
          {
            id
            username
            role
          }
        }`
      })
      .expect(200)

    const { errors } = response.body
    expect(errors[0].message).toEqual('Access Denied / Forbidden')
    done()
  })

  test('harusnya gagal ubah password user', async (done) => {
    const { update } = action
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
        mutation userChangePassword($id: String!, $oldPassword: String!, $newPassword: String!) {
          userChangePassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword) {
            id
            username
            role
          }
        }`,
        variables: {
          id: user.id,
          oldPassword: 'mywrongoldpassword',
          newPassword: 'supersecretpassword'
        }
      })
      .expect(200)

    const { errors } = response.body
    expect(errors[0].message).toEqual('Password anda tidak sama')
    done()
  })

  test('harusnya sukes ubah password user', async (done) => {
    const { update } = action
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
        mutation userChangePassword($id: String!, $oldPassword: String!, $newPassword: String!) {
          userChangePassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword) {
            id
            username
            role
          }
        }`,
        variables: {
          id: user.id,
          oldPassword: 'mysecretpassword',
          newPassword: 'supersecretpassword'
        }
      })
      .expect(200)

    const { data } = response.body
    expect(data.userChangePassword.username).toEqual(update.username)
    done()
  })

  test('harusnya sukses delete user', async (done) => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
        mutation {
          userDelete(delete: [{id: "${user.id}"}]) {
            id
          }
        }`
      })
      .expect(200)

    const { data } = response.body
    expect(data.userDelete[0].id).toEqual(user.id)
    done()
  })

})
