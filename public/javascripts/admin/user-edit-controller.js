(function() {
  'use strict';

  var sgAdminUserEditModule = angular.module('sgAdminUserEditModule', [])
  .controller('userEditController', ['$http', '$window', '$log', '$q', '$interval', function($http, $window, $log, $q, $interval) {
    var debug = true;
    var self = this;

    debug && $log.debug('userEditController instanciated');
    this.alertText = '';
    this.user_id;

    var path = $window.location.pathname;
    debug && $log.debug('path: ' + path);
    var pathArray = path.split('/');
    this.user_id = pathArray[pathArray.length-1];
    debug && $log.debug(this.user_id);


    this.formData;

    this.get = function() {
      $http({
        method: 'GET',
        url: '/admin/api/user/get/' + self.user_id
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        if (response.data.status === 'error') {
          debug && $log.debug('Error');
        } else {
          debug && $log.debug(response);
          self.formData = response.data.results[0];
          debug && $log.debug(self.formData);
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });
    };
    this.get();

    this.save = function() {
      $http({
        method: 'POST',
        url: '/admin/api/user/save',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'error') {
          //debug && $log.debug(response.data.formData);
        } else {
          debug && $log.debug('status: SUCCESS');
          $window.location.href = '/admin/users';
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });
    };


  }])
  ;

  angular.module('app').requires.push('sgAdminUserEditModule');
}());
