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