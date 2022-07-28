const dotenv = require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const url = 'https://0jun.shop';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjU4NDE0MjMwLCJleHAiOjE2NTg0MTc4MzB9.LsZQD_J7yhZ-CDcWBMrBDJprqQoE15mCZyudDeZu67o';

describe('POST /api/boards 일반 게시물 전체조회', function () {
  it('/api/boards', function (done) {
    request(app)
      .get('/api/boards')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ workSpaceName: 'test@test.com+124124' })
      .expect(200, done);
  });
});

describe('POST /api/boards 일반 게시물 작성', function () {
  it('/api/boards', function (done) {
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
});
describe('POST /api/boards 일반 게시물 작성', function () {
  it('/api/boards', function (done) {
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
});
describe('POST /api/boards 일반 게시물 한개 조회', function () {
  it('/api/boards/:boardId', function (done) {
    request(app)
      .get('/api/boards/1')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });
});

describe('POST /api/boards 일반 게시물 삭제', function () {
  it('/api/boards/:boardId', function (done) {
    request(app)
      .delete('/api/boards/2')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });
});

describe('POST /api/boards 일반 게시물 수정', function () {
  it('/api/boards/:boardId', function (done) {
    request(app)
      .put('/api/boards/2')
      .send({ title: '1234', content: '1234' })
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });
});

describe('POST /api/boards 일반 게시물 작성', function () {
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
  test('워크스페이스에 소속되지 않고 글을 쓴다면 에러 발생', async () => {
    const passInvalid = await request(app)
      .get('/api/boards')
      .send({
        workSpaceName: 'test@test.com+124124',
      })
      .set('Authorization', `Bearer ${TOKEN}`);
    expect(passInvalid.body.errorMessage).toBe(
      '로그인이 필요합니다. -----------그외-----------'
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
