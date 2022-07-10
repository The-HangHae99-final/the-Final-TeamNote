const { func } = require('joi');

const email = 'dsdfsdf.com';

function email_validator(email) {
  if (email.includes('@') == false) {
    return false;
  }

  if (email.includes('.') == false) {
    return false;
  }
}
