const express = require("express");
const router = express.Router();
const taskController = require("../controller/tasks");
const authMiddleware = require("../middlewares/auth-middleware");

// 일정 생성
router.post('/task', authMiddleware, taskController.taskUpload);

// 전체 일정 조회
router.get('/task', taskController.taskAll);

// 일정 상세 조회
router.get('/task/:task_id', taskController.taskDetail);

// 일정 수정
router.put('/task/:task_id', authMiddleware, taskController.taskEdit);

// 일정 삭제
router.delete('/task/:task_id', authMiddleware, taskController.taskRemove);

module.exports = router;