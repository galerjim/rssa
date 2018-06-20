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
		}, function(err, doc) {
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
		return users.insert({
			_id: userid,
			userid: userid,
			step: 0,
			condition: expCondition,
			step_data: []
		}, function(err) {
			if (err) {
				logger.error("Error in createNewUser while users.insert :: " + err);
				return res.end();
			}
			renderPageResponse(req, res, 'step_0.html', userid, {}, {
				page: 'step_0.html',
				step: 0
			});
		});
	});
}

function renderPageResponse(req, res, page, userid, info, eventDesc, setCookie) {
	setCookie = typeof setCookie === 'undefined' ? true : setCookie;
	let data = {
		userid: userid
	};
	for (let key in info) {
		data[key] = info[key];
	}
	res.render(page, {
		data: data
	}, function(err, html) {
		if (setCookie) {
			res = utils.setCookie(req, res, 'userid', userid);
		} else {
			res = utils.deleteCookie(req, res, 'userid');
		}
		res.send(html);
		utils.updateEvent(req, res, 'LOAD_PAGE', eventDesc, userid);
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
				conditions.findAndModify({
					conditionNum: expCondition.conditionNum
				}, {
					$inc: {
						assigned: expCondition.incrementBy
					}
				}, {
					new: true
				}, function(err, doc) {
					if (err) {
						logger.error("Error while incrementing selected condition, error = " + err);
						cb(err, -1);
					}
					cb(err, doc.conditionNum);
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
				if (doc === null) {
					return createNewUser(req, res, users, userid);
				}

				// If user is found,
				renderPageResponse(req, res, 'step_' + doc.step + '.html', userid, doc, {
					page: 'step_' + doc.step + '.html',
					step: doc.step
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