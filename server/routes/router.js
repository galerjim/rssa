///////////////////////////////////////////
//
// router.js - Router for Express
//
///////////////////////////////////////////

const logger = require('../../logger.js')(module);
const express = require('express');
const router = express.Router();

const statusController = require('../controllers/status.js');
const mainController = require('../controllers/main.js');
const apiController = require('../controllers/api.js');

/* GET server status interceptor */
router.get('/status', statusController);

/* GET server status interceptor */
router.get('/', mainController.newController);
router.get('/:id', mainController.idController);

/* GET server status interceptor */
router.get('/api', apiController);

module.exports = router;