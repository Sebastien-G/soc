angular.module('app.directives', [])

.directive('friendIcon', ['$log', function($log) {
  return {
    restrict: 'E',
    /*scope: {
      uid: '@',
      action: '@',
      friendshipStatus: '@'
    },*/
    controller: ['$log', function($log) {
      var self = this;
      var debug = true;
    }],
    controllerAs: 'friendIconCtrl',
    templateUrl: '/templates/friend-icon.html',
    bindToController: true
  }
}])

.directive('buttonAddFriend', ['$timeout', '$log', function($timeout, $log) {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      element.on('click', function() {
        //$log.debug('%cYou clicked on something', 'color:#fff;font-size:1.5em;');

        scope.buttonAddFriendCtrl.friendshipStatus = 'wait';
        scope.$apply();


        //$timeout(function() {

          switch (scope.buttonAddFriendCtrl.action) {
            case 'add':
              scope.buttonAddFriendCtrl.invite();
              break;

            case 'accept':
              scope.buttonAddFriendCtrl.acceptInvitation();
              break;

            case 'remove':
              scope.buttonAddFriendCtrl.removeFriend();
              break;

            case 'cancel':
              scope.buttonAddFriendCtrl.cancelRequest();
              break;

            default:
              console.log('no action');
              break;
          } // switch


        //}, 200);
      });
    },
    scope: {
      uid: '@',
      action: '@',
      friendshipStatus: '@'
    },
    controller: ['$http', '$log', function($http, $log) {
      var self = this;
      var debug = true;

      this.invite = function() {
        $http({
          method: 'POST',
          url: '/api/friendships/sendFriendRequest',
          data : {
            uid: self.uid
          }
        }).then(function (response) {
          debug && $log.debug('HTTP success');
          debug && $log.debug(response);
          self.friendshipStatus = 'pending';
          self.action = 'cancel';
        }, function (response) {
          debug && $log.debug('$http request error:');
          debug && $log.debug(response);
        });
      }; // addFriend

      this.acceptInvitation = function() {
        $http({
          method: 'POST',
          url: '/api/friendships/acceptInvitation',
          data : {
            uid: self.uid
          }
        }).then(function (response) {
          debug && $log.debug('HTTP success');
          debug && $log.debug(response);
          self.friendshipStatus = 'friends';
          self.action = 'remove';
        }, function (response) {
          debug && $log.debug('$http request error:');
          debug && $log.debug(response);
        });
      }; // acceptInvitation

      this.removeFriend = function() {
        $http({
          method: 'POST',
          url: '/api/friendships/removeFriend',
          data : {
            uid: self.uid
          }
        }).then(function (response) {
          debug && $log.debug('HTTP success');
          debug && $log.debug(response);
          self.friendshipStatus = 'none';
          self.action = 'add';
        }, function (response) {
          debug && $log.debug('$http request error:');
          debug && $log.debug(response);
        });
      }; // removeFriend


      this.cancelRequest = function() {
        $http({
          method: 'POST',
          url: '/api/friendships/cancelFriendRequest',
          data : {
            uid: self.uid
          }
        }).then(function (response) {
          debug && $log.debug('HTTP success');
          debug && $log.debug(response);
          self.friendshipStatus = 'none';
          self.action = 'add';
        }, function (response) {
          debug && $log.debug('$http request error:');
          debug && $log.debug(response);
        });
      }; // cancelRequest


    }],
    controllerAs: 'buttonAddFriendCtrl',
    templateUrl: '/templates/friend-add-button.html',
    bindToController: true
  };
}]);
