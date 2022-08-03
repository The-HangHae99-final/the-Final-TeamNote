// const userController = require('../../src/controller/users');
// const {
//   validatePassword,
// } = require('../../src/controller/util/password-validation');
// const request = require('supertest');
// const app = require('../../app');
// const httpMocks = require('node-mocks-http');
// const userData = require('../data/user.json');
// const User = require('../../src/model/user');
// const userEmail = 'test@test.com';
// User.find = jest.fn();
// User.findById = jest.fn();
// User.findByIdAndUpdate = jest.fn();
// User.findByIdAndDelete = jest.fn();
// User.create = jest.fn();
// let req, res, next;

// beforeEach(() => {
//   req = httpMocks.createRequest();
//   res = httpMocks.createResponse();
//   next = jest.fn();
// });

// //===============비밀번호 유효성 검사======================

// describe('should 비밀번호 유효성 검사 ', () => {
//   test(`비밀번호를 입력했을때
//           password와 passwordConfirm가 일치할 때,
//           true를 반환한다.`, () => {
//     expect(validatePassword('aaAA11!@', 'aaAA11!@')).toEqual(true);
//     expect(validatePassword('aaaaaAAAAA!@#$%^', 'aaaaaAAAAA!@#$%^')).toEqual(
//       true
//     );
//   });

//   test('비밀번호를 입력했을때 password와 passwordcheck가 일치하지 않으면 false를 반환한다.', () => {
//     expect(validatePassword('aaAA11!@', 'aaAA11!@aaAA11!@')).toEqual(false);
//     expect(validatePassword('aaAA11!@', 'aaAA11!@#')).toEqual(false);
//     expect(validatePassword('aaAA11!@', 'aaaaabbb')).toEqual(false);
//   });
// });

// //===============회원가입======================
// describe('test 회원가입 API ', () => {
//   beforeEach(() => {
//     req.body = userData;
//   });
//   it('should signup은 함수여야 한다.', () => {
//     expect(typeof userController.signup).toBe('function');
//   });
//   it('should call userModel.create을 호출한다.', async () => {
//     await userController.signup(req, res, next);
//     expect(User.create);
//   });
//   it('should 응답값으로 object 값을 반환한다.', async () => {
//     User.create.mockReturnValue(userData);
//     await userController.signup(req, res, next);
//     expect(typeof res._getData()).toBe('object');
//   });
// });

// //===============로그인======================
// describe('test 로그인 API', () => {
//   it('should have a getProducts function', () => {
//     expect(typeof userController.emailFirst).toBe('function');
//   });

//   it('should emailFirst 는 응답값으로 object 값을 반환한다.', async () => {
//     User.find.mockReturnValue(userData);
//     await userController.emailFirst(req, res, next);
//     expect(typeof res._getData()).toBe('object');
//   });

//   describe('should passwordSecond는 함수여야 한다.', () => {
//     it('should have a getProducts function', () => {
//       expect(typeof userController.passwordSecond).toBe('function');
//     });

//     it('should 응답값으로 object 값을 반환한다.', async () => {
//       User.find.mockReturnValue(userData);
//       await userController.passwordSecond(req, res, next);
//       expect(typeof res._getData()).toBe('object');
//     });
//   });
// });

// //===============회원삭제======================

// describe('test 회원삭제 API', () => {
//   it('should deleteUser타입은 함수여야 한다..', () => {
//     expect(typeof userController.deleteUser).toBe('function');
//   });
//   it('deleteUser의 결과값은 object를 반환해야 한다.', async () => {
//     req.params.userEmail = userEmail;
//     await userController.deleteUser(req, res, next);
//     expect(typeof res._getData()).toBe('object');
//   });
//   it('should deleteUser 성공값은 status 200을 반환해야한다. ', async () => {
//     let deletedProduct = {
//       userEmail: 'test@test.com',
//     };
//     User.findByIdAndDelete.mockReturnValue(deletedProduct);
//     await userController.deleteUser(req, res, next);
//     expect(res.statusCode).toBe(200);
//     expect(res._isEndCalled()).toBeTruthy();
//   });
// });
