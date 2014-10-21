'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users');
    var tickets = require('../../app/controllers/tickets');
    var ticketcategories = require('../../app/controllers/ticketcategories');

    // Ticketcategories Routes
    app.route('/ticketcategories')
        .get(ticketcategories.list)
        .post(users.requiresLogin, ticketcategories.create);

    app.route('/ticketcategories/:ticketcategoryId')
        .get(ticketcategories.read)
        .put(users.requiresLogin, ticketcategories.hasAuthorization, ticketcategories.update)
        .delete(users.requiresLogin, ticketcategories.hasAuthorization, ticketcategories.delete);

    /*added this*/
    app.route('/ticketcategories/:ticketcategoryId/tickets')
        .get(ticketcategories.listTickets)
        .post(users.requiresLogin, ticketcategories.createTicket);
    
    // Finish by binding the Ticketcategory middleware
    app.param('ticketcategoryId', ticketcategories.ticketcategoryByID);
};
