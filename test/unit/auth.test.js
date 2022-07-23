const userController = require('../../server/controller/users');
const {
  validatePassword,
} = require('../../server/controller/util/password-validation');
const request = require('supertest');
const app = require('../../app');

test(`비밀번호를 입력했을때
          password와 passwordConfirm가 일치할 때,
          true를 반환한다.`, () => {
  expect(validatePassword('aaAA11!@', 'aaAA11!@')).toEqual(true);
  expect(validatePassword('aaaaaAAAAA!@#$%^', 'aaaaaAAAAA!@#$%^')).toEqual(
    true
  );
});

test('비밀번호를 입력했을때 password와 passwordcheck가 일치하지 않으면 false를 반환한다.', () => {
  expect(validatePassword('aaAA11!@', 'aaAA11!@aaAA11!@')).toEqual(false);
  expect(validatePassword('aaAA11!@', 'aaAA11!@#')).toEqual(false);
  expect(validatePassword('aaAA11!@', 'aaaaabbb')).toEqual(false);
});

describe('user Controller signup, emailFirst 테스트', () => {
  it('should have a user signup function', () => {
    // userController에 createProduct가 함수인지 파악하는것
    // 예상을 하면서 만드는것
    expect(typeof userController.signup).toBe('function');
  });
  it('should have a user emailFirst function', () => {
    // userController에 createProduct가 함수인지 파악하는것
    // 예상을 하면서 만드는것
    expect(typeof userController.emailFirst).toBe('function');
  });
  it('should have a user passwordSecond function', () => {
    // userController에 createProduct가 함수인지 파악하는것
    // 예상을 하면서 만드는것
    expect(typeof userController.passwordSecond).toBe('function');
  });
  it('should have a user deleteUser function', () => {
    // userController에 createProduct가 함수인지 파악하는것
    // 예상을 하면서 만드는것
    expect(typeof userController.deleteUser).toBe('function');
  });
  it('should have a user searchUser function', () => {
    // userController에 createProduct가 함수인지 파악하는것
    // 예상을 하면서 만드는것
    expect(typeof userController.searchUser).toBe('function');
  });
  it('should have a user mailing function', () => {
    // userController에 createProduct가 함수인지 파악하는것
    // 예상을 하면서 만드는것
    expect(typeof userController.mailing).toBe('function');
  });
});
