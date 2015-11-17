angular.module('app.services.Info', [])
.factory('InfoService', function ($q) {

  var configFile = ipc.sendSync('get-config-file');
  var config = fse.readJsonSync(configFile);

  var db = require('knex')({
    client: 'mysql',
    connection: config.db
  });

  return {
    getProvinces: function () {
      var q = $q.defer();
      db('thaiaddress')
      .select('name', 'chwpart')
      .orderBy('name')
      .groupBy('chwpart')
      .then(function (rows) {
        q.resolve(rows);
      })
      .catch(function (err) {
        q.reject(err);
        console.log(err);
      });

      return q.promise;
    },

    getAmp: function (chwpart) {
      var q = $q.defer();
      db('thaiaddress')
      .select('name', 'amppart')
      .orderBy('name')
      .where('chwpart', chwpart)
      .where('tmbpart', '00')
      .then(function (rows) {
        q.resolve(rows);
      })
      .catch(function (err) {
        q.reject(err);
        console.log(err);
      });

      return q.promise;
    },

    getTmb: function (chwpart, amppart) {
      var q = $q.defer();
      db('thaiaddress')
      .select('name', 'tmbpart')
      .orderBy('name')
      .where('chwpart', chwpart)
      .where('amppart', amppart)
      .whereNot('tmbpart', '00')
      .then(function (rows) {
        q.resolve(rows);
      })
      .catch(function (err) {
        q.reject(err);
        console.log(err);
      });

      return q.promise;
    },

    getVehicle: function () {
      var q = $q.defer();
      db('accident_transport_type')
      .orderBy('accident_transport_type_name')
      .then(function (rows) {
        q.resolve(rows);
      })
      .catch(function (err) {
        q.reject(err);
        console.log(err);
      });

      return q.promise;
    },

    getInfo: function (vn) {
      var q = $q.defer();
      var sql = 'select o.hn, o.vn, pt.pname, pt.lname, pt.fname, pt.birthday, ' +
        'timestampdiff(year, pt.birthday, o.vstdate) as age ' +
        'from er_nursing_detail as ed ' +
        'inner join ovst as o on o.vn=ed.vn ' +
        'inner join patient as pt on pt.hn=o.hn ' +
        'where ed.vn=?';
      db.raw(sql, [vn])
      .then(function (rows) {
        q.resolve(rows[0][0]);
      })
      .catch(function (err) {
        q.reject(err);
        console.log(err);
      });

      return q.promise;
    },

    saveAccident: function (items) {
      var q = $q.defer();
      db('node_accident')
      .insert(items)
      .then(function () {
        q.resolve()
      })
      .catch(function (err) {
        q.reject(err)
      });

      return q.promise;
    },

    updateAccident: function (items) {
      var q = $q.defer();
      db('node_accident')
      .where('vn', items.vn)
      .update({
        adate: items.adate,
        atime: items.atime,
        acc_prov: items.acc_prov,
        acc_amp: items.acc_amp,
        acc_tam: items.acc_tam,
        vehicle1: items.vehicle1,
        vehicle2: items.vehicle2,
        road: items.road,
        road_area: items.road_area,
        type_road: items.type_road
      })
      .then(function () {
        q.resolve()
      })
      .catch(function (err) {
        q.reject(err)
      });

      return q.promise;
    },

    getOtherInfo: function (vn) {
      var q = $q.defer();

      db('node_accident')
      .where('vn', vn)
      .limit(1)
      .then(function (rows) {
        q.resolve(rows[0])
      })
      .catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    },

    checkDuplicated: function (vn) {
      var q = $q.defer();

      db('node_accident')
      .where('vn', vn)
      .count('* as total')
      .then(function (rows) {
        q.resolve(rows[0].total)
      })
      .catch(function (err) {
        q.reject(err);
      });

      return q.promise;
    }

  }

})
