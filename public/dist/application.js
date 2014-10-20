'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'helpdesk-lite';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('ticketcategories');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('ticketcomments');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('tickets');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('ticketstatuses');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

// Configuring the Articles module
angular.module('tickets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Ticketcategories', 'ticketcateories', 'dropdown', '/ticketcategories(/create)?');
		Menus.addSubMenuItem('topbar', 'ticketcateories', 'List Ticketcategories', 'ticketcateories');
		Menus.addSubMenuItem('topbar', 'ticketcateories', 'New Ticketcategories', 'ticketcateories/create');
	}
]);
'use strict';

//Setting up route
angular.module('ticketcategories').config(['$stateProvider',
	function($stateProvider) {
		// Ticketcategories state routing
		$stateProvider.
		state('listTicketcategories', {
			url: '/ticketcategories',
			templateUrl: 'modules/ticketcategories/views/list-ticketcategories.client.view.html'
		}).
		state('createTicketcategory', {
			url: '/ticketcategories/create',
			templateUrl: 'modules/ticketcategories/views/create-ticketcategory.client.view.html'
		}).
		state('viewTicketsInCategory', {
			url: '/ticketcategories/:ticketcategoryId/tickets',
			templateUrl: 'modules/ticketcategories/views/view-ticketcategory.client.view.html'
		}).
		state('editTicketcategory', {
			url: '/ticketcategories/:ticketcategoryId/edit',
			templateUrl: 'modules/ticketcategories/views/edit-ticketcategory.client.view.html'
		});
	}
]);
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

'use strict';

