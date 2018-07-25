/////////////////////////////////////////////////////
//
// conditions.js - Model for 'conditions' collection
//
/////////////////////////////////////////////////////

const logger = require('../../logger.js')(module);
const utils = require('../utils.js');
const collectionMap = require('./collectionMap.js');

function getExperimentCondition(req, userid, successCb, failureCb) {
	try {
		let conditions = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.CONDITIONS);
		conditions.find({}, {
			sort: {
				assigned: 1
			},

		},
		function(err, docs) {
			if (err) {
				logger.error("Error while obtaining conditions, error = " + err);
				failureCb(err);
				return;
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
					failureCb(err);
				} else {
					successCb(doc.number);
				}
			});
		});
	} catch (e) {
		logger.log(e.stack);
		logger.error("Exception in getExperimentCondition :: " + e);
		failureCb(e);
	}
}

module.exports = {
	getExperimentCondition: getExperimentCondition
};