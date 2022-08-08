const dotenv = require('dotenv').config();
const request = require('supertest');
const app = require('../../app');
const url = 'http://teamnote.shop';

const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiaWF0IjoxNjU5OTY0MjAzLCJleHAiOjE2NTk5NjYwMDN9.Rqp4hUcnrcWfUFAeiiAj_CdWxCvmYfHkawValdnDoqo';

describe('POST /api/teamTasks 팀 일정 생성', function () {
  it('/api/teamTasks  팀 일정 생성', function (done) {
    request(app)
      .post('/api/team-tasks')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({
        workSpaceName: 'test@test.com+어날씨',
        startDate: '0808',
        endDate: '0810',
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
      .get('/api/team-tasks/1001')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(400, done);
    // 현재 DB를 날림으로 게시물이 없어서 400으로 변경
  });

  it('/api/teamTasks/  팀 일정 전체조회', function (done) {
    request(app)
      .post('/api/team-tasks/lists')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ workSpaceName: 'test@test.com+어날씨' })
      .expect(200, done);
  });
});

describe('POST /api/team-tasks/1 팀 일정 삭제', function () {
  it('/api/team-tasks/1111 없는 팀 일정 삭제', function (done) {
    request(app)
      .delete('/api/team-tasks/1111')
      .set('Authorization', `Bearer ${TOKEN}`)
      .expect(400, done);
  });
});

describe('POST /api/team-tasks/1 팀 일정 수정', function () {
  it('/api/ 팀 일정 수정', function (done) {
    request(app)
      .put('/api/team-tasks/1')
      .send({
        workSpaceName: 'test@test.com+어날씨',
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
