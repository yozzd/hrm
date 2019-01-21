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
        mutation agamaCreate($label: String!) {
          agamaCreate(label: $label) {
            id
            label
            value
          }
        }`,
        variables: {
          label: 'Islam',
        },
      })
      .expect(200);

    const { data } = response.body;
    id = data.agamaCreate.id;
    expect(data.agamaCreate.label).toEqual('Islam');
    done();
  });

  test('harusnya sukses create agama', async done => {
    const response = await request(uri)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
        mutation agamaCreate($label: String!) {
          agamaCreate(label: $label) {
            id
            label
            value
          }
        }`,
        variables: {
          label: 'Kristen',
        },
      })
      .expect(200);

    const { data } = response.body;
    id = data.agamaCreate.id;
    expect(data.agamaCreate.label).toEqual('Kristen');
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
