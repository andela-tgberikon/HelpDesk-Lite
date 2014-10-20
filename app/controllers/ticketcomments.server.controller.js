'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Ticketcomment = mongoose.model('Ticketcomment'),
	_ = require('lodash');

/**
 * Create a Ticketcomment
 */
exports.create = function(req, res) {
	var ticketcomment = new Ticketcomment(req.body);
	ticketcomment.user = req.user;

	ticketcomment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticketcomment);
		}
	});
};

/**
 * Show the current Ticketcomment
 */
exports.read = function(req, res) {
	res.jsonp(req.ticketcomment);
};

/**
 * Update a Ticketcomment
 */
exports.update = function(req, res) {
	var ticketcomment = req.ticketcomment ;

	ticketcomment = _.extend(ticketcomment , req.body);

	ticketcomment.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticketcomment);
		}
	});
};

/**
 * Delete an Ticketcomment
 */
exports.delete = function(req, res) {
	var ticketcomment = req.ticketcomment ;

	ticketcomment.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticketcomment);
		}
	});
};

/**
 * List of Ticketcomments
 */
exports.list = function(req, res) { Ticketcomment.find().sort('-created').populate('user', 'displayName').exec(function(err, ticketcomments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ticketcomments);
		}
	});
};

/**
 * Ticketcomment middleware
 */
exports.ticketcommentByID = function(req, res, next, id) { Ticketcomment.findById(id).populate('user', 'displayName').exec(function(err, ticketcomment) {
		if (err) return next(err);
		if (! ticketcomment) return next(new Error('Failed to load Ticketcomment ' + id));
		req.ticketcomment = ticketcomment ;
		next();
	});
};

/**
 * Ticketcomment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ticketcomment.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};