'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Ticketcategory Schema
 */
var TicketcategorySchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Ticketcategory name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    /*Added this*/
    tickets: [{
        type: Schema.ObjectId,
        ref: 'Ticket',
        required: 'Ticket add'
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Ticketcategory', TicketcategorySchema);
