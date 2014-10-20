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