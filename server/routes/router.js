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

router.get('/status', statusController);

router.get('/api/movies', apiController.moviesController);
router.get('/api/movies/count', apiController.moviesCountController);
router.get('/api/:id/data/step/:step', apiController.stepDataController);
router.post('/api/:id/update/step/:step', apiController.updateStepController);
router.post('/api/:id/update/event', apiController.updateEventController);

router.get('/', mainController.newController);
router.get('/:id', mainController.idController);
router.post('/:id/move', mainController.moveController);

module.exports = router;