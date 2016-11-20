(function() {
  'use strict';

  var recoverModule = angular.module('recoverModule', [])

  .controller('recoverController', ['$window', '$http', '$log', '$q', function($window, $http, $log, $q) {
    var debug = true;
    var self = this;

    $log.debug('recover contrtoller instanciated');

    this.formData = {
      'username': ''
    };
    this.errorMessage = null;

    this.save = function() {
      self.errorMessage = null;
      $http({
        method: 'POST',
        url: '/recover',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'failure') {
          self.errorMessage = 'Cette adresse e-mail ne correspond à aucun compte';
        } else {
          $window.location.href = '/?confirm=recover';
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });
    };
  }])
  ;



  angular.module('app').requires.push('recoverModule');
}());
