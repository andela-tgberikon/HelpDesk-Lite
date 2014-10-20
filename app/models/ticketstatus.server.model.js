'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ticketstatus Schema
 */
var TicketstatusSchema = new Schema({
	status: {
		type: String, 
		enum: ['Open', 'Closed']
	}
});

mongoose.model('Ticketstatus', TicketstatusSchema);