const validator = require('email-validator');

test('테스트가 성공하는 상황', () => {
  expect(validator.validate('이메일이 아니에요')).toEqual(false);
});

test('테스트가 실패하는 상황', () => {
  expect(validator.validate('my-email@domain.com')).toEqual(true);
});
