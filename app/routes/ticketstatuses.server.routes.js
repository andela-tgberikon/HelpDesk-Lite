'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var ticketstatuses = require('../../app/controllers/ticketstatuses');

	// Ticketstatuses Routes
	app.route('/ticketstatuses')
		.get(ticketstatuses.list)
		.post(users.requiresLogin, ticketstatuses.create);

	app.route('/ticketstatuses/:ticketstatusId')
		.get(ticketstatuses.read)
		.put(users.requiresLogin, ticketstatuses.hasAuthorization, ticketstatuses.update)
		.delete(users.requiresLogin, ticketstatuses.hasAuthorization, ticketstatuses.delete);

	// Finish by binding the Ticketstatus middleware
	app.param('ticketstatusId', ticketstatuses.ticketstatusByID);
};