const express = require('express');
const router = express.Router();
const taskController = require('../controller/tasks');
const isMember = require('../middlewares/isMember');


// 일정 생성
router.post('/',  isMember,taskController.createTask);

// 전체 일정 조회
router.get('/all/lists', taskController.showTasks);

// 일정 상세 조회
router.get('/:taskId', taskController.showTaskDetail);

// 일정 수정
router.put('/:taskId', isMember, taskController.editTask);

// 일정 삭제
router.delete('/:taskId', isMember, taskController.deleteTask);

module.exports = router;
