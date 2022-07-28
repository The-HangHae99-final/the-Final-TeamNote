const dotenv = require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const url = 'https://0jun.shop';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjU4NDE0MjMwLCJleHAiOjE2NTg0MTc4MzB9.LsZQD_J7yhZ-CDcWBMrBDJprqQoE15mCZyudDeZu67o';

describe('POST /api/teamTasks 팀 일정 생성', function () {
  it('/api/teamTasks  팀 일정 생성', function (done) {
    request(app)
      .post('/api/team-tasks')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({
        workSpaceName: 'test@test.com+124124',
        startDate: '1234',
        endDate: '1234',
        title: '1234',
        desc: '1234',
        color: '1234',
      })
      .expect(200, done);
  });
});

describe('POST /api/team-tasks/1 팀 일정 조회', function () {
  it('/api/teamTasks/1 팀 일정 상세조회', function (done) {
    request(app)
      .get('/api/team-tasks/1')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });

  it('/api/teamTasks/  팀 일정 전체조회', function (done) {
    request(app)
      .get('/api/team-tasks')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });
});

describe('POST /api/team-tasks/1 팀 일정 삭제', function () {
  it('/api/team-tasks/1 팀 일정 삭제', function (done) {
    request(app)
      .delete('/api/team-tasks/1')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });
});

describe('POST /api/team-tasks/1 팀 일정 수정', function () {
  it('/api/boards/:boardId 팀 일정 수정', function (done) {
    request(app)
      .put('/api/boards/1')
      .send({
        workSpaceName: 'test@test.com+124124',
        startDate: '1234',
        endDate: '1234',
        title: '1234',
        desc: '1234',
        color: '1234',
      })
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(200, done);
  });
});
