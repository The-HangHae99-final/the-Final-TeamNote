const express = require('express');
const router = express.Router();
const memberController = require('../controller/members');
const authMiddleware = require('../middlewares/authMiddleware');
const isMember = require('../middlewares/isMember');

//멤버 추가
router.put('/in', authMiddleware, isMember, memberController.addMember);

//멤버 목록 조회
router.get('/', authMiddleware, isMember, memberController.getMemberList);

//멤버 삭제
router.put(
  '/out',
  authMiddleware,
  //
  memberController.deleteMember
);

// 멤버 초대

router.get("/invite", memberController.inviteMember);


module.exports = router;
