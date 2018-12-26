const request = require('supertest')
const uri = 'http://0.0.0.0:3000'

let token, id

const action = {
  auth: {
    username: 'gableh',
    password: 's3cr3tp4ssw0rd'
  },
  create: {
    no: 'B.5555',
    name: 'John Doe',
    placeOfBirth: 'Batam',
    dateOfBirth: '1992-05-21',
    dateOfJoin: '2018-10-15',
    gender: 'Male',
    religion: 'Islam',
    maritalStatus: 'M1',
    phoneNumber: '082157777231',
  },
  update: {
    no: 'B.5555',
    name: 'John Doe',
    placeOfBirth: 'Medan',
    dateOfBirth: '1992-05-21',
    dateOfJoin: '2018-10-15',
    gender: 'Male',
    religion: 'Islam',
    maritalStatus: 'M1',
    phoneNumber: '082157777231',
  }
}

describe('employee schema test', () => {

  test('should return token if username and password correct', async (done) => {
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

  test('should create employee with authorization', async (done) => {
    const { create } = action
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
        mutation {
          employeeCreate(no: "${create.no}", name: "${create.name}", placeOfBirth: "${create.placeOfBirth}", dateOfBirth: "${create.dateOfBirth}", dateOfJoin: "${create.dateOfJoin}", gender: ${create.gender}, religion: ${create.religion}, maritalStatus: ${create.maritalStatus}, phoneNumber: "${create.phoneNumber}")
          {
            id
            no
            name
            placeOfBirth
            dateOfBirth
            dateOfJoin
            gender
            religion
            maritalStatus
            phoneNumber
          }
        }`
      })
      .expect(200)

    const { data } = response.body
    id = data.employeeCreate.id
    expect(data.employeeCreate.no).toEqual(create.no)
    done()
  })

  test('should fail when saving a duplicate employee', async (done) => {
    const { create } = action
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
         mutation {
          employeeCreate(no: "${create.no}", name: "${create.name}", placeOfBirth: "${create.placeOfBirth}", dateOfBirth: "${create.dateOfBirth}", dateOfJoin: "${create.dateOfJoin}", gender: ${create.gender}, religion: ${create.religion}, maritalStatus: ${create.maritalStatus}, phoneNumber: "${create.phoneNumber}")
          {
            id
            no
            name
            placeOfBirth
            dateOfBirth
            dateOfJoin
            gender
            religion
            maritalStatus
            phoneNumber
          }
         }`
      })
      .expect(200)

    const { errors } = response.body
    expect(errors[0].message).toEqual(`The specified Employee No "${create.no}" is already in use`)
    done()
  })

  test('should update employee with authorization', async (done) => {
    const { update } = action
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
        mutation {
          employeeUpdate(id: "${id}", no: "${update.no}", name: "${update.name}", placeOfBirth: "${update.placeOfBirth}", dateOfBirth: "${update.dateOfBirth}", dateOfJoin: "${update.dateOfJoin}", gender: ${update.gender}, religion: ${update.religion}, maritalStatus: ${update.maritalStatus}, phoneNumber: "${update.phoneNumber}")
          {
            id
            no
            name
            placeOfBirth
            dateOfBirth
            dateOfJoin
            gender
            religion
            maritalStatus
            phoneNumber
          }
        }`
      })
      .expect(200)

    const { data } = response.body
    expect(data.employeeUpdate.placeOfBirth).toEqual(update.placeOfBirth)
    done()
  })

  test('should delete employee with valid authorization', async (done) => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: `
        mutation {
          employeeDelete(input: [{id: "${id}"}]) {
            id
          }
        }`
      })
      .expect(200)

    const { data } = response.body
    expect(data.employeeDelete[0].id).toEqual(id)
    done()
  })
})
