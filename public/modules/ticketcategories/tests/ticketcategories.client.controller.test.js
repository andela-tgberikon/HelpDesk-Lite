'use strict';

(function() {
	// Ticketcategories Controller Spec
	describe('Ticketcategories Controller Tests', function() {
		// Initialize global variables
		var TicketcategoriesController,
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

			// Initialize the Ticketcategories controller.
			TicketcategoriesController = $controller('TicketcategoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ticketcategory object fetched from XHR', inject(function(Ticketcategories) {
			// Create sample Ticketcategory using the Ticketcategories service
			var sampleTicketcategory = new Ticketcategories({
				name: 'New Ticketcategory'
			});

			// Create a sample Ticketcategories array that includes the new Ticketcategory
			var sampleTicketcategories = [sampleTicketcategory];

			// Set GET response
			$httpBackend.expectGET('ticketcategories').respond(sampleTicketcategories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ticketcategories).toEqualData(sampleTicketcategories);
		}));

		it('$scope.findOne() should create an array with one Ticketcategory object fetched from XHR using a ticketcategoryId URL parameter', inject(function(Ticketcategories) {
			// Define a sample Ticketcategory object
			var sampleTicketcategory = new Ticketcategories({
				name: 'New Ticketcategory'
			});

			// Set the URL parameter
			$stateParams.ticketcategoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ticketcategories\/([0-9a-fA-F]{24})$/).respond(sampleTicketcategory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ticketcategory).toEqualData(sampleTicketcategory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ticketcategories) {
			// Create a sample Ticketcategory object
			var sampleTicketcategoryPostData = new Ticketcategories({
				name: 'New Ticketcategory'
			});

			// Create a sample Ticketcategory response
			var sampleTicketcategoryResponse = new Ticketcategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Ticketcategory'
			});

			// Fixture mock form input values
			scope.name = 'New Ticketcategory';

			// Set POST response
			$httpBackend.expectPOST('ticketcategories', sampleTicketcategoryPostData).respond(sampleTicketcategoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ticketcategory was created
			expect($location.path()).toBe('/ticketcategories/' + sampleTicketcategoryResponse._id);
		}));

		it('$scope.update() should update a valid Ticketcategory', inject(function(Ticketcategories) {
			// Define a sample Ticketcategory put data
			var sampleTicketcategoryPutData = new Ticketcategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Ticketcategory'
			});

			// Mock Ticketcategory in scope
			scope.ticketcategory = sampleTicketcategoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ticketcategories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ticketcategories/' + sampleTicketcategoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ticketcategoryId and remove the Ticketcategory from the scope', inject(function(Ticketcategories) {
			// Create new Ticketcategory object
			var sampleTicketcategory = new Ticketcategories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ticketcategories array and include the Ticketcategory
			scope.ticketcategories = [sampleTicketcategory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ticketcategories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTicketcategory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ticketcategories.length).toBe(0);
		}));
	});
}());