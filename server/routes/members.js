const express = require('express');
const router = express.Router();
const workSpaceController = require('../controller/workSpaces');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require('../middlewares/isMember');

//멤버 추가
router.put(
    '/memberIn',
    authMiddleware,
    isMember,
    workSpaceController.memberAdd
  );

//멤버 목록 조회
router.get(
    '/member',
    authMiddleware,
    isMember,
    workSpaceController.getMemberList
  );

  //멤버 삭제
router.put(
    '/memberOut',
    authMiddleware,
    isMember,
    workSpaceController.deleteMember
  );


module.exports = router;
