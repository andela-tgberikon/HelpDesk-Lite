'use strict';

// Ticketstatuses controller
angular.module('ticketstatuses').controller('TicketstatusesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ticketstatuses',
	function($scope, $stateParams, $location, Authentication, Ticketstatuses ) {
		$scope.authentication = Authentication;

		// Create new Ticketstatus
		$scope.create = function() {
			// Create new Ticketstatus object
			var ticketstatus = new Ticketstatuses ({
				name: this.name
			});

			// Redirect after save
			ticketstatus.$save(function(response) {
				$location.path('ticketstatuses/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ticketstatus
		$scope.remove = function( ticketstatus ) {
			if ( ticketstatus ) { ticketstatus.$remove();

				for (var i in $scope.ticketstatuses ) {
					if ($scope.ticketstatuses [i] === ticketstatus ) {
						$scope.ticketstatuses.splice(i, 1);
					}
				}
			} else {
				$scope.ticketstatus.$remove(function() {
					$location.path('ticketstatuses');
				});
			}
		};

		// Update existing Ticketstatus
		$scope.update = function() {
			var ticketstatus = $scope.ticketstatus ;

			ticketstatus.$update(function() {
				$location.path('ticketstatuses/' + ticketstatus._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ticketstatuses
		$scope.find = function() {
			$scope.ticketstatuses = Ticketstatuses.query();
		};

		// Find existing Ticketstatus
		$scope.findOne = function() {
			$scope.ticketstatus = Ticketstatuses.get({ 
				ticketstatusId: $stateParams.ticketstatusId
			});
		};
	}
]);