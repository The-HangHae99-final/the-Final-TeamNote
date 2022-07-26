const express = require("express");
const router = express.Router();
const memberController = require("../controller/members");
const userController = require("../controller/users");
const workSpaceController = require("../controller/workSpaces");
const isMember = require("../middlewares/isMember");

//멤버 추가
router.post(
  "/in",
  isMember,
  userController.findUser,
  memberController.searchMember,
  memberController.addMember
);

//멤버 목록 조회
router.get("/:workSpaceName", isMember, memberController.getMemberList);

//멤버 삭제
router.delete(
  "/out",
  isMember,
  workSpaceController.searchWorkSpace,
  memberController.searchMember,
  memberController.deleteMember
);

//워크스페이스 탈퇴하기
router.delete("/leave",isMember,memberController.leaveWorkSpace);

//본인 속한 워크스페이스 목록 조회
router.get("/lists", memberController.showMyWorkSpaceList);

// 멤버 초대(web)
router.post(
  "/invite",
  isMember,
  userController.findUser,
  memberController.inviteMember
);

//초대 조회
router.get("/invite/:userEmail", memberController.showInviting);

//초대 수락
router.post(
  "/invite/accept",
  workSpaceController.searchWorkSpace,
  memberController.searchMember,
  memberController.acceptInviting,
  memberController.deleteInviting
);

//초대 삭제
router.delete("/invite", memberController.deleteInviting);

module.exports = router;

// 멤버 초대
// router.get("/invite", memberController.inviteMember);
