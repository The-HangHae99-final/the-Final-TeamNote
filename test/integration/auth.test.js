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
//===============이메일======================

// expect(res.body).toEqual('Post not found');
describe('POST /api/email', function () {
  test('이메일 조건이 맞다면 통과', async () => {
    const emailInvalid = await request(app).post('/api/users/email').send({
      userEmail: 'email@email.com',
    });
    expect(emailInvalid.body.message).toBe('존재하는 유저입니다.');
  });
  test('이메일이 없다면 에러 발생', async () => {
    const emailInvalid = await request(app).post('/api/users/email').send({
      userEmail: 'email119@email.com',
    });
    expect(emailInvalid.body.errorMessage).toBe('존재하지 않는 유저입니다.');
  });
});

//===============최종 로그인======================

describe('POST /api/password', function () {
  test('이메일 비밀번호 맞다면 통과', async () => {
    const loginInvalid = await request(app).post('/api/users/password').send({
      userEmail: 'email@email.com',
      password: '123456',
    });
    expect(loginInvalid.body.message).toBe('로그인에 성공하였습니다.');
  });
  test('이메일이 없다면 에러 발생', async () => {
    const loginInvalid = await request(app)
      .post('/api/users/password')
      .send({});
    console.log(loginInvalid.body);
    expect(loginInvalid.body.errorMessage).toBe('일치하는 이메일이 없습니다.');
  });
});
