(function() {
  'use strict';

  var profileModule = angular.module('profileModule', [])
  .controller('profileController', ['$window', '$http', '$log', '$q', function($window, $http, $log, $q) {
    var debug = true;
    var self = this;

    $log.debug('profile contrtoller instanciated');

    this.formData = {
      'about': ''
    };

    this.save = function() {
      $http({
        method: 'POST',
        url: '/profile',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'error') {
          //debug && $log.debug(response.data.formData);
          if (response.data.error && response.data.error === 'UserExists') {
          }
        } else {
          $window.location.href = '/?confirm=signup';
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });
    };
  }])
  ;

  angular.module('app').requires.push('profileModule');
}());
