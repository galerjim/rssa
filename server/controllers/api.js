///////////////////////////////////////////
//
// status.js - Controller for Status API
//
///////////////////////////////////////////

const logger = require('../../logger.js')(module);
const utils = require('../utils.js');
const moviesModel = require('../models/movies.js');
const usersModel = require('../models/users.js');
const eventsModel = require('../models/events.js');

const moviesController = function(req, res, next) {
	if (!(req.query.id && req.query.type)) return utils.sendErr(res, 'Missing parameter(s)');
	
	moviesModel.getMovie(req, req.query.id, req.query.type, function(isPresent, doc) {
		res.json({
			'success': isPresent,
			'result': doc
		});
	}, function(err) {
		utils.sendErr(res, 'Error in getting movies :: ' + err);
	});
	
}

const moviesCountController = function(req, res, next) {
	moviesModel.getMoviesCount(req, function(count) {
		res.json({
			'success': true,
			'result': count
		});
	}, function(err) {
		utils.sendErr(res, 'Error in getting movies count :: ' + err);
	});
}

const stepDataController = function(req, res, next) {
	let step = utils.isNumeric(req.params.step) ? Number(req.params.step) : req.params.step;
	
	usersModel.getUser(req, req.params.id, function(isPresent, doc) {
		if(!isPresent) {
			res.json({
				'success': false,
				'result': null
			});
		} else {
			res.json({
				'success': true,
				'result': doc.step_data[step]
			});
		}
	}, function(err) {
		utils.sendErr(res, 'Error in getting step data :: ' + err);
	});
}

const updateStepController = function(req, res, next) {
	if (!(req.body.step_data)) return utils.sendErr(res, 'Missing parameter(s)');
	
	let step = utils.isNumeric(req.params.step) ? Number(req.params.step) : req.params.step;
	let stepData = JSON.parse(req.body.stepData);
	
	usersModel.setStepData(req, req.params.id, step, stepData, function(isPresent, doc) {
		if(!isPresent) {
			res.json({
				'success': false,
				'result': null
			});
		} else {
			res.json({
				'success': true,
				'result': doc.step_data[step]
			});
		}
	}, function(err) {
		utils.sendErr(res, 'Error in updating step data :: ' + err);
	});
}

const updateEventController = function(req, res, next) {
	if (!(req.body.event && typeof req.body.eventdesc != 'undefined'))
		return utils.sendErr(res, 'Missing parameter(s)');
	
	let event = req.body.event;
	let eventdesc = JSON.parse(req.body.eventdesc);
	eventsModel.addEvent(req, res, event, eventdesc, req.params.id, function() {
		res.json({
			'success': true
		});
	}, function(err) {
		utils.sendErr(res, 'Error logging event :: ' + err);
	});
}

module.exports = {
	moviesController: moviesController,
	moviesCountController: moviesCountController,
	stepDataController: stepDataController,
	updateStepController: updateStepController,
	updateEventController: updateEventController
}