//Ticketcategories service used to communicate Ticketcategories REST endpoints
angular.module('ticketcategories').factory('Ticketcategories', ['$resource',
	function($resource) {
		return $resource('ticketcategories/:ticketcategoryId', { ticketcategoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('ticketcomments').config(['$stateProvider',
	function($stateProvider) {
		// Ticketcomments state routing
		$stateProvider.
		state('listTicketcomments', {
			url: '/ticketcomments',
			templateUrl: 'modules/ticketcomments/views/list-ticketcomments.client.view.html'
		}).
		state('createTicketcomment', {
			url: '/ticketcomments/create',
			templateUrl: 'modules/ticketcomments/views/create-ticketcomment.client.view.html'
		}).
		state('viewTicketcomment', {
			url: '/ticketcomments/:ticketcommentId',
			templateUrl: 'modules/ticketcomments/views/view-ticketcomment.client.view.html'
		}).
		state('editTicketcomment', {
			url: '/ticketcomments/:ticketcommentId/edit',
			templateUrl: 'modules/ticketcomments/views/edit-ticketcomment.client.view.html'
		});
	}
]);
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
'use strict';

//Ticketcomments service used to communicate Ticketcomments REST endpoints
angular.module('ticketcomments').factory('Ticketcomments', ['$resource',
	function($resource) {
		return $resource('tickets/:ticketId/comments/:commentId', { commentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);


'use strict';

// Configuring the Articles module
angular.module('tickets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Tickets', 'tickets', 'dropdown', '/tickets(/create)?');
		Menus.addSubMenuItem('topbar', 'tickets', 'List Tickets', 'tickets');
		Menus.addSubMenuItem('topbar', 'tickets', 'New Ticket', 'tickets/create');
	}
]);
'use strict';

//Setting up route
angular.module('tickets').config(['$stateProvider',
	function($stateProvider) {
		// Tickets state routing
		$stateProvider.
		state('listTickets', {
			url: '/tickets',
			templateUrl: 'modules/tickets/views/list-tickets.client.view.html'
		}).
		state('createTicket', {
			url: '/tickets/create',
			templateUrl: 'modules/tickets/views/create-ticket.client.view.html'
		}).
		state('viewTicket', {
			url: '/tickets/:ticketId',
			templateUrl: 'modules/tickets/views/view-ticket.client.view.html'
		}).
		state('editTicket', {
			url: '/tickets/:ticketId/edit',
			templateUrl: 'modules/tickets/views/edit-ticket.client.view.html'
		});
	}
]);
'use strict';

// Tickets controller
angular.module('tickets').controller('TicketsController', ['$scope', '$stateParams', '$location', 'Authentication', 'TicketsByCategory', 'Tickets', 'Ticketcategories', 'Ticketcomments',
    function($scope, $stateParams, $location, Authentication, TicketsByCategory, Tickets, Ticketcategories, Ticketcomments) {
        $scope.authentication = Authentication;
        $scope.ticketcategories = Ticketcategories.query();

        // Create new Ticket
        $scope.create = function() {
            // Create new Ticket object
            var ticket = new TicketsByCategory({
                name: this.name,
                description: this.description,
                due: this.due
            });
            // Redirect after save
            ticket.$save({
                ticketCategoryId: $scope.ticketcategory
            }, function(response) {
                $location.path('tickets/' + response._id);
                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Post comment on Ticket
        $scope.postComment = function (){
            // Create new Comment Object
            var comment = new Ticketcomments({
                comment: this.ticketcomment
            });
            comment.$save({ticketId: $stateParams.ticketId}, function(resp){
                $scope.comments.push(resp);
            });
            $scope.ticketcomment = '';
        };


        // Remove existing Ticket
        $scope.remove = function(ticket) {
            if (ticket) {
                ticket.$remove({
                    ticketId:ticket.data._id
                });
                for (var i in $scope.tickets) {
                    if ($scope.tickets[i] === ticket) {
                        $scope.tickets.splice(i, 1);
                    }
                }
            } else {
                $scope.ticket.$remove(function() {
                    $location.path('tickets/' );
                });
            }
        };

        // Update existing Ticket
        $scope.update = function() {
            var ticket = $scope.ticket;
            ticket.$update(function() {
                $location.path('tickets/' + ticket.data._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Tickets
        $scope.find = function() {
            Tickets.query({}, function(response) {
                $scope.tickets = response[0].data;
                $scope.recentTickets = [];
                for (var i = 0; i < 5; i++) {
                    $scope.recentTickets.push(response[0].data[i]);
                }
            });
        };


        // Find existing Ticket
        $scope.findOne = function() {
            $scope.ticket = Tickets.get({
                ticketId: $stateParams.ticketId
            });
            $scope.comments = Ticketcomments.query({
                ticketId: $stateParams.ticketId
            });
        };




        /**********************************************************/
        /*                      DATE PICKER STUFF                 */
        /**********************************************************/

        $scope.today = function() {
            $scope.due = new Date();
        };
        $scope.today();

        $scope.clear = function() {
            $scope.due = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'longDate'];
        $scope.format = $scope.formats[0];
    }
]);

'use strict';

//Tickets service used to communicate Tickets REST endpoints
angular.module('tickets').factory('Tickets', ['$resource',
	function($resource) {
		return $resource('tickets/:ticketId', { ticketId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

//Tickets service used to create new Tickets from the REST endpoint
angular.module('tickets').factory('TicketsByCategory', ['$resource',
	function($resource) {
		return $resource('ticketcategories/:ticketCategoryId/tickets/:ticketId', { ticketId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

//Setting up route
angular.module('ticketstatuses').config(['$stateProvider',
	function($stateProvider) {
		// Ticketstatuses state routing
		$stateProvider.
		state('listTicketstatuses', {
			url: '/ticketstatuses',
			templateUrl: 'modules/ticketstatuses/views/list-ticketstatuses.client.view.html'
		}).
		state('createTicketstatus', {
			url: '/ticketstatuses/create',
			templateUrl: 'modules/ticketstatuses/views/create-ticketstatus.client.view.html'
		}).
		state('viewTicketstatus', {
			url: '/ticketstatuses/:ticketstatusId',
			templateUrl: 'modules/ticketstatuses/views/view-ticketstatus.client.view.html'
		}).
		state('editTicketstatus', {
			url: '/ticketstatuses/:ticketstatusId/edit',
			templateUrl: 'modules/ticketstatuses/views/edit-ticketstatus.client.view.html'
		});
	}
]);
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
'use strict';

//Ticketstatuses service used to communicate Ticketstatuses REST endpoints
angular.module('ticketstatuses').factory('Ticketstatuses', ['$resource',
	function($resource) {
		return $resource('ticketstatuses/:ticketstatusId', { ticketstatusId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invlaid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid){
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);
	
				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);

'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [

	function() {
		var _this = this;

		_this._data = {
			user: window.user
		};

		return _this._data;
	}
]);
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);