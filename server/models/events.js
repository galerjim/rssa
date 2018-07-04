///////////////////////////////////////////////////
//
// events.js - Model for 'events' collection
//
///////////////////////////////////////////////////

const logger = require('../../logger.js')(module);
const utils = require('../utils.js');
const collectionMap = require('./collectionMap.js');

const addEvent = function(req, event, eventdesc, userid, successCb, failureCb) {
	userid = utils.pad(userid, 12);
	let events = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.EVENTS);
	events.insert({
		timestamp: new Date().getTime() / 1000,
		event: event,
		decr: eventdesc,
		userid: userid
	}, function(err) {
		if (err) {
			failureCb(err);
		} else {
			successCb();
		}
	});
};

module.exports = {
	addEvent: addEvent
};