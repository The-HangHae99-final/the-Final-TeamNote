const express = require('express');
const router = express.Router();
const taskController = require('../controller/tasks');
const authMiddleware = require('../middlewares/authMiddleware');
const isMember = require('../middlewares/isMember');

// 일정 생성
router.post(
  '/mytask/work',
  authMiddleware,
  //
  taskController.createTask
);

// 전체 일정 조회
router.get('/mytask', authMiddleware, taskController.showTasks);

// 일정 상세 조회
router.get(
  '/mytask/:taskId',
  authMiddleware,
  //
  taskController.showTaskDetail
);

// 일정 수정
router.put('/mytask/:taskId', authMiddleware, taskController.editTask);

// 일정 삭제
router.delete('/mytask/:taskId', authMiddleware, taskController.deleteTask);

module.exports = router;
