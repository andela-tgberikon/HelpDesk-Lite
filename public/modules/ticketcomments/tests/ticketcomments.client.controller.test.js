'use strict';

(function() {
	// Ticketcomments Controller Spec
	describe('Ticketcomments Controller Tests', function() {
		// Initialize global variables
		var TicketcommentsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Ticketcomments controller.
			TicketcommentsController = $controller('TicketcommentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ticketcomment object fetched from XHR', inject(function(Ticketcomments) {
			// Create sample Ticketcomment using the Ticketcomments service
			var sampleTicketcomment = new Ticketcomments({
				name: 'New Ticketcomment'
			});

			// Create a sample Ticketcomments array that includes the new Ticketcomment
			var sampleTicketcomments = [sampleTicketcomment];

			// Set GET response
			$httpBackend.expectGET('ticketcomments').respond(sampleTicketcomments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ticketcomments).toEqualData(sampleTicketcomments);
		}));

		it('$scope.findOne() should create an array with one Ticketcomment object fetched from XHR using a ticketcommentId URL parameter', inject(function(Ticketcomments) {
			// Define a sample Ticketcomment object
			var sampleTicketcomment = new Ticketcomments({
				name: 'New Ticketcomment'
			});

			// Set the URL parameter
			$stateParams.ticketcommentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ticketcomments\/([0-9a-fA-F]{24})$/).respond(sampleTicketcomment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ticketcomment).toEqualData(sampleTicketcomment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ticketcomments) {
			// Create a sample Ticketcomment object
			var sampleTicketcommentPostData = new Ticketcomments({
				name: 'New Ticketcomment'
			});

			// Create a sample Ticketcomment response
			var sampleTicketcommentResponse = new Ticketcomments({
				_id: '525cf20451979dea2c000001',
				name: 'New Ticketcomment'
			});

			// Fixture mock form input values
			scope.name = 'New Ticketcomment';

			// Set POST response
			$httpBackend.expectPOST('ticketcomments', sampleTicketcommentPostData).respond(sampleTicketcommentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ticketcomment was created
			expect($location.path()).toBe('/ticketcomments/' + sampleTicketcommentResponse._id);
		}));

		it('$scope.update() should update a valid Ticketcomment', inject(function(Ticketcomments) {
			// Define a sample Ticketcomment put data
			var sampleTicketcommentPutData = new Ticketcomments({
				_id: '525cf20451979dea2c000001',
				name: 'New Ticketcomment'
			});

			// Mock Ticketcomment in scope
			scope.ticketcomment = sampleTicketcommentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ticketcomments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ticketcomments/' + sampleTicketcommentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ticketcommentId and remove the Ticketcomment from the scope', inject(function(Ticketcomments) {
			// Create new Ticketcomment object
			var sampleTicketcomment = new Ticketcomments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ticketcomments array and include the Ticketcomment
			scope.ticketcomments = [sampleTicketcomment];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ticketcomments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTicketcomment);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ticketcomments.length).toBe(0);
		}));
	});
}());