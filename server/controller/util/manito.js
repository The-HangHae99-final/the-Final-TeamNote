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

  Email = emailBox[Math.floor(Math.random() * (max - min)) + min];

  const emailFind = await User.findOne({ Email });
  res.send({ manito: emailFind.userName });
});

// random 장치
// min = Math.ceil(min);
// max = Math.floor(max);
// [Math.floor(Math.random() * (max - min)) + min];

module.exports = router;
