'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Ticketstatus = mongoose.model('Ticketstatus'),
	_ = require('lodash');

/**
 * Create a Ticketstatus
 */
exports.create = function(req, res) {
	var ticketstatus = new Ticketstatus(req.body);
	ticketstatus.user = req.user;

	ticketstatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticketstatus);
		}
	});
};

/**
 * Show the current Ticketstatus
 */
exports.read = function(req, res) {
	res.jsonp(req.ticketstatus);
};

/**
 * Update a Ticketstatus
 */
exports.update = function(req, res) {
	var ticketstatus = req.ticketstatus ;

	ticketstatus = _.extend(ticketstatus , req.body);

	ticketstatus.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticketstatus);
		}
	});
};

/**
 * Delete an Ticketstatus
 */
exports.delete = function(req, res) {
	var ticketstatus = req.ticketstatus ;

	ticketstatus.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticketstatus);
		}
	});
};

/**
 * List of Ticketstatuses
 */
exports.list = function(req, res) { Ticketstatus.find().sort('-created').populate('user', 'displayName').exec(function(err, ticketstatuses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticketstatuses);
		}
	});
};

/**
 * Ticketstatus middleware
 */
exports.ticketstatusByID = function(req, res, next, id) { Ticketstatus.findById(id).populate('user', 'displayName').exec(function(err, ticketstatus) {
		if (err) return next(err);
		if (! ticketstatus) return next(new Error('Failed to load Ticketstatus ' + id));
		req.ticketstatus = ticketstatus ;
		next();
	});
};

/**
 * Ticketstatus authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ticketstatus.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};