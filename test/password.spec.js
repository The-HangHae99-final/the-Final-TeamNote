const { validator } = require('./validation_password');

test('테스트가 성공하는 상황', () => {
  expect(validator('비밀번호가 아니에요')).toEqual(false);
});

test('테스트가 실패하는 상황', () => {
  expect(validator('my-email@domain.com')).toEqual(true);
});
