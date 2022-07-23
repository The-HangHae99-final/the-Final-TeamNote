const boardController = require('../../server/controller/boards');
const {
  validatePassword,
} = require('../../server/controller/util/password-validation');
const request = require('supertest');
const app = require('../../app');
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjU4NDE0MjMwLCJleHAiOjE2NTg0MTc4MzB9.LsZQD_J7yhZ-CDcWBMrBDJprqQoE15mCZyudDeZu67o';

('use strict');
describe('board Controller 함수 테스트', () => {
  it('should have a board signup function', () => {
    expect(typeof boardController.boardAllView).toBe('function');
  });
  it('should have a user emailFirst function', () => {
    expect(typeof boardController.boardDelete).toBe('function');
  });
  it('should have a user passwordSecond function', () => {
    expect(typeof boardController.boardEdit).toBe('function');
  });
  it('should have a user deleteUser function', () => {
    expect(typeof boardController.boardUpload).toBe('function');
  });
  it('should have a user searchUser function', () => {
    expect(typeof boardController.boardView).toBe('function');
  });
});

describe('POST /api/boards 일반 게시물 작성', function () {
  beforeEach(() => {
    loginUser();
  });
  test('정상적으로 글쓰기에 성공할 때', function (done) {
    request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({
        workSpaceName: 'test@test.com+124124',
        title: '1234',
        content: '1234',
      })
      .expect(200, done);
  });

  test('로그인 하였지만, 누락됐을때', async () => {
    const boardValid = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({
        workSpaceName: 'test@test.com+124124',
      });
    expect(boardValid.body.errorMessage).toBe(400);
  });
  test('로그인 안하고 글 쓰려고 하면 에러발생', async () => {
    const boardVaild = await request(app).post('/api/boards').send({
      title: '123',
      workSpaceName: '123',
      image: '123',
    });
    expect(boardValid.body.errorMessage).toBe(
      '로그인이 필요합니다.----------null------------'
    );
  });
  test('비밀번호 조건이 틀리다면 에러 발생', async () => {
    const passInvalid = await request(app)
      .get('/api/boards')
      .send({
        workSpaceName: 'test@test.com+124124',
      })
      .set('Authorization', `Bearer ` + auth.token);
    expect(passInvalid.body.errorMessage).toBe(
      '비밀번호는 6글자 이상으로 입력해주세요.'
    );
  });

  test('공지 전체조회에서 workSpaceName이 빠졌을 때', function (done) {
    request(app)
      .get('/api/boards')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({})
      .expect(200, done);
  });
});

function loginUser(auth) {
  return function (done) {
    request
      .post('api/users/password')
      .send({
        userEmail: 'test@test.com',
        password: '123123',
      })
      .expect(200)
      .end(onResponse);

    function onResponse(err, res) {
      auth.token = res.body.token;
      return done();
    }
  };
}
