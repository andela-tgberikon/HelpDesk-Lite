'use strict';

// Ticketcategories controller
angular.module('ticketcategories').controller('TicketcategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Ticketcategories', 'Tickets',
    function($scope, $stateParams, $location, Authentication, Ticketcategories, Tickets) {
        $scope.authentication = Authentication;

        // Create new Ticketcategory
        $scope.create = function() {
            // Create new Ticketcategory object
            var ticketcategory = new Ticketcategories({
                name: this.name
            });

            // Redirect after save
            ticketcategory.$save(function(response) {
                $location.path('ticketcategories/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };


        // Remove existing Ticketcategory
        $scope.remove = function(ticketcategory) {
            if (ticketcategory) {
                ticketcategory.$remove();

                for (var i in $scope.ticketcategories) {
                    if ($scope.ticketcategories[i] === ticketcategory) {
                        $scope.ticketcategories.splice(i, 1);
                    }
                }
            } else {
                $scope.ticketcategory.$remove(function() {
                    $location.path('ticketcategories');
                });
            }
        };

        // Update existing Ticketcategory
        $scope.update = function() {
            var ticketcategory = $scope.ticketcategory;

            ticketcategory.$update(function() {
                $location.path('ticketcategories/' + ticketcategory._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Ticketcategories
        $scope.find = function() {
            $scope.ticketcategories = Ticketcategories.query();
        };

        // Find existing Ticketcategory
        $scope.findOne = function() {
            $scope.ticketcategory = Ticketcategories.get({
                ticketcategoryId: $stateParams.ticketcategoryId
            });
        };
    }
]);
