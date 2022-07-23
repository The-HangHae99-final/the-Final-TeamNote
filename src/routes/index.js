const express = require('express');
const router = express.Router();


const userRouter = require('./users');
const memberRouter = require('./members');
const postsRouter = require('./posts');
const messageRouter = require('./messages');
const boardCommentRouter = require('./boardComments');
const postCommentRouter = require('./postComments');
const workSpaceRouter = require('./workSpaces');
const boardRouter = require('./boards');
const kakaoRouter = require('./kakao');
const naverRouter = require('./naver');
const taskRouter = require('./tasks');
const teamTasksRouter = require('./teamTasks');
const manitoRouter = require('./manito');

router.use('/users', userRouter);
router.use('/members', memberRouter);
router.use('/posts', postsRouter);
router.use('/messages', messageRouter);
router.use('/workSpaces', workSpaceRouter);
router.use('/boards', boardRouter);
router.use('/tasks', taskRouter);
router.use('/teamTasks', teamTasksRouter);
router.use('/manito', manitoRouter);
router.use('/', kakaoRouter);
router.use('/', naverRouter);
router.use('/posts', postCommentRouter);
router.use('/boards', boardCommentRouter);

module.exports = router;