const express = require('express');
const router = express.Router();
const taskController = require('../controller/tasks');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require('../middlewares/isMember');

// 일정 생성
router.post(
  '/mytask/work',
  authMiddleware,
  isMember,
  taskController.taskUpload
);

// 전체 일정 조회
router.get('/mytask', authMiddleware, taskController.taskAll);

// 일정 상세 조회
router.get(
  '/mytask/:taskId',
  authMiddleware,
  isMember,
  taskController.taskDetail
);

// 일정 수정
router.put('/mytask/:taskId', authMiddleware, taskController.taskEdit);

// 일정 삭제
router.delete('/mytask/:taskId', authMiddleware, taskController.taskRemove);

module.exports = router;
