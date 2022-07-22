const dotenv = require('dotenv').config();
const request = require('supertest');
const app = require('../../app');

describe('post /user/email', function () {
  it('responds with json', function (done) {
    request(app)
      .post('/api/users/email')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});

describe('post api/user/email', function () {
  it('responds with json', function (done) {
    request(app)
      .post('/api/users/email')
      .send({ userEmail: 'test@test.com' })
      .set('Accept', 'application/json')
      .expect(400, done);
  });
});

describe('post /users/email', function () {
  it('responds with json', function (done) {
    request(app)
      .post('/api/users/email')
      .send({
        userEmail: 'testq112@test.com',
        password: '123456',
      })
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});

describe('post /users/delete', function () {
  it('responds with json', function (done) {
    request(app)
      .delete('/api/users/delete/test@test.com')
      .set('Accept', 'application/json')
      .expect(200, done);
  });
});
