const express = require('express');
const router = express.Router();

router.get('/callback', (req, res) => {
  const data = req.query.code;
  console.log(data);
  res.send(data);
});

module.exports = router;
