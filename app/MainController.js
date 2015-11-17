angular.module('app.controllers.Main', ['app.services.Main'])
  .controller('MainController', function($scope, $rootScope, MainService, ngProgressFactory) {
    $rootScope.menuId = 1;

    $scope.selectedTotal = 0;

    MainService.getHospitalCode()
    .then(function (hcode) {
      $scope.hcode = hcode;
    });

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

          MainService.getSendHistory(date, $scope.hcode)
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
                obj.hasInfo = v.nodedetail ? true : false;
                // data.rows
                var idx = _.findIndex(data.rows, {hcode: v.hospcode, vn: v.vn});
                if (idx >= 0) obj.sendded = true;
                else obj.sendded = false;
                obj.checked = false;

                $scope.person.push(obj);

              });
            } else {
              alert('Error: ' + JSON.stringify(data.msg));
              console.log(data.msg);
            }
          }, function (err) {
            alert('Error: ไม่สามารถเชื่อมต่อกับ Server ได้');
          })
          $scope.progressbar.complete();

        }, function(err) {
          alert('Error: ' + JSON.stringify(err));
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
      var vn = [];

      _.forEach($scope.person, function (v) {
        if (v.checked) {
          //var obj = {};
          // obj.fullname = v.fullname;
          // obj.hn = v.hn;
          //obj.vn = v.vn;
          // obj.hospcode = v.hospcode;
          // obj.sex = v.sex;
          // obj.birth = v.birth;
          // obj.cid = v.cid;
          // obj.trauma = v.trauma;
          // obj.visit_type = v.visit_type;
          // obj.vstdate = v.vstdate;
          // obj.vsttime = v.vsttime;
          // obj.arrive_time = v.arrive_time;
          // obj.accident_type = v.er_accident_type_id;
          vn.push(v.vn);
        }
      });
      if (_.size(vn)) {
        if (confirm('Are you sure?')) {
          console.log(vn);
          MainService.getExport(vn)
          .then(function (rows) {
            if (_.size(rows)) {
              var person = [];
              _.forEach(rows, function (v) {
                var obj = {};
                obj.acc_prov = v.acc_prov;
                obj.acc_amp = v.acc_amp;
                obj.acc_tam = v.acc_tam;
                obj.adate = v.adate ? moment(v.adate).format('x') : '';
                obj.age = v.age;
                obj.alcohol = v.alcohol;
                obj.atime = v.atime;
                obj.belt = v.belt;
                obj.carry = v.carry;
                obj.ddate = v.ddate ? moment(v.ddate).format('x') : '';
                obj.dob = v.dob ? moment(v.dob).format('x') : '';
                obj.dtime = v.dtime;
                obj.firstname = v.firstname;
                obj.hcode = v.hcode;
                obj.hdate = v.hdate ? moment(v.hdate).format('x') : '';
                obj.helmet = v.helmet;
                obj.hn = v.hn;
                obj.htime = v.htime;
                obj.icd10 = v.icd10;
                obj.lastname = v.lastname;
                obj.nationality = v.nationality;
                obj.pid = v.pid;
                obj.prename = v.prename;
                obj.road = v.road;
                obj.road_area = v.road_area;
                obj.sex = v.sex;
                obj.type_road = v.type_road;
                obj.typepass = v.typepass;
                obj.vehicle1 = v.vehicle1;
                obj.vehicle2 = v.vehicle2;
                obj.vn = v.vn;
                obj.vstdate = v.vstdate ? moment(v.vstdate).format('x') : '';

                person.push(obj);
              })

              MainService.send(person)
              .then(function () {
                console.log(person);
                alert('ส่งข้อมูลเสร็จเรียบร้อยแล้ว');
                $scope.getList();
              }, function (err) {
                console.log(err);
              })
            } else {
              alert('ไม่พบข้อมูลที่ต้องการส่ง');
            }
          }, function (err) {
            console.log(err);
          })

        }
      } else {
        alert('ไม่พบรายการที่ต้องการส่ง')
      }
    };

    $scope.sendAll = function () {
      var vn = [];

      _.forEach($scope.person, function (v) {
        vn.push(v.vn);
      });

      if (_.size(vn)) {
        if (confirm('Are you sure?')) {
          MainService.getExport(vn)
          .then(function (rows) {
            if (_.size(rows)) {
              var person = [];
              _.forEach(rows, function (v) {
                var obj = {};
                obj.acc_prov = v.acc_prov;
                obj.acc_amp = v.acc_amp;
                obj.acc_tam = v.acc_tam;
                obj.adate = v.adate ? moment(v.adate).format('x') : '';
                obj.age = v.age;
                obj.alcohol = v.alcohol;
                obj.atime = v.atime;
                obj.belt = v.belt;
                obj.carry = v.carry;
                obj.ddate = v.ddate ? moment(v.ddate).format('x') : '';
                obj.dob = v.dob ? moment(v.dob).format('x') : '';
                obj.dtime = v.dtime;
                obj.firstname = v.firstname;
                obj.hcode = v.hcode;
                obj.hdate = v.hdate ? moment(v.hdate).format('x') : '';
                obj.helmet = v.helmet;
                obj.hn = v.hn;
                obj.htime = v.htime;
                obj.icd10 = v.icd10;
                obj.lastname = v.lastname;
                obj.nationality = v.nationality;
                obj.pid = v.pid;
                obj.prename = v.prename;
                obj.road = v.road;
                obj.road_area = v.road_area;
                obj.sex = v.sex;
                obj.type_road = v.type_road;
                obj.typepass = v.typepass;
                obj.vehicle1 = v.vehicle1;
                obj.vehicle2 = v.vehicle2;
                obj.vn = v.vn;
                obj.vstdate = v.vstdate ? moment(v.vstdate).format('x') : '';
                person.push(obj);
              })

              MainService.send(person)
              .then(function () {
                alert('ส่งข้อมูลเสร็จเรียบร้อยแล้ว');
                $scope.getList();
              }, function (err) {
                console.log(err);
              })
            } else {
              alert('ไม่พบข้อมูลที่ต้องการส่ง');
            }
          })

        }
      } else {
        alert('ไม่พบรายการที่ต้องการส่ง')
      }
    };

    $scope.getList();

  });
