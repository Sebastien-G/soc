(function() {
  'use strict';

  var sgChatModule = angular.module('sgChatModule', []);

  sgChatModule.service('socket', ['$rootScope', '$log', function ($rootScope, $log) {

    var self = this;
    var debug = true;

    //var socket = io.connect();
    var socket = io('ws://' + window.location.host + '/monitor');

    $log.debug(socket);

    this.on = function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    };

    this.emit = function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    };
  }]); // socket service


  sgChatModule.controller('chatController', ['$scope', 'socket', function($scope, socket) {

  }]); // chatController

  angular.module('app').requires.push('sgChatModule');
}());
