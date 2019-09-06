///////////////////////////////////////////////
//
// collectionMap.js - Map of collection names
//
///////////////////////////////////////////////

const getCollection = function(req, name) {
	return req.db.get(name);
};

module.exports = {
	COLLECTION_CONST: {
		MOVIES: 'movies',
		USERS: 'rssa-users',
		EVENTS: 'rssa-events',
		CONDITIONS: 'rssa-conditions',
		RATINGS: 'rssa-ratings'
	},
	getCollection: getCollection
};