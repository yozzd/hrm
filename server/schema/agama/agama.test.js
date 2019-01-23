const request = require('supertest');
const uri = 'http://0.0.0.0:3000';

let token, id;

describe('agama schema test', () => {
  test('harusnya sukses mendapatkan token', async done => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
        query auth($username: String!, $password: String!) {
          auth(username: $username, password: $password) {
            id
            token
          }
        }`,
        variables: {
          username: 'gableh',
          password: 's3cr3tp4ssw0rd',
        },
      })
      .expect(200);

    const { data } = response.body;
    token = data.auth.token;
    expect(data.auth.token).toBeTruthy();
    done();
  });

  test('harusnya sukses create agama', async done => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
        mutation agamaCreate($label: String!, $value: Int!) {
          agamaCreate(label: $label, value: $value) {
            id
            label
            value
          }
        }`,
        variables: {
          label: 'Islam',
          value: 0,
        },
      })
      .expect(200);

    const { data } = response.body;
    id = data.agamaCreate.id;
    expect(data.agamaCreate.label).toEqual('Islam');
    done();
  });

  test('harusnya gagal create agama', async done => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
        mutation agamaCreate($label: String!, $value: Int!) {
          agamaCreate(label: $label, value: $value) {
            id
            label
            value
          }
        }`,
        variables: {
          label: 'Islam',
          value: 0,
        },
      })
      .expect(200);

    const { errors } = response.body;
    expect(errors[0].message).toEqual(`Agama "Islam" sudah terdaftar`);
    done();
  });

  test('harusnya sukses update agama', async done => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
        mutation agamaUpdate($id: String!, $label: String!) {
          agamaUpdate(id: $id, label: $label) {
            id
            label
            value
          }
        }`,
        variables: {
          id: id,
          label: 'Islam',
        },
      })
      .expect(200);

    const { data } = response.body;
    expect(data.agamaUpdate.label).toEqual('Islam');
    done();
  });

  test('harusnya sukses query agama', async done => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
        query {
          agamaAll {
            id
            label
            value
          }
        }`,
      })
      .expect(200);

    const { data } = response.body;
    expect(data.agamaAll[0].label).toEqual('Islam');
    done();
  });
});
