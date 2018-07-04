///////////////////////////////////////////////////
//
// users.js - Model for 'users' collection
//
///////////////////////////////////////////////////

const logger = require('../../logger.js')(module);
const utils = require('../utils.js');
const collectionMap = require('./collectionMap.js');

const getUser = function(req, userid, successCb, failureCb) {
	userid = utils.pad(userid, 12);
	let users = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.USERS);
	users.find({
		userid: userid
	}, {}, function(err, docs) {
		if (err) {
			failureCb(err);
		} else if (docs == null || docs.length == 0) {
			successCb(false);
		} else {
			successCb(true, docs[0]);
		}
	});
}

const addUser = function(req, userid, expCondition, successCb, failureCb) {
	userid = utils.pad(userid, 12);
	let data = {
		userid: userid,
		step: 0,
		condition: expCondition,
		step_data: {}
	};
	let users = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.USERS);
	users.insert(data, function(err) {
		if (err) {
			failureCb(err);
		} else {
			getUser(req, userid, successCb, failureCb);
		}
	});
}

const getMaxUserid = function(req, successCb, failureCb) {
	let users = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.USERS);
	users.find({
		userid: /^\d+$/
	}, {
		sort: {
			userid: -1
		},
		limit: 1
	}, function(err, docs) {
		if (err) {
			failureCb(err);
		} else if (docs == null || docs.length == 0) {
			successCb(false);
		} else {
			successCb(true, parseInt(docs[0].userid));
		}
	});
}

const setStep = function(req, userid, newStep, successCb, failureCb) {
	userid = utils.pad(userid, 12);
	let users = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.USERS);
	users.findOneAndUpdate({
		userid: userid
	}, {
		step: newStep
	}, function(err, doc) {
		if (err) {
			failureCb(err);
		} else if (doc == null) {
			successCb(false);
		} else {
			successCb(true, doc);
		}
	});
}

const setStepData = function(req, userid, step, stepData, successCb, failureCb) {
	let stepkey = 'step_data.' + step;
	userid = utils.pad(userid, 12);
	let users = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.USERS);
	users.findOneAndUpdate({
		userid: userid
	}, {
		$set: { 
			stepkey: stepData
		}
	}, function(err, doc) {
		if (err) {
			failureCb(err);
		} else if (doc == null) {
			successCb(false);
		} else {
			successCb(true, doc);
		}
	});
}

module.exports = {
	addUser: addUser,
	getUser: getUser,
	getMaxUserid: getMaxUserid
};