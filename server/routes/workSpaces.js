const express = require('express');
const router = express.Router();
const workSpaceController = require('../controller/workSpaces');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require('../middlewares/isMember');

//워크스페이스 생성
router.post('/workSpace', authMiddleware, workSpaceController.create);

//워크스페이스 탈퇴하기
router.put(
  '/workSpace/leave',
  authMiddleware,
  //
  workSpaceController.workSpaceLeave
);

//워크스페이스 삭제
router.delete(
  '/workSpace',
  authMiddleware,
  //
  workSpaceController.workSpaceRemove
);

//본인 속한 워크스페이스 목록 조회
router.get(
  '/workSpace/list',
  authMiddleware,
  workSpaceController.getWorkSpaceList
);

// 워크 스페이스 전체 조회
router.get('/workSpace', workSpaceController.everyWorkSpace);

module.exports = router;
