'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ticketcomment = mongoose.model('Ticketcomment');

/**
 * Globals
 */
var user, ticketcomment;

/**
 * Unit tests
 */
describe('Ticketcomment Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			ticketcomment = new Ticketcomment({
				name: 'Ticketcomment Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return ticketcomment.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			ticketcomment.name = '';

			return ticketcomment.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Ticketcomment.remove().exec();
		User.remove().exec();

		done();
	});
});