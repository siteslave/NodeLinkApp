angular.module('app.services.Main', [])
  .factory('MainService', function($q, $http) {

    var cryptoHash = require('crypto');

    var configFile = ipc.sendSync('get-config-file');
    var config = fse.readJsonSync(configFile);
    var cloudConfig = config.cloud;
    var cloudUrl = cloudConfig.url + ':' + parseInt(cloudConfig.port);
    var cloudUser = cloudConfig.user;
    var cloudPassword = cryptoHash.createHash('md5').update(cloudConfig.password).digest('hex');

    var db = require('knex')({
      client: 'mysql',
      connection: config.db
    });

    return {

      list: function(date) {
        var q = $q.defer();
        var sql = 'select (select hospitalcode from opdconfig limit 1) as hospcode, ' +
          'ed.vn, o.hn, o.vstdate, o.vsttime, p.cid, ed.trauma, et.er_accident_type_name, ' +
          'ev.visit_name, ed.arrive_time, p.pname, p.fname, p.lname, p.sex, p.birthday, ' +
          'ed.er_accident_type_id, ed.visit_type ' +
          'from er_nursing_detail as ed  ' +
          'inner join ovst as o on o.vn=ed.vn ' +
          'inner join patient as p on p.hn=o.hn  ' +
          'left join er_accident_type as et on et.er_accident_type_id=ed.er_accident_type_id ' +
          'left join er_nursing_visit_type as ev on ev.visit_type=ed.visit_type where o.vstdate=?';

        db.raw(sql, [date])
          .then(function(rows) {
            q.resolve(rows[0])
          })
          .catch(function(err) {
            q.reject(err)
          });

        return q.promise;
      },

      send: function(data) {
        var q = $q.defer();
        var params = {
          user: cloudUser,
          password: cloudPassword,
          data: data
        };

        $http.post(cloudUrl + '/save', params)
          .success(function(data) {
            q.resolve();
            console.log(data);
          })
          .error(function(err) {
            q.reject(err);
            console.log(err);
          });

        return q.promise;
      },
      getSendHistory: function(date) {
        var q = $q.defer();
        $http.post(cloudUrl + '/send_history', {
            date: date,
            user: cloudUser,
            password: cloudPassword
          })
          .success(function(data) {
            q.resolve(data);
          })
          .error(function(err) {
            q.reject(err);
            console.log(err);
          });

        return q.promise;
      }
    }
  });
