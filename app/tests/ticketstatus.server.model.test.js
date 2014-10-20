'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Ticketstatus = mongoose.model('Ticketstatus');

/**
 * Globals
 */
var user, ticketstatus;

/**
 * Unit tests
 */
describe('Ticketstatus Model Unit Tests:', function() {
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
			ticketstatus = new Ticketstatus({
				name: 'Ticketstatus Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return ticketstatus.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			ticketstatus.name = '';

			return ticketstatus.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Ticketstatus.remove().exec();
		User.remove().exec();

		done();
	});
});