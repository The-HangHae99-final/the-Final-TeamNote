const express = require('express');
const router = express.Router();
const workSpaceController = require('../controller/workSpaces');
const authMiddleware = require('../middlewares/auth-middleware');
const isMember = require('../middlewares/isMember');

//워크스페이스 생성
router.post('/workSpace', authMiddleware, workSpaceController.createSpace);

//워크스페이스 탈퇴하기
router.put('/workSpace/leave',authMiddleware,isMember,workSpaceController.workSpaceLeave);

//워크스페이스 삭제
router.delete('/workSpace',authMiddleware,isMember,workSpaceController.deleteWorkSpace);

//본인 속한 워크스페이스 목록 조회
router.get('/workSpace/list',authMiddleware,workSpaceController.getWorkSpaceList);

// 워크 스페이스 전체 조회
router.get('/workSpace', workSpaceController.everyWorkSpace);

//워크스페이스 검색
router.get('/workSpaceOne', workSpaceController.getWorkSpaceByName);

module.exports = router;
