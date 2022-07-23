const express = require("express");
const router = express.Router();
const taskController = require("../controller/teamTasks");
const isMember = require("../middlewares/isMember");
const authMiddleware = require("../middlewares/authMiddleware");

// 팀 일정 생성
router.post("/", authMiddleware, isMember, taskController.createTeamTask);

// 팀 전체 일정 조회
router.get("/", authMiddleware, isMember, taskController.showTeamTasks);

// 팀 일정 상세 조회
router.get(
  "/:taskId",
  authMiddleware,
  isMember,
  taskController.showTeamTaskDetail
);

// 팀 일정 수정
router.put("/:taskId", authMiddleware, isMember, taskController.editTeamTask);

// 팀 일정 삭제
router.delete(
  "/:taskId",
  authMiddleware,
  isMember,
  taskController.delteteTeamTask
);

module.exports = router;
