const express = require('express');
const router = express.Router();
const taskController = require('../controller/tasks_team');
const isMember = require('../middlewares/isMember');
const authMiddleware = require('../middlewares/auth-middleware');

// 팀 일정 생성
router.post(
  '/task/team/workSpaceName',
  authMiddleware,
  //
  taskController.teamTaskUpload
);

// 팀 전체 일정 조회
router.get(
  '/task/team/workSpaceName',
  authMiddleware,
  taskController.teamTaskAll
);

// 팀 일정 상세 조회
router.get(
  '/task/team/workSpaceName/:taskId',
  authMiddleware,
  taskController.teamTaskDetail
);

// 팀 일정 수정
router.put(
  '/task/team/workSpaceName/:taskId',
  authMiddleware,
  //
  taskController.teamTaskEdit
);

// 팀 일정 삭제
router.delete(
  '/task/team/workSpaceName/:taskId',
  authMiddleware,
  //
  taskController.teamTaskRemove
);

module.exports = router;
