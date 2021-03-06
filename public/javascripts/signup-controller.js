(function() {
  'use strict';

  var signupModule = angular.module('signupModule', [])

  .controller('signupController', ['$window', '$http', '$log', '$q', function($window, $http, $log, $q) {
    var debug = true;
    var self = this;

    $log.debug('signup contrtoller instanciated');

    this.formData = {
      'firstname': '',
      'lastname': '',
      'username': '',
      'usernameTaken': '',
      'username-repeat': '',
      'password': '',
      'birthday': '0',
      'birthmonth': '0',
      'birthyear': '0',
      'gender': ''
    };

    this.save = function() {

      $http({
        method: 'POST',
        url: '/signup',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'error') {
          //debug && $log.debug(response.data.formData);
          if (response.data.error && response.data.error === 'UserExists') {
            self.signupForm.username.$error.compareToExists = true;
            console.log('response.data.formData.username: ' + response.data.formData.username);
            self.usernameTaken = response.data.formData.username;
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


/*
  signupModule.directive('nonZero', function(){
    return {
     restrict: 'A',
     require: 'ngModel',
     link: function(scope, element, attributes, ngModel){

        // add a parser that will process each time the value is
        // parsed into the model when the user updates it.
        ngModel.$parsers.unshift(function(modelValue) {
          if(modelValue){
            // test and set the validity after update.
            //var valid = modelValue.charAt(0) == 'A' || modelValue.charAt(0) == 'a';
            var valid;
            if (modelValue === 0 || modelValue === '0' || modelValue === '') {
              valid = false;
            }
            ngModel.$setValidity('nonZero', valid);
          }

          // if it's valid, return the modelValue to the model,
          // otherwise return undefined.
          return valid ? modelValue : undefined;
        });
      }
    }
  });*/

  signupModule.directive('compareToExists', function() {
    return {
      require: 'ngModel',
      scope: {
        usernameTakenValue: '=compareToExists'
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareToExists = function(modelValue2) {
          console.log('modelValue2: ' + modelValue2);
          console.log('scope.usernameTakenValue: ' + scope.usernameTakenValue);
          console.log((modelValue2 === scope.usernameTakenValue));
          if (modelValue2 === scope.usernameTakenValue) {
            console.log('A');
            return false;
          } else {
            console.log('A2');
            return true;
          }
        };

        scope.$watch('usernameTakenValue', function() {
          ngModel.$validate();
        });
      }
    };
  });


  signupModule.directive('compareTo', function() {
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

  angular.module('app').requires.push('signupModule');
}());
