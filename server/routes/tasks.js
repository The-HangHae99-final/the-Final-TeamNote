const express = require('express');
const router = express.Router();
const taskController = require('../controller/tasks');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require('../middlewares/isMember');

// 일정 생성
router.post('/task/work', authMiddleware, isMember, taskController.taskUpload);

// 전체 일정 조회
router.get(
  '/task/workSpaceName',
  authMiddleware,
  isMember,
  taskController.taskAll
);

// 일정 상세 조회
router.get(
  '/task/workSpaceName/:taskId',
  authMiddleware,
  isMember,
  taskController.taskDetail
);

// 일정 수정
router.put(
  '/task/workSpaceName/:taskId',
  authMiddleware,
  taskController.taskEdit
);

// 일정 삭제
router.delete(
  '/task/workSpaceName/:taskId',
  authMiddleware,
  taskController.taskRemove
);

module.exports = router;
