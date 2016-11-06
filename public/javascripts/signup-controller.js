(function() {
  'use strict';

  var signupModule = angular.module('signupModule', [])
  .controller('signupController', ['$window', '$http', '$log', function($window, $http, $log) {
    var debug = true;
    var self = this;

    $log.debug('signup contrtoller instanciated');

    this.formData = {
      'firstname': 'f',
      'lastname': 'l',
      'username': 'sebastienguillon@gmail.com',
      'username-repeat': 'sebastienguillon@gmail.com',
      'password': 'p'
    };

    this.save = function() {

      $http({
        method: 'POST',
        url: '/signup',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status == 'error') {
          debug && $log.debug(response.data.formData);
          if (response.data.error) {
            debug && $log.debug(response.data.error);
          }
        } else {
          $window.location.href = '/';
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });

    };

  }])
  ;

  angular.module('app').requires.push('signupModule');
}());
