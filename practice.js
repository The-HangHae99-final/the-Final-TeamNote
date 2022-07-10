const { func } = require('joi');

const email2 = 'dsdfsdf.com';
const email3 = 'abc@';
const email4 = 'chocokakao@naver.com';
function email_validator(email) {
  if (email.includes('@') == false) {
    return false;
  }

  if (email.includes('.') == false) {
    return false;
  }
  return true;
}

console.log(email_validator(email4));
