// const {
//   validatePassword,
// } = require('/Users/hayeon/Desktop/full_final/server/controller/util/password-validation.ts');

// test(`비밀번호를 입력했을때
//         password와 passwordCheck가 일치할 때,
//         true를 반환한다.`, () => {
//   expect(validatePassword('aaAA11!@', 'aaAA11!@')).toEqual(true);
//   expect(validatePassword('aaaaaAAAAA!@#$%^', 'aaaaaAAAAA!@#$%^')).toEqual(
//     true
//   );
// });

// test('비밀번호를 입력했을때 password와 passwordcheck가 일치하지 않으면 false를 반환한다.', () => {
//   expect(validatePassword('aaAA11!@', 'aaAA11!@aaAA11!@')).toEqual(false);
//   expect(validatePassword('aaAA11!@', 'aaAA11!@#')).toEqual(false);
//   expect(validatePassword('aaAA11!@', 'aaaaabbb')).toEqual(false);
// });
