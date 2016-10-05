(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItems)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;
  menu.termText = "";
  menu.found = [];

  menu.logMenuItems = function () {    
    var promise = MenuSearchService.getMatchedMenuItems(menu.termText);

    promise.then(function (response) {
      menu.found = response;
    })
    .catch(function (error) {
      menu.found = [];
    })
  };

  menu.removeItem = function(index) {
    menu.found.splice(index, 1);
  }  

}


MenuSearchService.$inject = ['$http', 'ApiBasePath']
function MenuSearchService($http, ApiBasePath) {
  var service = this;

  service.getMenuCategories = function () {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/categories.json")
    });

    return response;
  };


  service.getMatchedMenuItems = function (searchTerm) {
    var response = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function (result) {
      var foundItems = result.data.menu_items.filter(function (object){
        return object.description.toLowerCase().includes(searchTerm.toLowerCase());
      });
      return foundItems;
    })
    ;

    return response;
  };

}


function FoundItems() {
  var ddo = {
    restrict: 'E',
    templateUrl: 'foundItems.html',
    scope: {
      foundItems: '=',
      onRemove: '&'
    },
    controller: foundItemsCtrl,
    controllerAs: 'foundItemsCtrl',
    bindToController: true
  };

  return ddo;
}

function foundItemsCtrl() {
  var list = this;
}

})();
