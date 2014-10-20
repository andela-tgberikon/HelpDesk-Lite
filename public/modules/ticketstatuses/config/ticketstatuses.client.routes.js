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