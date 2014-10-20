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