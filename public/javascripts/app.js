(function() {
  'use strict';

  var app = angular.module('app', ['mm.foundation', 'ngMessages']);

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

  //var appControllers = angular.module('app.controllers', [])
  // app.controller('module2Controller', ['$timeout', function($timeout) {
  //   this.name = '$timeout controller';
  // }]);

}());
