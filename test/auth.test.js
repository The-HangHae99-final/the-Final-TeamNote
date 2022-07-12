// const dotenv = require('dotenv').config();
// const request = require('supertest');
// const app = require('../app');
// const { param } = require('../server/routes/users');

// describe('post /user/email', function () {
//   it('responds with json', function (done) {
//     request(app)
//       .post('/api/users/email')
//       .set('Accept', 'application/json')
//       .expect(200, done);
//   });
// });

// describe('post /use/password', function () {
//   it('responds with json', function (done) {
//     request(app)
//       .post('/api/users/email')
//       .send({ userEmail: 'test@test.com', password: '1234' })
//       .set('Accept', 'application/json')
//       .expect(200, done);
//   });
// });

// describe('post /users/signup', function () {
//   it('responds with json', function (done) {
//     request(app)
//       .post('/api/users/email')
//       .send({
//         userEmail: 'testq@test.com',
//         userName: 'some-user-id11',
//         confirmPassword: '1234',
//         password: '1234',
//       })
//       .set('Accept', 'application/json')
//       .expect(200, done);
//   });
// });

// describe('post /users/delete', function () {
//   it('responds with json', function (done) {
//     request(app)
//       .delete('/api/users/delete/test@test.com')
//       .set('Accept', 'application/json')
//       .expect(200, done);
//   });
// });
