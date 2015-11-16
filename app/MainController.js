angular.module('app.controllers.Main', ['app.services.Main'])
  .controller('MainController', function($scope, $rootScope, MainService, ngProgressFactory) {
    $rootScope.menuId = 1;

    $scope.selectedTotal = 0;

    $scope.startDate = $rootScope.startDate ? $rootScope.startDate : new Date();
    $scope.getList = function() {
      $scope.person = [];
      $scope.selectedTotal = 0;
      //  console.log($scope.startDate);
      $scope.progressbar = ngProgressFactory.createInstance();
      $scope.progressbar.setHeight('2px');
      $scope.progressbar.setColor('#E91E63');
      $scope.progressbar.start();

      var date = moment($scope.startDate).format('YYYY-MM-DD');
      $rootScope.startDate = $scope.startDate;
      MainService.list(date)
        .then(function(rows) {

          MainService.getSendHistory(date)
          .then(function (data) {
            if (data.ok) {
              _.forEach(rows, function (v) {
                var obj = {};
                obj.fullname = v.pname + v.fname + ' ' + v.lname;
                obj.hn = v.hn;
                obj.vn = v.vn
                obj.birth = v.birthday;
                obj.hospcode = v.hospcode;
                obj.sex_name = v.sex == '1' ? 'ขาย' : 'หญิง';
                obj.sex = v.sex;
                obj.cid = v.cid;
                obj.trauma = v.trauma;
                obj.visit_type = v.visit_type;
                obj.visit_type_name = v.visit_name;
                obj.vstdate_thai = moment(v.vstdate).format('DD/MM/YYYY');
                obj.vstdate = v.vstdate;
                obj.vsttime = v.vsttime;
                obj.arrive_time_thai = moment(v.arrive_time).format('DD/MM/YYYY HH:mm:ss');
                obj.arrive_time = v.arrive_time;
                obj.accident_type = v.er_accident_type_id;
                obj.accident_type_name = v.er_accident_type_name;
                // data.rows
                var idx = _.findIndex(data.rows, {hospcode: v.hospcode, vn: v.vn});
                if (idx >= 0) obj.sendded = true;
                else obj.sendded = false;
                obj.checked = false;

                $scope.person.push(obj);

              });
            } else {
              alert('Error: ' + JSON.stringify(data.msg));
              console.log(data.msg);
            }
          })
          $scope.progressbar.complete();

        }, function(err) {
          $scope.progressbar.complete();
          console.log(err);
        });

    };

    $scope.toggleSend = function (vn) {
      var idx = _.findIndex($scope.person, {vn: vn});
      if (idx >= 0) {
        $scope.person[idx].checked = !$scope.person[idx].checked;
        if ($scope.person[idx].checked) $scope.selectedTotal++;
        else $scope.selectedTotal--;
      }
    };

    $scope.sendSelected = function () {
      var items = [];

      _.forEach($scope.person, function (v) {
        if (v.checked) {
          var obj = {};
          obj.fullname = v.fullname;
          obj.hn = v.hn;
          obj.vn = v.vn
          obj.hospcode = v.hospcode;
          obj.sex = v.sex;
          obj.birth = v.birth;
          obj.cid = v.cid;
          obj.trauma = v.trauma;
          obj.visit_type = v.visit_type;
          obj.vstdate = v.vstdate;
          obj.vsttime = v.vsttime;
          obj.arrive_time = v.arrive_time;
          obj.accident_type = v.er_accident_type_id;

          items.push(obj);
        }
      });
      if (confirm('Are you sure?')) {
        MainService.send(items)
        .then(function () {
          alert('ส่งข้อมูลเสร็จเรียบร้อยแล้ว');
          $scope.getList();
        }, function (err) {
          console.log(err);
        })
      }

    };

    $scope.sendAll = function () {
      var items = [];

      _.forEach($scope.person, function (v) {
        var obj = {};
        obj.fullname = v.fullname;
        obj.hn = v.hn;
        obj.vn = v.vn
        obj.hospcode = v.hospcode;
        obj.sex = v.sex;
        obj.birth = v.birth;
        obj.cid = v.cid;
        obj.trauma = v.trauma;
        obj.visit_type = v.visit_type;
        obj.vstdate = v.vstdate;
        obj.vsttime = v.vsttime;
        obj.arrive_time = v.arrive_time;
        obj.accident_type = v.er_accident_type_id;

        items.push(obj);
      });

      if (confirm('Are you sure?')) {
        MainService.send(items)
        .then(function () {
          alert('ส่งข้อมูลเสร็จเรียบร้อยแล้ว');
          $scope.getList();
        }, function (err) {
          console.log(err);
        })
      }
    };

    $scope.getList();

  });
