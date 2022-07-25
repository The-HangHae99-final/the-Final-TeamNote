const express = require("express");
const router = express.Router();
const taskController = require("../controller/teamTasks");

// 팀 일정 생성
router.post("/", taskController.createTeamTask);

// 팀 전체 일정 조회
router.get("/", taskController.showTeamTasks);

// 팀 일정 상세 조회
router.get("/:taskId", taskController.showTeamTaskDetail);

// 팀 일정 수정
router.put("/:taskId", taskController.editTeamTask);

// 팀 일정 삭제
router.delete("/:taskId", taskController.deleteTeamTask);

module.exports = router;
