const app = require('../app');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const User = require('../server/schemas/user');
const WorkOutTime = require('../server/models/workOutTime');
const Room = require('../server/models/room');
const moment = require('moment');
let token;
let userId;

describe('유저 정보 테스트', async () => {
  afterEach(async () => {
    await User.deleteOne({ userEmail: '123' });
    token = null;
  });

  it('userEmail와 userName을 입력하고, DB에 userEmail에 해당하는 회원이 없으면 회원가입한다.', async () => {
    await User.deleteOne({ userEmail: '123' });
    const response = await request(app).post('api/users/signup').send({
      userEmail: '123',
      userName: 'abc',
    });
    const existUser = await User.findOne({ userEmail: 123 });
    expect(existUser).to.exist;
    expect(response.status).equal(200);
  });

  //   it('userEmail와 userName을 입력하고, DB에 userEmail에 해당하는 회원이 있으면 로그인한다.', async () => {
  //     await User.create({ userEmail: '123', userName: 'abc' });
  //     const response = await request(app).post('/users/auth').send({
  //       userEmail: '123',
  //       userName: 'abc',
  //     });
  //     expect(response.status).equal(200);
  //   });

  //   it('userName과 weeklyGoal을 입력하면 회원 정보가 수정된다.', async () => {
  //     token = (
  //       await request(app).post('/users/auth').send({
  //         userEmail: '123',
  //         userName: 'abc',
  //       })
  //     ).body.token;

  //     const response = await request(app)
  //       .patch('/users')
  //       .set('Authorization', 'Bearer ' + token)
  //       .send({
  //         userName: 'modified',
  //         weeklyGoal: 5,
  //       });
  //     expect(response.status).equal(200);
  //     const existUser = await User.findOne({ userEmail: '123' });
  //     expect(existUser.userName).equal('modified');
  //     expect(existUser.weeklyGoal).equal(5);
  //   });
});
