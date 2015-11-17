window.$ = window.jQuery = require('jquery');
require('angular');
require('angular-ui-router');
require('../vendor/ngprogress/build/ngprogress.min.js')

var _ = require('lodash');
var moment = require('moment');
var fse = require('fs-extra');
var ipc = require('ipc');
var Q = require('q');
require('q-foreach')(Q);

angular.module('app', [
    'ui.router',
    'ngProgress',
    'app.controllers.Settings',
    'app.controllers.Main',
    'app.controllers.Info'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");

    $stateProvider
      .state('main', {
        url: "/",
        templateUrl: "partials/main.html",
        controller: 'MainController'
      })
      .state('settings', {
        url: "/settings",
        templateUrl: "partials/settings.html",
        controller: 'SettingsController'
      })
      .state('info', {
        url: "/info/:vn",
        templateUrl: "partials/info.html",
        controller: 'InfoController'
      })
  });
