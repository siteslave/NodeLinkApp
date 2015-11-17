angular.module('app.controllers.Info', ['app.services.Info'])
.controller('InfoController', function ($scope, $rootScope, $stateParams, InfoService) {
  $rootScope.menuId = 2;
  //console.log($stateParams.vn);

  InfoService.getInfo($stateParams.vn)
  .then(function (person) {

    $scope.fullname = person.pname + person.fname + ' ' + person.lname;
    $scope.birthday = moment(person.birthday).format('DD/MM/YYYY');
    $scope.age = person.age;
    $scope.hn = person.hn;
    $scope.vn = person.vn;

  })

  InfoService.getOtherInfo($stateParams.vn)
  .then(function (info) {
    if (_.size(info)) {

      InfoService.getProvinces()
      .then(function (rows) {
        $scope.provinces = rows;
      });

      InfoService.getAmp(info.acc_prov)
      .then(function (rows) {
        $scope.amppurs = rows;
      })

      InfoService.getTmb(info.acc_prov, info.acc_amp)
      .then(function (rows) {
        $scope.tambols = rows;
      })

      $scope.adate = info.adate ? new Date(moment(info.adate).format()) : '';

      $scope.atime = info.atime ? new Date(moment(info.atime, 'HH:mm:ss').format()) : '';
      $scope.province = info.acc_prov;
      $scope.ampur = info.acc_amp;
      $scope.tambol = info.acc_tam;

      $scope.vehicle1 = info.vehicle1;
      $scope.vehicle2 = info.vehicle2;
      $scope.road = info.road;
      $scope.road_area = info.road_area;
      $scope.type_road = info.type_road;
    }
  })

  //$scope.provinces = [{name: 'มหาสารคาม', code: '44'}, {name: 'ร้อยเอ็ด', code: '40'}];
  InfoService.getProvinces()
  .then(function (rows) {
    $scope.provinces = rows;
  });

  $scope.changeChw = function () {
    InfoService.getAmp($scope.province)
    .then(function (rows) {
      $scope.amppurs = rows;
    })
  }

  $scope.changeAmp = function () {
    InfoService.getTmb($scope.province, $scope.ampur)
    .then(function (rows) {
      $scope.tambols = rows;
    })
  }

  InfoService.getVehicle()
  .then(function (rows) {
    $scope.vehicles = rows;
  });

  $scope.save = function () {
    var items = {};

    items.vn = $stateParams.vn;
    items.adate = $scope.adate ? moment($scope.adate).format('YYYY-MM-DD') : '';
    items.atime = $scope.atime ? moment($scope.atime).format('HH:mm:ss') : '';
    items.acc_prov = $scope.province;
    items.acc_amp = $scope.ampur;
    items.acc_tam = $scope.tambol;
    items.vehicle1 = $scope.vehicle1;
    items.vehicle2 = $scope.vehicle2;
    items.road = $scope.road;
    items.road_area = $scope.road_area;
    items.type_road = $scope.type_road;

    InfoService.checkDuplicated($stateParams.vn)
    .then(function (total) {
      if ( total > 0) {
        // update
        return InfoService.updateAccident(items);
      } else {
          // New
          return InfoService.saveAccident(items);
      }
    })
    .then(function () {
      alert('บันทึกเสร็จเรียบร้อยแล้ว')
    }, function (err) {
      alert('Error: ' + JSON.stringify(err))
    })
  };

});
