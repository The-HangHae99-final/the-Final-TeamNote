const express = require('express');
const router = express.Router();

// 날짜 API

router.get('/day', (req, res) => {
  //#swagger.tags= ['swagger'];
  //# swagger.summary= '북마크'
  //# swagger.description='북마크추가

  const dayBox = [
    '2022-06-02',
    '2022-06-02',
    '2022-06-02',
    '2022-06-12',
    '2022-06-12',
    '2022-06-12',
    '2022-06-08',
  ];
  res.send(dayBox);
});

module.exports = router;
