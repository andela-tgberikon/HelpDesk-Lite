'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ticket Schema
 */
var TicketSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Ticket name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Ticket Description',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	due: {
		type: Date,
		required: 'Please pick a due date'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	ticketcomment:[{
			type: Schema.ObjectId,
			ref: 'Ticketcomment'
		}],
	status: {
		type: String, 
		default: 'Open',
		enum: ['Open', 'Closed']
	},
	ticketcategory:{
			type: Schema.ObjectId,
			ref: 'Ticketcategory',
			required: 'Please select a category'
		}
});

mongoose.model('Ticket', TicketSchema);