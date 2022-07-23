const express = require("express");
const router = express.Router();
const workSpaceController = require("../controller/workSpaces");
const authMiddleware = require("../middlewares/authMiddleware");
const isMember = require("../middlewares/isMember");
//워크스페이스 생성
router.post("/", authMiddleware, workSpaceController.createWorkSpace);

//워크스페이스 탈퇴하기
router.put("/leave",authMiddleware,isMember,workSpaceController.leaveWorkSpace);

//워크스페이스 삭제
router.delete("/",authMiddleware,isMember,workSpaceController.deleteWorkSpace);

//본인 속한 워크스페이스 목록 조회

router.get("/lists", authMiddleware, workSpaceController.showMyWorkSpaceList);

// 워크 스페이스 전체 조회
router.get("/", workSpaceController.showWorkSpaces);

//워크스페이스 검색

router.get("/search/:workSpaceName", workSpaceController.searchWorkSpace);

module.exports = router;
