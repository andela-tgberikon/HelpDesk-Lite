'use strict';

(function() {
	// Ticketstatuses Controller Spec
	describe('Ticketstatuses Controller Tests', function() {
		// Initialize global variables
		var TicketstatusesController,
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

			// Initialize the Ticketstatuses controller.
			TicketstatusesController = $controller('TicketstatusesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ticketstatus object fetched from XHR', inject(function(Ticketstatuses) {
			// Create sample Ticketstatus using the Ticketstatuses service
			var sampleTicketstatus = new Ticketstatuses({
				name: 'New Ticketstatus'
			});

			// Create a sample Ticketstatuses array that includes the new Ticketstatus
			var sampleTicketstatuses = [sampleTicketstatus];

			// Set GET response
			$httpBackend.expectGET('ticketstatuses').respond(sampleTicketstatuses);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ticketstatuses).toEqualData(sampleTicketstatuses);
		}));

		it('$scope.findOne() should create an array with one Ticketstatus object fetched from XHR using a ticketstatusId URL parameter', inject(function(Ticketstatuses) {
			// Define a sample Ticketstatus object
			var sampleTicketstatus = new Ticketstatuses({
				name: 'New Ticketstatus'
			});

			// Set the URL parameter
			$stateParams.ticketstatusId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ticketstatuses\/([0-9a-fA-F]{24})$/).respond(sampleTicketstatus);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ticketstatus).toEqualData(sampleTicketstatus);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ticketstatuses) {
			// Create a sample Ticketstatus object
			var sampleTicketstatusPostData = new Ticketstatuses({
				name: 'New Ticketstatus'
			});

			// Create a sample Ticketstatus response
			var sampleTicketstatusResponse = new Ticketstatuses({
				_id: '525cf20451979dea2c000001',
				name: 'New Ticketstatus'
			});

			// Fixture mock form input values
			scope.name = 'New Ticketstatus';

			// Set POST response
			$httpBackend.expectPOST('ticketstatuses', sampleTicketstatusPostData).respond(sampleTicketstatusResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ticketstatus was created
			expect($location.path()).toBe('/ticketstatuses/' + sampleTicketstatusResponse._id);
		}));

		it('$scope.update() should update a valid Ticketstatus', inject(function(Ticketstatuses) {
			// Define a sample Ticketstatus put data
			var sampleTicketstatusPutData = new Ticketstatuses({
				_id: '525cf20451979dea2c000001',
				name: 'New Ticketstatus'
			});

			// Mock Ticketstatus in scope
			scope.ticketstatus = sampleTicketstatusPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ticketstatuses\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ticketstatuses/' + sampleTicketstatusPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ticketstatusId and remove the Ticketstatus from the scope', inject(function(Ticketstatuses) {
			// Create new Ticketstatus object
			var sampleTicketstatus = new Ticketstatuses({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ticketstatuses array and include the Ticketstatus
			scope.ticketstatuses = [sampleTicketstatus];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ticketstatuses\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTicketstatus);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ticketstatuses.length).toBe(0);
		}));
	});
}());