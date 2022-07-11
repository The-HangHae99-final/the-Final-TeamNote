const request = require('supertest');
const app = require('../app');

// 서버 테스트 코드
describe('루트 경로 테스트', () => {
  test('GET method', () => {
    return request(app)
      .get('/')
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });
});
