const express = require('express');
const router = express.Router();
const manitoController = require('../controller/manito');

router.get('/', manitoController.manito_);

module.exports = router;
