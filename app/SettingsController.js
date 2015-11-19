/* global fse */
/* global ipc */
angular.module('app.controllers.Settings', [])
.controller('SettingsController', function ($scope, $state, $rootScope) {
  $rootScope.menuId = 2;

  var configFile = ipc.sendSync('get-config-file');
  $scope.config = fse.readJsonSync(configFile);

  $scope.doSave = function () {
    fse.writeJson(configFile, $scope.config, function (err) {
      if (err) alert(JSON.stringify(err))
      else $state.go('main');
    });
  }

});
