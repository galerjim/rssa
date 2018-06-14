///////////////////////////////////////////
//
// base.js - Base Router ('/') for Express
//
///////////////////////////////////////////

const logger = require('../../logger.js')(module);
const express = require('express');
const router = express.Router();

/* GET server status interceptor */
router.get('/status', function(req, res) {
	try {
		var result = {
			'success': false,
			'result': {
				'state': {
					'db': 'down',
					'recommendation_server': 'down'
				}
			}
		};
		var sendStatusResponse = function() {
			var responseCode = 500;
			if (req.db.hasOwnProperty('driver') && req.db.driver.hasOwnProperty('_native') && req.db.driver._native.hasOwnProperty('_state') &&
				req.db.driver._native._state === 'connected') {
				result.result.state.db = 'up';
			}
			if (result.result.state.db == 'up' && result.result.state.recommendation_server == 'up') {
				result.success = true;
				responseCode = 200;
			}
			res.status(responseCode).json(result);
			res.end();
		};
		var statusTimer = setTimeout(sendStatusResponse, 20000);
		var request = require('request');
		request(req.recommendationServer, function(error, response, body) {
			try {
				if (response.statusCode == 200) {
					result.result.state.recommendation_server = 'up';
					sendStatusResponse();
					statusTimer = null;
				}
			} catch (e) {
				logger.debug("Error while attempting connection to recommendationServer :: " + e);
			}
		});
	} catch (e) {
		logger.debug("Error in /status :: " + e);
	}
});



module.exports = router;