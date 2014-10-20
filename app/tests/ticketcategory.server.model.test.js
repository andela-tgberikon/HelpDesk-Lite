'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ticketcategory = mongoose.model('Ticketcategory');

/**
 * Globals
 */
var user, ticketcategory;

/**
 * Unit tests
 */
describe('Ticketcategory Model Unit Tests:', function() {
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
			ticketcategory = new Ticketcategory({
				name: 'Ticketcategory Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return ticketcategory.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			ticketcategory.name = '';

			return ticketcategory.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Ticketcategory.remove().exec();
		User.remove().exec();

		done();
	});
});