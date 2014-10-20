'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors'),
    Ticket = mongoose.model('Ticket'),
    Ticketcomment = mongoose.model('Ticketcomment'),
    Ticketstatus = mongoose.model('Ticketstatus'),
    Ticketcategory = mongoose.model('Ticketcategory'),
    _ = require('lodash');

/**
 * Create a Ticket
 */
exports.create = function(req, res) {
    var ticket = new Ticket(req.body);
    ticket.user = req.user;
    ticket.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ticket);
        }
    });
};

/********************************************************/
/*                     Custom Functions                 */
/********************************************************/

// exports.byUserId = function (req, res){
//     console.log(req);
// },

exports.getByUserId = function(req, res) {
    Ticket.where('user').equals(req.profile._id).exec(function(err, tickets) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var response = [{
                total_number_of_tickets: tickets.length,
                data: tickets
            }];
            res.jsonp(response);
        }

    });
};


exports.addComment = function(req, res) {
    var comment = new Ticketcomment(req.body);
    comment.user = req.user;
    comment.ticket = req.ticket;
    req.ticket.ticketcomment.push(comment);
    console.log(comment.content);
    comment.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
    });
    req.ticket.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            comment.populate('user', function(err, comment) {
                res.jsonp(comment);
            });
        }
    });
};

exports.getByCategory = function(req, res) {
    Ticketcategory.find().sort('-category')
        .populate('user', 'displayName')
        .exec(function(err, category) {
            if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            var response = {
                total_number_of_tickets: category.length,
                data: category
            };
            res.jsonp(response);
        }
        });
};


exports.viewComments = function(req, res) {
    Ticketcomment.find({
            ticket: req.ticket._id
        }).sort('created')
        .populate('user', 'displayName')
        .exec(function(err, ticketcomment) {
            if (!err) {
                res.jsonp(ticketcomment);
            }
        });
};
/*************************************************************?


/**
 * Show the current Ticket
 */
exports.read = function(req, res) {
    var response = {
        number_of_comments: req.ticket.ticketcomment.length,
        data: req.ticket
    };
    res.jsonp(response);
};


/**
 * Update a Ticket
 */
exports.update = function(req, res) {
    var ticket = req.ticket;

    ticket = _.extend(ticket, req.body);

    ticket.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ticket);
        }
    });
};

/**
 * Delete a Ticket
 */
exports.delete = function(req, res) {
    var ticket = req.ticket;
    ticket.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(ticket);
        }
    });
};

/**
 * List of Tickets
 */
exports.list = function(req, res) {
    Ticket.find().sort('-created')
        .populate('user', 'displayName')
        .populate('ticketcategory', 'name')
        .exec(function(err, tickets) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var response = [{
                    total_number_of_tickets: tickets.length,
                    data: tickets
                }];
                res.jsonp(response);
            }
        });
};

/**
 * Ticket middleware
 */
exports.ticketByID = function(req, res, next, id) {
    Ticket.findById(id).populate('user', 'displayName')
        .populate('ticketcomment')
        .populate('ticketcomment.user.name')
        .populate('ticketcategory', 'name')
        .exec(function(err, ticket) {
            if (err) return next(err);
            if (!ticket) return next(new Error('Failed to load Ticket ' + id));
            req.ticket = ticket;
            next();
        });
};


/**
 * Ticket authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.ticket.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
