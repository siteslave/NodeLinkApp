angular.module('app.controllers.Main', ['app.services.Main'])
  .controller('MainController', function($scope, $rootScope, MainService, ngProgressFactory) {
    $rootScope.menuId = 1;

    $scope.selectedTotal = 0;

    $scope.startDate = $rootScope.startDate ? $rootScope.startDate : new Date();
    $scope.getList = function() {
      //  console.log($scope.startDate);
      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.setHeight('2px');
      $scope.progressbar.setColor('#E91E63');
      $scope.progressbar.start();

      var date = moment($scope.startDate).format('YYYY-MM-DD');
      $rootScope.startDate = $scope.startDate;
      MainService.list(date)
        .then(function(rows) {

          $scope.person = [];

          _.forEach(rows, function (v) {
            var obj = {};
            obj.fullname = v.pname + v.fname + ' ' + v.lname;
            obj.hn = v.hn;
            obj.vn = v.vn;
            obj.hospital = v.hospcode + '-' + v.hospname;
            obj.hospcode = v.hospcode;
            obj.sex = v.sex == '1' ? 'ขาย' : 'หญิง';
            obj.pttype = v.pttype_name;
            obj.refer_cause = v.refer_cause_name;
            obj.refer_number = v.refer_number;
            obj.sendded = false;

            $scope.person.push(obj);

          });

          $scope.progressbar.complete();

        }, function(err) {
          $scope.progressbar.complete();
          console.log(err);
        });

    };

    $scope.toggleSend = function (vn) {
      var idx = _.findIndex($scope.person, {vn: vn});
      if (idx >= 0) {
        $scope.person[idx].sendded = !$scope.person[idx].sendded;
        if ($scope.person[idx].sendded) $scope.selectedTotal++;
        else $scope.selectedTotal--;
      }
    };

    $scope.sendSelected = function () {
      var items = [];

      _.forEach($scope.person, function (v) {
        if (v.sendded) {
          var obj = {};
          obj.hospcode = '11054',
          obj.hn = v.hn;
          obj.vn = v.vn;
          obj.hospcode = v.hospcode;
          obj.ptype = v.pttype;
          obj.refer_cause = v.refer_cause;
          obj.sex = v.sex;

          items.push(obj);
        }
      });
      if (confirm('Are you sure?')) {
        MainService.send(items)
        .then(function () {
          alert('Success')
        }, function (err) {
          console.log(err);
        })
      }

    };

    $scope.sendAll = function () {
      var data = {name: 'xx', cid: 'xx'};
      MainService.send(data)
      .then(function () {

      }, function (err) {

      })
    }

    $scope.getList();

  });
