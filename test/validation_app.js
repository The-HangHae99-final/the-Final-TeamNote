module.exports = {
  isEmail: (value) => {
    // value가 이메일 형식에 맞으면 true, 형식에 맞지 않으면 false를 return 하도록 구현해보세요

    if (value.includes('@')) {
      return true;
    } else {
      return false;
    }
  },
};
