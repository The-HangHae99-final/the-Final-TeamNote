const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const messageController = require('../controller/messages');
const isMember = require('../middlewares/isMember');

router.put(
  '/messages/edit/workSpaceName/:_id',
  authMiddleware,
  isMember,
  messageController.messageEdit
);

router.delete(
  '/messages/delete/workSpaceName/:_id',
  authMiddleware,
  isMember,
  messageController.messageDelete
);

router.get(
  '/messages/view/workSpaceName/:_id',
  isMember,
  messageController.messagesView
);

module.exports = router;
