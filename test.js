const express = require('express');
const fs = require('fs');

const app = express();

app.get('/', (req, res, next) => {
  res.send('Docker test 입니다.');
});

app.listen(3001, () => {
  console.log('run');
});
