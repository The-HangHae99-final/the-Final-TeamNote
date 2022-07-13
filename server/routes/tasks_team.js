const express = require('express');
const router = express.Router();
const taskController = require('../controller/tasks_team');
const isMember = require('../middlewares/isMember');

// 팀 일정 생성
router.post(
  '/task/team/:workSpaceName',
  isMember,
  taskController.teamTaskUpload
);

// 팀 전체 일정 조회
router.get(
  '/task/team/:workSpaceName',
  isMember,
  authMiddleware,
  taskController.teamTaskAll
);

// 팀 일정 상세 조회
router.get(
  '/task/team/:taskId/:workSpaceName',
  isMember,
  authMiddleware,
  taskController.teamTaskDetail
);

// 팀 일정 수정
router.put(
  '/task/team/:taskId/:workSpaceName',
  isMember,
  authMiddleware,
  isMember,
  taskController.teamTaskEdit
);

// 팀 일정 삭제
router.delete(
  '/task/team/:taskId/:workSpaceName',
  isMember,
  taskController.teamTaskRemove
);

module.exports = router;
