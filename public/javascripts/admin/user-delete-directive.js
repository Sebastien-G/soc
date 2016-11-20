(function() {
  'use strict';

  var sgConfirmUserDeleteModule = angular.module('sgConfirmUserDeleteModule', [])

  .directive('confirmUserDelete', ['$window', '$timeout', '$log', function($window, $timeout, $log) {
    return {
      restrict: 'E',
      link: function (scope, element, attrs) {
        element.on('click', function() {
          //$log.debug('%cYou clicked on something', 'color:#fff;font-size:1.5em;');

          if ($window.confirm('Cette action supprimera l’utilisateur de toutes les collections.\n CETTE ACTION EST IRREVERSIBLE')) {
            //$log.debug('Delete');
            scope.confirmUserDeleteCtrl.deleteUser();
          } else {
            //$log.debug('Hold');
          }
        });
      },
      scope: {
        userId: '@'
      },
      controller: ['$window', '$http', '$log', function($window, $http, $log) {
        var self = this;
        var debug = true;

        this.userId;

        this.deleteUser = function() {
          $log.debug('this.userId: ' + this.userId);
          $http({
            method: 'POST',
            url: '/admin/api/user/delete',
            data: {
              '_id' : self.userId
            }
          }).then(function (response) {
            debug && $log.debug('HTTP success');
            debug && $log.debug(response);
            if (response.data.status === 'failure') {
              debug && $log.debug('Operation failed');
            } else {
              debug && $log.debug('Operation SUCCESS');
              $window.location.href = '/admin/users';
            }
          }, function (response) {
            debug && $log.debug('$http request error:');
            debug && $log.debug(response);
          });
        };
      }],
      controllerAs: 'confirmUserDeleteCtrl',
      template: '<button type="button" ng-click="confirmUserDeleteCtrl.confirmUserDelete()"><i class="icon fa fa-remove"></i></button>',
      bindToController: true
    };
  }])
  ;

  angular.module('app').requires.push('sgConfirmUserDeleteModule');
}());
