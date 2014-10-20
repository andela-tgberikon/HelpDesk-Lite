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