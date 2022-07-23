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
router.use('/member', memberRouter);
router.use('/post', postsRouter);
router.use('/message', messageRouter);
router.use('/workSpace', workSpaceRouter);
router.use('/board', boardRouter);
router.use('/task', taskRouter);
router.use('/teamTask', teamTasksRouter);
router.use('/manito', manitoRouter);
router.use('/', kakaoRouter);
router.use('/', naverRouter);
router.use('/post', postCommentRouter);
router.use('/board', boardCommentRouter);

module.exports = router;