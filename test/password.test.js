// const passwordValidator = require('password-validator');
// var schema = new passwordValidator();
// schema
//   .is()
//   .min(4) // Minimum length 8
//   .is()
//   .max(12) // Maximum length 100
//   .has()
//   .uppercase() // Must have uppercase letters
//   .has()
//   .lowercase() // Must have lowercase letters
//   .has()
//   .digits(2) // Must have at least 2 digits
//   .has()
//   .not()
//   .spaces() // Should not have spaces
//   .is()
//   .not()
//   .oneOf(['Passw0rd', 'Password123']);

// test('테스트가 성공하는 상황', () => {
//   expect(schema.validate('비밀번호가 아니에요')).toEqual(false);
// });

// test('테스트가 성공하는 상황', () => {
//   expect(schema.validate('my-email@domain.com')).toEqual(false);
// });
