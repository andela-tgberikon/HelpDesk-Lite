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