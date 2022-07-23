const dotenv = require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjU4NDE0MjMwLCJleHAiOjE2NTg0MTc4MzB9.LsZQD_J7yhZ-CDcWBMrBDJprqQoE15mCZyudDeZu67o';

describe('POST /api/signup 회원가입', function () {
  it('/api/users/signup', function (done) {
    request(app)
      .post('/api/users/signup')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({
        userEmail: 'email@email.com',
        userName: 'user',
        password: '123456',
        confirmPassword: '123456',
      })
      .expect(201, done);
  });
});

// expect(res.body).toEqual('Post not found');

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
