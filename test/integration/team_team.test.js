const dotenv = require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const url = 'https://0jun.shop';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjU4NDE0MjMwLCJleHAiOjE2NTg0MTc4MzB9.LsZQD_J7yhZ-CDcWBMrBDJprqQoE15mCZyudDeZu67o';

describe('POST /api/task/team/workSpaceName/all 팀 일정 전체조회', function () {
  it('/api/task/team/workSpaceName/all', function (done) {
    request(app)
      .get('/api/task/team/workSpaceName/all')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });
});

describe('POST /api/task/team/workSpaceName 팀 일정 생성', function () {
  it('/api/task/team/workSpaceName', function (done) {
    request(app)
      .post('/api/task/team/workSpaceName')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({
        workSpaceName: 'test@test.com+124124',
        title: '1234',
        desc: '1234',
        startDate: '1234',
        endDate: '1234',
        color: '1234',
      })
      .expect(200, done);
  });
});

describe('POST /api/task/team/workSpaceName/:taskId 팀 일정 한개 조회', function () {
  it('/api/task/team/workSpaceName/:taskId', function (done) {
    request(app)
      .get('/api/task/team/workSpaceName/:taskId')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });
});

describe('POST /api/task/team/workSpaceName/:taskId 팀 일정 삭제', function () {
  it('/api/task/team/workSpaceName/:taskId', function (done) {
    request(app)
      .delete('/api/task/team/workSpaceName/1')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });
});

describe('POST /api/task/team/workSpaceName/:taskId팀 일정 수정', function () {
  it('/api/task/team/workSpaceName/:taskId', function (done) {
    request(app)
      .put('/api/task/team/workSpaceName/1')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({
        workSpaceName: 'test@test.com+124124',
        title: '1234',
        desc: '1234',
        startDate: '1234',
        endDate: '1234',
        color: '1234',
      })
      .expect(200, done);
  });
});
