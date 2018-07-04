///////////////////////////////////////////////////
//
// movies.js - Model for 'movies' collection
//
///////////////////////////////////////////////////

const logger = require('../../logger.js')(module);
const utils = require('../utils.js');
const collectionMap = require('./collectionMap.js');

const getMovie = function(req, id, type, successCb, failureCb) {
	let query = {};
	if (utils.isNumeric(id)) id = Number(id);
	query[type] = id;
	let movies = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.MOVIES);
	movies.find(query, {}, function(err, docs) {
		if (err) {
			failureCb(err);
		} else if(docs == null || docs.length == 0) {
			successCb(false);
		} else {
			successCb(true, docs[0]);
		}
	});
}

const getMoviesCount = function(req, successCb, failureCb) {
	let movies = collectionMap.getCollection(req, collectionMap.COLLECTION_CONST.MOVIES);
	movies.count({}, function(err, count) {
		if (err){
			failureCb(err);
		} else {
			successCb(count);
		}
	});
}

module.exports = {
	getMovie: getMovie,
	getMoviesCount: getMoviesCount
};