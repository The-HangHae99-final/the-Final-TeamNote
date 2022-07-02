const express = require('express');
const router = express.Router();

router.post('/auth/login/callback/', function (req, res, next) {
  const data = req.body;
  console.log('data:', data);
  res.send(data);
});
