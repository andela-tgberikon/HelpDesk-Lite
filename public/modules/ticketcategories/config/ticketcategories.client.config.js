'use strict';

// Configuring the Articles module
angular.module('tickets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Ticketcategories', 'ticketcategories', 'dropdown', '/ticketcategories(/create)?');
		Menus.addSubMenuItem('topbar', 'ticketcategories', 'List Ticketcategories', 'ticketcategories');
		Menus.addSubMenuItem('topbar', 'ticketcategories', 'New Ticketcategories', 'ticketcategories/create');
	}
]);