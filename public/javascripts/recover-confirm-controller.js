(function() {
  'use strict';

  var recoverConfirmModule = angular.module('recoverConfirmModule', [])

  .controller('recoverConfirmController', ['$window', '$location', '$http', '$log', '$q', function($window, $location, $http, $log, $q) {
    var debug = true;
    var self = this;

    $log.debug('recoverConfirmModule contrtoller instanciated');
    $log.debug($location.search());

    this.formData = {
      'password': '',
      'password-repeat': '',
      'id': ''
    };
    this.errorMessage = null;

    this.save = function() {
      self.errorMessage = null;
      console.log(self.formData.id);

      $http({
        method: 'POST',
        url: '/recover/confirm',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'failure') {
          self.errorMessage = 'Le formulaire comporte des erreurs';
        } else {
          if (response.data.status === 'success') {
            $window.location.href = '/login';
          }
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });

    };
  }])
  ;

  recoverConfirmModule.directive('compareTo', function() {
    return {
      require: 'ngModel',
      scope: {
        otherModelValue: '=compareTo'
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          if (modelValue != '' && modelValue == scope.otherModelValue) {
            console.log('B');
            return true;
          } else {
            return false;
          }
        };

        scope.$watch('otherModelValue', function() {
          ngModel.$validate();
        });
      }
    };
  });


  angular.module('app').requires.push('recoverConfirmModule');
}());
