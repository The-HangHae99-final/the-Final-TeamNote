const express = require('express');
const router = express.Router();
const memberController = require('../controller/members');
const authMiddleware = require('../middlewares/authMiddleware');
const isMember = require('../middlewares/isMember');

//멤버 추가
router.put('/in', authMiddleware, isMember, memberController.addMember);

//멤버 목록 조회
router.get('/:workSpaceName', authMiddleware, isMember, memberController.getMemberList);

//멤버 삭제
router.put(
  '/out',
  authMiddleware,
  //
  memberController.deleteMember
);

// 멤버 초대(web)
router.post('/invite', authMiddleware, isMember, memberController.inviteMemberWEB);
// 초대 조회
router.get('/invite/:userEmail', authMiddleware, memberController.showInviting);
//초대 수락
router.put('/invite', authMiddleware, memberController.acceptInviting);
//초대 거절
router.delete('/invite', authMiddleware, memberController.refuseInviting);
module.exports = router;


// 멤버 초대
// router.get("/invite", memberController.inviteMember);
