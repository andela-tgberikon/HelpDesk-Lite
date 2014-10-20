'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ticketcomment Schema
 */
var TicketcommentSchema = new Schema({
	
	created: {
		type: Date,
		default: Date.now
	},
	comment:{
		type: String,
		required: 'This field can not be blank'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ticket: {
		type: Schema.ObjectId,
		ref: 'Ticket'
	}
	
});

mongoose.model('Ticketcomment', TicketcommentSchema);