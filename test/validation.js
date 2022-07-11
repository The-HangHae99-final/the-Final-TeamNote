const validator = require('email-validator');

module.exports = {
  validator: (email) => {
    // value가 이메일 형식에 맞으면 true, 형식에 맞지 않으면 false를 return 하도록 구현해보세요

    var answer = false;
    if (email.includes('@')) {
      var answer = true;
    }

    if (email.includes('.') == true) {
      var answer = true;
    }

    if (email.includes('..')) {
      var answer = false;
    }
    return answer;
  },
};
