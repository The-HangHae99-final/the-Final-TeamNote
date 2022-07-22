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
