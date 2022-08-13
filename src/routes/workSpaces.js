const express = require("express");
const router = express.Router();
const workSpaceController = require("../controller/workSpaces");
const isMember = require("../middlewares/isMember");
//워크스페이스 생성
router.post("/",  workSpaceController.searchWorkSpace ,workSpaceController.createWorkSpace, workSpaceController.addOwner);

//워크스페이스 삭제
router.delete("/", isMember ,workSpaceController.deleteWorkSpace);

// 워크 스페이스 전체 조회
router.get("/", workSpaceController.showWorkSpaces);

module.exports = router;
