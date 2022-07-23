const dotenv = require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjU4NDE0MjMwLCJleHAiOjE2NTg0MTc4MzB9.LsZQD_J7yhZ-CDcWBMrBDJprqQoE15mCZyudDeZu67o';

//===============회원가입======================
describe('POST /api/signup 회원가입', function () {
  test('조건에 맞다면 회원가입 성공', function (done) {
    request(app)
      .post('/api/users/signup')
      .send({
        userEmail: 'email@email.com',
        userName: 'user',
        password: '123456',
        confirmPassword: '123456',
      })
      .expect(201, done);
  });
});
//===============이메일======================
describe('POST /api/email 이메일 먼저 조회', function () {
  test('이메일이 존재한다면 조회 성공', function (done) {
    request(app)
      .post('/api/users/email')
      .send({
        userEmail: 'email@email.com',
      })
      .expect(200, done);
  });
});
//===============로그인======================
describe('POST /api/password 로그인', function () {
  test('이메일, 비밀번호가 맞다면 로그인 성공', function (done) {
    request(app)
      .post('/api/users/password')
      .send({
        userEmail: 'email@email.com',
        password: '123456',
      })
      .expect(200, done);
  });
});
