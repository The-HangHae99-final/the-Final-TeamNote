export function validatePassword(
  password: String,
  passwordConfirm: String
): boolean {
  return password === passwordConfirm; //일치하면 true, 일치하지 않으면 false를 반환한다.
}
