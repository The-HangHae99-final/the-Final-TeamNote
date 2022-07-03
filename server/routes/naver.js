const express = require('express');
const router = express.Router();

router.get('/callback', (req, res) => {
  const data = req.body;
  console.log(data);
  res.send(data);
});

module.exports = router;
