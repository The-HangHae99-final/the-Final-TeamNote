const dotenv = require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjU4NDE0MjMwLCJleHAiOjE2NTg0MTc4MzB9.LsZQD_J7yhZ-CDcWBMrBDJprqQoE15mCZyudDeZu67o';

//===============회원가입======================
describe('POST /api/signup 회원가입', function () {
  // test('조건에 맞다면 회원가입 성공', function (done) {
  //   request(app)
  //     .post('/api/users/signup')
  //     .send({
  //       userEmail: 'email123444444@email.com',
  //       userName: 'user',
  //       password: '123456',
  //       confirmPassword: '123456',
  //     })
  //     .expect(201, done);
  // });

  test('비밀번호 조건이 틀리다면 에러 발생', async () => {
    const passInvalid = await request(app).post('/api/users/signup').send({
      userEmail: 'email12@email.com',
      userName: 'user',
      password: '1234',
      confirmPassword: '1234',
    });
    expect(passInvalid.body.errorMessage).toBe(
      '비밀번호는 6글자 이상으로 입력해주세요.'
    );
  });

  test('닉네임 조건이 틀리다면 에러 발생', async () => {
    const passInvalid = await request(app).post('/api/users/signup').send({
      userEmail: 'email@email.com',
      userName: '여섯글자초과',
      password: '123456',
      confirmPassword: '123456',
    });
    expect(passInvalid.body.errorMessage).toBe(
      '닉네임은 5글자 이내로 입력해주세요.'
    );
  });
});

//===============최종 로그인======================

describe('POST /api/login', function () {
  test('이메일 비밀번호 맞다면 통과', async () => {
    const loginInvalid = await request(app).post('/api/users/login').send({
      userEmail: 'geguri10@aaa.com',
      password: '123123',
    });
    console.log(loginInvalid.body, '--------z');
    expect(loginInvalid.body.message).toBe('로그인에 성공하였습니다.');
  });
  test('이메일이 없다면 에러 발생', async () => {
    const loginInvalid = await request(app)
      .post('/api/users/login')
      .send({ userEmaill: '', password: '123123' });
    console.log(loginInvalid.body, '----0');
    expect(loginInvalid.body.errorMessage).toBe(
      '이메일 또는 비밀번호가 입력되지 않았습니다.'
    );
  });
});
