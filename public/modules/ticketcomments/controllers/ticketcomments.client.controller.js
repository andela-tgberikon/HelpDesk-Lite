'use strict';

// Ticketcomments controller
angular.module('ticketcomments').controller('TicketcommentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ticketcomments',
	function($scope, $stateParams, $location, Authentication, Ticketcomments ) {
		$scope.authentication = Authentication;

		// Create new Ticketcomment
		$scope.create = function() {
			// Create new Ticketcomment object
			var ticketcomment = new Ticketcomments ({
				name: this.name
			});

			// Redirect after save
			ticketcomment.$save(function(response) {
				$location.path('ticketcomments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Ticketcomment
		$scope.remove = function( ticketcomment ) {
			if ( ticketcomment ) { ticketcomment.$remove();

				for (var i in $scope.ticketcomments ) {
					if ($scope.ticketcomments [i] === ticketcomment ) {
						$scope.ticketcomments.splice(i, 1);
					}
				}
			} else {
				$scope.ticketcomment.$remove(function() {
					$location.path('ticketcomments');
				});
			}
		};

		// Update existing Ticketcomment
		$scope.update = function() {
			var ticketcomment = $scope.ticketcomment ;

			ticketcomment.$update(function() {
				$location.path('ticketcomments/' + ticketcomment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Ticketcomments
		$scope.find = function() {
			$scope.ticketcomments = Ticketcomments.query();
		};

		// Find existing Ticketcomment
		$scope.findOne = function() {
			$scope.ticketcomment = Ticketcomments.get({ 
				ticketcommentId: $stateParams.ticketcommentId
			});
		};
	}
]);