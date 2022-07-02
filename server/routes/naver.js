const express = require('express');
const router = express.Router();

router.get('/account/sign-in', function (req, res, next) {
  
 
  const data = req.body;
  console.log('data:', data);
  res.send(data);
});

module.exports = router;
