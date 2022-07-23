const userController = require('../../server/controller/users');
const {
  validatePassword,
} = require('../../server/controller/util/password-validation');
const request = require('supertest');
const app = require('../../app');

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjU4NDE0MjMwLCJleHAiOjE2NTg0MTc4MzB9.LsZQD_J7yhZ-CDcWBMrBDJprqQoE15mCZyudDeZu67o';

test(`비밀번호를 입력했을때
          password와 passwordConfirm가 일치할 때,
          true를 반환한다.`, () => {
  expect(validatePassword('aaAA11!@', 'aaAA11!@')).toEqual(true);
  expect(validatePassword('aaaaaAAAAA!@#$%^', 'aaaaaAAAAA!@#$%^')).toEqual(
    true
  );
});

test('비밀번호를 입력했을때 password와 passwordcheck가 일치하지 않으면 false를 반환한다.', () => {
  expect(validatePassword('aaAA11!@', 'aaAA11!@aaAA11!@')).toEqual(false);
  expect(validatePassword('aaAA11!@', 'aaAA11!@#')).toEqual(false);
  expect(validatePassword('aaAA11!@', 'aaaaabbb')).toEqual(false);
});

describe('user Controller 함수 테스트', () => {
  it('should have a user signup function', () => {
    expect(typeof userController.signup).toBe('function');
  });
  it('should have a user emailFirst function', () => {
    expect(typeof userController.emailFirst).toBe('function');
  });
  it('should have a user passwordSecond function', () => {
    expect(typeof userController.passwordSecond).toBe('function');
  });
  it('should have a user deleteUser function', () => {
    expect(typeof userController.deleteUser).toBe('function');
  });
  it('should have a user searchUser function', () => {
    expect(typeof userController.searchUser).toBe('function');
  });
  it('should have a user mailing function', () => {
    expect(typeof userController.mailing).toBe('function');
  });
});

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

  test('비밀번호 조건이 틀리다면 에러 발생', async () => {
    const passInvalid = await request(app).post('/api/users/signup').send({
      userEmail: 'email@email.com',
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
    expect(passInvalid.body.message).toBe('존재하는 유저입니다.');
  });
  test('이메일이 없다면 에러 발생', async () => {
    const emailInvalid = await request(app).post('/api/users/email').send({
      userEmail: 'email119@email.com',
    });
    expect(emailnvalid.body.message).toBe('존재하지 않는 유저입니다.');
  });
});

//===============최종 로그인======================

describe('POST /api/password', function () {
  test('이메일 비밀번호 맞다면 통과', async () => {
    const loginInvalid = await request(app).post('/api/users/password').send({
      userEmail: 'email@email.com',
      password: '123456',
    });
    expect(loginInvalid.body.message).toBe('존재하는 유저입니다.');
  });
  test('이메일이나 비밀번호가 없다면 에러 발생', async () => {
    const loginInvalid = await request(app).post('/api/users/password').send({
      userEmail: 'email@email.com',
    });
    expect(loginInvalid.body.errorMessage).toBe(
      'data and hash arguments required'
    );
  });
});
