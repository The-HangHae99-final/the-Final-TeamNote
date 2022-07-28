const { boolean } = require('joi');

let ex = {
  password: '$2b$10$KYh3DL/J/DfMIF9KrKVbGegU8MxUU6b/sexKiemS0tMNWcG7X4RzG',
  userName: '1234',
  userEmail: 'testq112@test.com',
  site: '0',
  __v: 0,
};

console.log(ex.length);

// console.log(Boolean(ex.length));

if (ex.length) {
  console.log(true);
} else {
  console.log(false);
}

if (ex) {
  console.log(true);
} else {
  console.log(false);
}
