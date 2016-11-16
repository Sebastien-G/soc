angular.module('app.services', [])

.service('activityMonitor', ['$rootScope', '$log', function ($rootScope, $log) {

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
}]); // activityMonitor service
