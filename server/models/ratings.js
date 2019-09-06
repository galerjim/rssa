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
	let users = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.RATINGS);
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


const addRating = function(req, userid, ratingData, successCb, failureCb) {

	userid = utils.pad(userid, 12);
	let users = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.RATINGS);
	users.findOneAndUpdate({
		userid: userid
	}, {
		$push: { 
			ratings: {  "$each": ratingData }
		}
	}, function() {
		
	});
}


const recommende = function(req, userid, successCb, failureCb) {

    userid = utils.pad(userid, 12);
    console.log(userid);
    const spawn = require("child_process").spawn;

   
    const out = spawn('python',['./server/models/recommende.py', userid]);
    out.stderr.on('data', function (data) { 
        console.log('standard error output:\n' + data); 
        }); 
    console.log("ratings recommende done");
}




const addUser = function(req, userid, expCondition, successCb, failureCb) {
	userid = utils.pad(userid, 12);
	let data = {
		userid: userid,
        ratings: []
	};
	let users = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.RATINGS);
	users.insert(data, function(err) {
		if (err) {
			failureCb(err);
		} else {
			getUser(req, userid, successCb, failureCb);
		}
	});
}


module.exports = {
	addUser: addUser,
	getUser: getUser,
    addRating: addRating,
    recommende: recommende
};