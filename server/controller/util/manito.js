const express = require('express');
const router = express.Router();
const User = require('../../schemas/user');

router.get('/manito', async (req, res) => {
  const emailBox = [];
  const userFind = await User.find({});
  let manito = '';
  console.log(userFind);

  for (let i = 0; i < userFind.length; i++) {
    emailBox.push(userFind[i].userEmail);
  }
  min = Math.ceil(0);
  max = Math.floor(userFind.length);

  manito = emailBox[Math.floor(Math.random() * (max - min)) + min];

  res.send({ manito: manito });
});

// random 장치
// min = Math.ceil(min);
// max = Math.floor(max);
// [Math.floor(Math.random() * (max - min)) + min];

module.exports = router;
