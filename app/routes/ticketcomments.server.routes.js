'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var ticketcomments = require('../../app/controllers/ticketcomments');

	// Ticketcomments Routes
	app.route('/ticketcomments')
		.get(ticketcomments.list)
		.post(users.requiresLogin, ticketcomments.create);

	app.route('/ticketcomments/:ticketcommentId')
		.get(ticketcomments.read)
		.put(users.requiresLogin, ticketcomments.hasAuthorization, ticketcomments.update)
		.delete(users.requiresLogin, ticketcomments.hasAuthorization, ticketcomments.delete);

	// Finish by binding the Ticketcomment middleware
	app.param('ticketcommentId', ticketcomments.ticketcommentByID);
};