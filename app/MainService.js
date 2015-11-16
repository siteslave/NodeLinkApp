angular.module('app.services.Main', [])
.factory('MainService', function ($q, $http) {
  var configFile = ipc.sendSync('get-config-file');
  var config = fse.readJsonSync(configFile);

  var db = require('knex')({
    client: 'mysql',
    connection : config.db
  });

  return {

    list: function (date) {
      var q = $q.defer();
      db('referout as r')
      .select('p.hn', 'p.cid', 'r.vn', 'r.refer_date', 'r.refer_number', 'p.pname', 'p.fname',
      'p.lname', 'p.sex', 'rcs.name as rsrcf_name',
      'r.hospcode', 'h.name as hospname', 'pt.name as pttype_name', 'rt.refer_type_name',
      'rc.name as refer_cause_name')
      .innerJoin('ovst as o', 'o.vn', 'r.vn')
      .innerJoin('patient as p', 'p.hn', 'o.hn')
      .leftJoin('hospcode as h', 'h.hospcode', 'r.hospcode')
      .leftJoin('rfrcs as rcs', 'rcs.rfrcs', 'r.rfrcs')
      .leftJoin('pttype as pt', 'pt.pttype', 'r.pttype')
      .leftJoin('refer_type as rt', 'rt.refer_type', 'r.refer_type')
      .leftJoin('refer_cause as rc', 'rc.id', 'r.refer_cause')
      .where('r.refer_date', date)
      .then(function (rows) {
        q.resolve(rows)
      })
      .catch(function (err) {
        q.reject(err)
      });

      return q.promise;
    },

    send: function (data) {
      var q = $q.defer();
      var params = {
        hospcode: '11054',
        data: data
      };

      $http.post('http://localhost:3000/save', params)
      .success(function (data) {
        q.resolve();
        console.log(data);
      })
      .error(function (err) {
        q.reject(err);
        console.log(err);
      });

      return q.promise;
    }
  }
})
