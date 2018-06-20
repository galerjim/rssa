///////////////////////////////////////////
//
// status.js - Controller for Status API
//
///////////////////////////////////////////

const logger = require('../../logger.js')(module);
const request = require('request');

module.exports = function(req, res) {
	try {
		let result = {
			'success': false,
			'result': {
				'state': {
					'db': 'down',
					'recommendation_server': 'down'
				}
			}
		};
		let sendStatusResponse = function() {
			let responseCode = 500;
			if (req.db && req.db.hasOwnProperty('_state') &&
				req.db._state === 'open') {
				result.result.state.db = 'up';
			}
			if (result.result.state.db == 'up' && result.result.state.recommendation_server == 'up') {
				result.success = true;
				responseCode = 200;
			}
			res.status(responseCode).json(result);
			res.end();
		};
		let statusTimer = setTimeout(sendStatusResponse, 20000);
		request(req.settings.recommendationServer, function(error, response, body) {
			try {
				if (!error && response.statusCode == 200) {
					result.result.state.recommendation_server = 'up';
					sendStatusResponse();
					clearTimeout(statusTimer);
				}
			} catch (e) {
				logger.debug("Error while attempting connection to recommendationServer :: " + e);
			}
		});
	} catch (e) {
		logger.debug("Error in /status :: " + e);
	}
}