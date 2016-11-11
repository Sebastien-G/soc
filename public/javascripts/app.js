(function() {
  'use strict';

  var app = angular.module('app', ['mm.foundation', 'ngMessages', 'angucomplete-alt']);

  app.config(function () {
    //
  });

  app.controller('tooltipsController', [function() {
    this.header = {
      profile: 'Profile',
      messages: 'Messages',
      invitations: 'Invitations',
      params: 'Réglages'
    }
    // this.dynamicTooltipText = 'dynamic';
    // this.htmlTooltip = "I've been made <b>bold</b>!";
  }]);


  app.controller('searchController', ['$scope', '$http', '$rootScope', '$log', function ($scope, $http, $rootScope, $log) {
    var self = this;

    this.selectedObjectCallback = function() {
      $log.debug('selectedObjectCallback');
    }
  }]);

  //var appControllers = angular.module('app.controllers', [])
  // app.controller('module2Controller', ['$timeout', function($timeout) {
  //   this.name = '$timeout controller';
  // }]);

}());
