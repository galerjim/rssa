///////////////////////////////////////////
//
// main.js - Controller for Main App
//
///////////////////////////////////////////

const logger = require('../../logger.js')(module);
const request = require('request');
const utils = require('../utils.js');

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
		if(!COMPATIBILITY_MATRIX.hasOwnProperty(req.useragent.platform)) {
			platform = 'Other';
		}
		if(COMPATIBILITY_MATRIX[platform].indexOf(req.useragent.browser) == -1) {
			res.render('browser.html', {
				data: COMPATIBILITY_MATRIX[platform]
			}, function(err, html) {
				res.send(html);
				utils.updateEvent(req, res, 'LOAD_BROWSER_COMPATIBILITY_PAGE', {
					user_agent: req.useragent, 
					ip: utils.getClientIP(req)
				}, userid);
			});
			return false;
		}
	} catch(e) {
		logger.error("Exception in checkBrowserCompatibility :: Error = " + e + " , useragent = " + JSON.stringify(req.useragent));
	}
	return true;
}

function redirect(res, id) {
	res.redirect('/' + id);
}

function redirectToNewId(req, res) {
	let users = utils.getCollection(req, 'USERS');
	try {
		users.find({
			userid: /^\d+$/
		}, {
			sort: {
				userid: -1
			},
			limit: 1
		}).then(function(doc) {
			let newUserId = START_ID;
			if (doc != null && doc.length > 0) {
				newUserId = parseInt(doc[0].userid) + 1;
			}
			redirect(res, newUserId);
		});
	} catch (e) {
		logger.log(e.stack);
		logger.error("Exception in redirectToNewId :: " + e);
		res.end();
	}
}

function createNewUser(req, res, users, userid) {
	return getExperimentCondition(req, userid, function(err, expCondition) {
		if (err) {
			logger.error("Error in createNewUser while getExperimentCondition :: " + err);
			return res.end();
		}
		let data = {
			userid: userid,
			step: 0,
			condition: expCondition,
			step_data: []
		};
		return users.insert(data, function(err) {
			if (err) {
				logger.error("Error in createNewUser while users.insert :: " + err);
				return res.end();
			}
			renderPageResponse(req, res, 'step_0.html', data, {
				page: 'step_0.html',
				step: 0
			});
		});
	});
}

function renderPageResponse(req, res, page, data, eventDesc, setCookie) {
	setCookie = typeof setCookie === 'undefined' ? true : setCookie;
	res.render(page, {
		data: data
	}, function(err, html) {
		if (setCookie) {
			res = utils.setCookie(req, res, 'userid', data.userid);
		} else {
			res = utils.deleteCookie(req, res, 'userid');
		}
		res.send(html);
		utils.updateEvent(req, res, 'LOAD_PAGE', eventDesc, data.userid);
	});
}

function getExperimentCondition(req, userid, cb) {
	try {
		let conditions = utils.getCollection(req, 'CONDITIONS');
		conditions.find({}, {
				sort: {
					assigned: 1
				},

			},
			function(err, docs) {
				if (err) {
					logger.error("Error while obtaining conditions, error = " + err);
					cb(err, -1);
				}
				let possibleConditions = [];
				for (let i in docs) {
					if (docs[i].assigned == docs[0].assigned) {
						possibleConditions.push(docs[i]);
					} else {
						break;
					}
				}
				let expCondition = possibleConditions[Math.floor(Math.random() * possibleConditions.length)];
				conditions.findOneAndUpdate({
					number: expCondition.number
				}, {
					$inc: {
						assigned: expCondition.increment_by
					}
				}, {
					new: true
				}, function(err, doc) {
					if (err) {
						logger.error("Error while incrementing selected condition, error = " + err);
						cb(err, -1);
					}
					cb(err, doc.number);
				});
			});
	} catch (e) {
		logger.log(e.stack);
		logger.error("Exception in getExperimentCondition :: " + e);
		cb(e, -1);
	}
}

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
	if (!utils.isNumeric(req.params.id)) {
		redirectToNewId(req, res);
	}
	// Get the user id from the request
	let userid = utils.pad(req.params.id, 12);
	
	//Check if Browser if Compatible, else ask the user to download a compatible browser
	if(!checkBrowserCompatibility(req, res, userid)) {
		return;
	}
	try {
		// Check if user id exists
		let users = utils.getCollection(req, 'USERS');
		users.find({userid: userid}, {}, function(err, doc) {
			try {
				// If user not found,
				if (doc == null || doc.length == 0) {
					return createNewUser(req, res, users, userid);
				}

				// If user is found,
				renderPageResponse(req, res, 'step_' + doc[0].step + '.html', doc[0], {
					page: 'step_' + doc[0].step + '.html',
					step: doc[0].step
				});
			} catch (e) {
				logger.log(e.stack);
				logger.error("idController :: Exception in handling doc = " + JSON.stringify(
					doc) + " of id = " + userid);
				res = utils.deleteCookie(req, res, 'userid');
				res.end();
			}
		});

		// Save the user agent from which the user is connecting
		utils.updateEvent(req, res, 'CONNECT_USER', {user_agent: req.useragent, ip: utils.getClientIP(req)}, userid);
	} catch (e) {
		logger.log(e.stack);
		logger.error("idController :: Exception in handling id = " + userid);
		res = utils.deleteCookie(req, res, 'userid');
		res.end();
	}
}

module.exports = {
	newController: newController,
	idController: idController
}