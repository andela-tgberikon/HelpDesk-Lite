'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users');
    var tickets = require('../../app/controllers/tickets');

    // Tickets Routes
    app.route('/tickets')
        .get(tickets.list)
        .put(users.requiresLogin, tickets.hasAuthorization, tickets.update);

    app.route('/tickets/:ticketId')
        .get(tickets.read)
        .put(users.requiresLogin, tickets.hasAuthorization, tickets.update)
        .delete(users.requiresLogin, tickets.hasAuthorization, tickets.delete);

    app.route('/tickets/:ticketId/comments')
        .post(users.requiresLogin, tickets.addComment)
        .get(tickets.viewComments);

    app.route('/tickets/category/:category')
        .get(tickets.getByCategory);
    //  .put(users.requiresLogin, tickets.hasAuthorization, tickets.update)
    //  .delete(users.requiresLogin, tickets.hasAuthorization, tickets.delete);
    // app.route('/tickets/users/:userId')
    //  .get(tickets.byUserId);
    // app.route('/tickets/:ticketId/comment')
    //  .post(tickets.ticketComment);

    // Finish by binding the Ticket middleware
    app.param('ticketId', tickets.ticketByID);
};
