///////////////////////////////////////////
//
// main.js - Controller for Main App
//
///////////////////////////////////////////

const logger = require('../../logger.js')(module);
const request = require('request');
const utils = require('../utils.js');
const conditionsModel = require('../models/conditions.js');
const usersModel = require('../models/users.js');
const eventsModel = require('../models/events.js');

const COMPATIBILITY_MATRIX = {
	'Microsoft Windows': ['Chrome', 'Firefox', 'Opera', 'Edge'],
	'Apple Mac': ['Chrome', 'Firefox', 'Opera', 'Safari'],
	'Linux': ['Chrome', 'Firefox'],
	'Other': ['Chrome']
}
const START_ID = 1000;

////////////////////
// Helper Functions
////////////////////

function checkBrowserCompatibility(req, res, userid) {
	try {
		let platform = req.useragent.platform;
		if (!COMPATIBILITY_MATRIX.hasOwnProperty(req.useragent.platform)) {
			platform = 'Other';
		}
		if (COMPATIBILITY_MATRIX[platform].indexOf(req.useragent.browser) == -1) {
			res.render('browser.html', {
				data: COMPATIBILITY_MATRIX[platform]
			}, function(err, html) {
				res.send(html);
				updateEvent(req, res, 'LOAD_BROWSER_COMPATIBILITY_PAGE', {
					user_agent: req.useragent,
					ip: utils.getClientIP(req)
				}, userid);
			});
			return false;
		}
	} catch (e) {
		logger.error("Exception in checkBrowserCompatibility :: Error = " + e + " , useragent = " + JSON.stringify(req.useragent));
	}
	return true;
}

function redirect(res, id) {
	res.redirect('/' + id);
}

function redirectToNewId(req, res) {
	usersModel.getMaxUserid(req, function(found, maxUserid) {
		let newUserId = START_ID;
		if (found) {
			newUserId = maxUserid + 1;
		}
		redirect(res, newUserId);
	}, function(err) {
		logger.error("Error in redirectToNewId while usersModel.getMaxUserid :: " + err);
	});
}

function createNewUser(req, res, userid) {
	return conditionsModel.getExperimentCondition(req, userid, function(expCondition) {
		return usersModel.addUser(req, userid, expCondition, function(isPresent, doc) {
			if(!isPresent) {
				logger.error("Error in createNewUser while usersModel.addUser :: Inserted User could not be retrieved.");
			} else {
				handleExistingUser(req, res, doc);
			}
		}, function (err) {
			logger.error("Error in createNewUser while usersModel.addUser :: " + err);
		});
	}, function(err) {
		logger.error("Error in createNewUser while conditionsModel.getExperimentCondition :: " + err);
	});
}

function handleExistingUser(req, res, doc) {
	renderPageResponse(req, res, 'step_' + doc.step + '.html', doc, {
		page: 'step_' + doc.step + '.html',
		step: doc.step
	}, true);
}

function renderPageResponse(req, res, page, data, eventDesc, setCookie) {
	res.render(page, {
		data: data
	}, function(err, html) {
		if (err) {
			logger.error("Error in renderPageResponse :: " + err);
			return res.end();
		}
		
		if (setCookie) {
			res = utils.setCookie(req, res, 'userid', data.userid);
		} else {
			res = utils.deleteCookie(req, res, 'userid');
		}
		
		res.send(html);
		updateEvent(req, res, 'LOAD_PAGE', eventDesc, data.userid);
	});
}

const updateEvent = function(req, res, event, eventdesc, userid) {
	eventsModel.addEvent(req, event, eventdesc, userid, function() {
		logger.debug('Event logged successfully');
	}, function(err) {
		logger.error('Error in updateEvent while eventsModel.addEvent :: ' + err);
	});
};

///////////////////////
// Controler Functions
///////////////////////

const newController = function(req, res, next) {
	let cookieValue = utils.getCookie(req, 'userid');
	if (cookieValue == null) {
		// No userid found in cookie, first time user
		redirectToNewId(req, res);
	} else {
		// userid found, redirect user to existing userid
		redirect(res, parseInt(cookieValue));
	}
};

const idController = function(req, res, next) {
	let userid = req.params.id;

	//Redirect non numeric ids to a new id
	if (!utils.isNumeric(userid)) {
		redirectToNewId(req, res);
	}

	//Check if Browser if Compatible, else ask the user to download a compatible browser
	if (!checkBrowserCompatibility(req, res, userid)) {
		return;
	}
	
	
	// Check if user id exists
	usersModel.getUser(req, userid, function(isPresent, doc) {
		if(!isPresent) {
			// If user not found
			createNewUser(req, res, userid);
		} else {
			// If user is found
			handleExistingUser(req, res, doc);
		}
	}, function(err) {
		logger.error("Error in createNewUser while usersModel.getUser :: " + err);
	});

	// Save the user agent from which the user is connecting
	updateEvent(req, res, 'CONNECT_USER', {
		user_agent: req.useragent,
		ip: utils.getClientIP(req)
	}, userid);
}

const moveController = function(req, res, next) {
	if (!(req.body.newStep)) logger.error("Missing parameter in moveController :: newStep");
	
	let userid = req.params.id;
	
	//Redirect non numeric ids to a new id
	if (!utils.isNumeric(userid)) {
		redirectToNewId(req, res);
	}
	
	usersModel.setStep(req, userid, req.body.newStep, function(isPresent, doc) {
		if(!isPresent) {
			redirectToNewId(req, res);
		} else {
			updateEvent(req, res, 'MOVE_USER', {
				newStep: req.body.newStep
			}, userid);
			redirect(res, userid);
		}
	}, function(err) {
		logger.error("Error in moveController while usersModel.setStep :: " + err);
	});
}

module.exports = {
	newController: newController,
	idController: idController,
	moveController: moveController
}