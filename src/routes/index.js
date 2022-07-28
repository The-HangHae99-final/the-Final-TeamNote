const authMiddleware = require("../middlewares/authMiddleware");
const isMember = require("../middlewares/isMember");

const express = require("express");
const router = express.Router();

const userRouter = require("./users");
const memberRouter = require("./members");
const postsRouter = require("./posts");
const messageRouter = require("./messages");
const boardCommentRouter = require("./boardComments");
const postCommentRouter = require("./postComments");
const workSpaceRouter = require("./workSpaces");
const boardRouter = require("./boards");
const kakaoRouter = require("./kakao");
const naverRouter = require("./naver");
const taskRouter = require("./tasks");
const teamTasksRouter = require("./teamTasks");
const manitoRouter = require("./manito");

router.use("/users", userRouter);
router.use("/members", authMiddleware, memberRouter);
router.use("/posts", authMiddleware, postsRouter);
router.use("/messages", authMiddleware, isMember, messageRouter);
router.use("/work-spaces", authMiddleware, workSpaceRouter);
router.use("/boards", authMiddleware, boardRouter);
router.use("/tasks", authMiddleware, isMember, taskRouter);
router.use("/team-tasks", authMiddleware, isMember, teamTasksRouter);
router.use("/manito", manitoRouter);
router.use("/", kakaoRouter);
router.use("/", naverRouter);
router.use("/posts", authMiddleware, isMember, postCommentRouter);
router.use("/boards", authMiddleware, isMember, boardCommentRouter);

module.exports = router;
