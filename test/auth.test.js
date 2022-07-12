const assert = require('assert');
const request = require('supertest');
const Users = require('../server/schemas/user');
const app = require('../app');

describe('test login request', () => {
  it('should success login', async () => {
    const user = {
      userEmail: 'test@test.com',
      // userName: 'auddn6676',
      password: '1234',
      // confirmPassword: '12345',
    };
    const res = await request(app).post('/users/password').send(user);
    expect(res.statusCode).toEqual(200);
  });
  it('should not success login', async () => {
    const user = {
      userName: 'auddn6676',
      password: '12345',
    };
    const res = await request(app).post('/users/password').send(user);
    expect(res.statusCode).toEqual(404);
  });
  it("don't have id & pw property", async () => {
    const user = {};
    const res = await request(app).post('/users/login').send(user);
    expect(res.statusCode).toEqual(404);
  });
  it('param is undefined', async () => {
    const user = undefined;
    const res = await request(app).post('/users/login').send(user);
    expect(res.statusCode).toEqual(404);
  });
  it('param is null', async () => {
    const user = null;
    const res = await request(app).post('/users/login').send(user);
    expect(res.statusCode).toEqual(404);
  });
});
