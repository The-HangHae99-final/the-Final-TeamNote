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
router.get("/lists/:workSpaceName", memberController.getMemberList);

//멤버 삭제
router.delete(
  "/out",
  isMember,
  workSpaceController.searchWorkSpace,
  memberController.searchMember,
  memberController.deleteMember
);

//워크스페이스 탈퇴하기
router.delete("/leaving", isMember, memberController.leaveWorkSpace);

//본인 속한 워크스페이스 목록 조회
router.get("/spaceLists", memberController.showMyWorkSpaceList);

// 멤버 초대(web)
router.post(
  "/inviting",
  isMember,
  userController.findUser,
  memberController.inviteMember
);

//초대 조회
router.get("/inviting", memberController.showInviting);

//초대 수락
router.post(
  "/inviting/accepting",
  workSpaceController.searchWorkSpace,
  memberController.searchMember,
  memberController.acceptInviting,
  memberController.deleteInviting
);

//초대 삭제
router.delete("/inviting", memberController.deleteInviting);

module.exports = router;

// 멤버 초대
// router.get("/invite", memberController.inviteMember);
