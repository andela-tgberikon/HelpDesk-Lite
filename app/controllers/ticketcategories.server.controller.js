'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Ticket = mongoose.model('Ticket'),
    Ticketcategory = mongoose.model('Ticketcategory'),
    _ = require('lodash');

/**
 * Create a Ticketcategory
 */
exports.create = function(req, res) {
    var ticketcategory = new Ticketcategory(req.body);
    ticketcategory.user = req.user;

    ticketcategory.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ticketcategory);
        }
    });
};

/*Added this*/
exports.createTicket = function(req, res) {
    var ticket = new Ticket(req.body);
    ticket.user = req.user;
    ticket.ticketcategory = req.ticketcategory;
    ticket.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
        	console.log(ticket);
            req.ticketcategory.tickets.push(ticket);
            req.ticketcategory.save(function(err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                }
            });

            res.jsonp(ticket);
        }
    });
};
/**
 * Show the current Ticketcategory
 */
exports.read = function(req, res) {
    res.jsonp(req.ticketcategory);
};

/**
 * Update a Ticketcategory
 */
exports.update = function(req, res) {
    var ticketcategory = req.ticketcategory;

    ticketcategory = _.extend(ticketcategory, req.body);

    ticketcategory.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ticketcategory);
        }
    });
};

/**
 * Delete an Ticketcategory
 */
exports.delete = function(req, res) {
    var ticketcategory = req.ticketcategory;

    ticketcategory.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ticketcategory);
        }
    });
};

/**
 * List of Ticketcategories
 */
exports.list = function(req, res) {
    Ticketcategory.find().sort('-created').populate('user', 'displayName').exec(function(err, ticketcategories) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ticketcategories);
        }
    });
};


/**
*   List Tickets within a category
*/
exports.listTickets = function(req, res) {

    var _ticketcategory = {
        total_number_of_tickets: req.ticketcategory.tickets.length,
        data: req.ticketcategory.tickets
    };
    res.jsonp(_ticketcategory);
};



/**
 * Ticketcategory middleware
 */
exports.ticketcategoryByID = function(req, res, next, id) {
    Ticketcategory.findById(id).populate('user', 'displayName')
    .populate('tickets')
    .exec(function(err, ticketcategory) {
        if (err) return next(err);
        if (!ticketcategory) return next(new Error('Failed to load Ticketcategory ' + id));
        req.ticketcategory = ticketcategory;
        next();
    });
};

/**
 * Ticketcategory authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.ticketcategory.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
