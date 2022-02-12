'use strict';

const test = require('unit.js');
const { delay } = require('unit.js/src/promise');

const endpoint = 'http://localhost:3000/'

console.log("on démarre")


describe('Users', function () {
  let token;
  let userId;

  beforeAll(async function () {
    await test
      .httpAgent(endpoint)
      .post('auth/login')
      .send({ email: 'arthur@mail.fr', password: 'gaga1989' })
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        token = response.body.accessToken
      });
    console.log('token=', token)
  })


  it('should list all users', async function () {
    let res = await test
      .httpAgent(endpoint)
      .get('user')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(response => {
        console.log('Get all users', response.body.users)
      });
  })

  it('should create a user', async function () {
    await test
      .httpAgent(endpoint)
      .put('user')
      .set('Authorization', 'Bearer ' + token)
      .send({
        "email": "toto@mail.fr",
        "password": "test",
        "username": "pseudoTest",
        "firstname": "nomTest",
        "lastname": "prenomTest",
        "address": "adresseTest",
        "verified": false
      })
      .expect(200)
      .then(response => {
        userId = response.body.data.id;
        return userId;
      });
  })

  it('should update a user', async function () {
    let res = await test
      .httpAgent(endpoint)
      .patch('user/' + userId)
      .set('Authorization', 'Bearer ' + token)
      .send({
        "email": "toto@mail.fr",
        "username": "nouveauPseudo",
        "firstname": "nomTest",
        "lastname": "nouveauPrenom",
        "address": "adresseTest"
      })
      .expect(200);
    console.log('statut = ', res.body.message)
  });

  delay(500)

  it('should delete a user', async function () {
    await test
      .httpAgent(endpoint)
      .delete('user/' + userId)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);
  })

})
