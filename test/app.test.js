const app = require('../app');
const request = require('supertest');

// 서버 테스트 코드

describe('루트 경로 테스트', () => {
  test('GET method', (done) => {
    request(app)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
