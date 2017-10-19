(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItems);

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
	var narrow = this;

	narrow.searchTerm = '';

	narrow.search = function() {
		if (narrow.searchTerm === '') {
			narrow.found=[];
		}
		else {
			var promise = MenuSearchService.getMatchedMenuItems(narrow.searchTerm);
			promise.then(function (response) {
				narrow.found = response;
			});
		}
	}

	narrow.nothingFound = function() {
		return (typeof narrow.found != "undefined" && narrow.found.length == 0);
	}

	narrow.remove = function(index) {
		narrow.found.splice(index, 1);
	}

}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
	var service = this;

	service.getMatchedMenuItems = function (searchTerm) {
		var serviceUrl = 'https://davids-restaurant.herokuapp.com/menu_items.json';
		return $http({url: serviceUrl}).then(function (result) {
			var allItems = result.data.menu_items;

			// process result and only keep items that match
			var foundItems = [];
			for (var i = 0; i < allItems.length; i++) {
				var menuItem = allItems[i];
				if (menuItem.description.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1) {
					foundItems.push(menuItem);
				}
			}

		    // return processed items
		    return foundItems;
		});
	}
}

function FoundItems() {
	var ddo = {
		templateUrl: 'foundItems.html',
		restrict: 'E',
		scope: {
			items: '=foundItems',
			remove: '&onRemove'
		}
	};

	return ddo;
}

})();
