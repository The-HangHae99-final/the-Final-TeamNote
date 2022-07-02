const express = require('express');
const router = express.Router();

router.post('/naver/information', function (req, res, next) {
  const data = req.body;
  console.log('data:', data);
  res.send(data);
});
