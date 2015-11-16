angular.module('app.controllers.Info', [])
.controller('InfoController', function ($scope, $rootScope, $stateParams, MainService) {
  $rootScope.menuId = 2;
  console.log($stateParams.vn);
});
