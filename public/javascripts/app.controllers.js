angular.module('app.controllers', [])

.controller('TopBarController', ['$scope', function ($scope) {
  this.header = {
    profile: 'Profile',
    messages: 'Messages',
    invitations: 'Invitations',
    params: 'Réglages'
  }
}])


.controller('searchController', ['$log', '$window', function ($log, $window) {
  var self = this;
  var debug = true;

  debug && $log.debug('searchController');

  this.selectedObjectCallback = function(obj) {
    $log.debug('selectedObjectCallback');
    $log.debug(obj);

    $window.location = '/user/' + obj.originalObject.uid;
  }
}])


.controller('connectedController', ['$log', '$timeout', '$attrs', 'activityMonitor', function ($log, $timeout, $attrs, activityMonitor) {
  var self = this;
  var debug = true;

  debug && $log.debug('connectedController');

  this.nbLoggedInMessage = '...';
  this.nbOnlineUserMessages = '...';

  var friend = {
    firstname: 'Sébastien',
    lastname: 'Guillon',
    profilePicUrl: '/images/profile/4429713c-f0ed-42db-83c3-de27e88a25a9_50.png',
    uid: 'HyZq7HTxg',
    profileUrl: '/user/HyZq7HTxg'
  }
  this.onlineFriends = [friend];

  activityMonitor.on('error', function(data) {
    console.log('Socket.io ERROR');
    console.log(data);

  });

  activityMonitor.on('nbLoggedIn', function(data) {
    console.log('Answer coming in');
    if (data.nbOnlineUsers === 0) {
      self.nbOnlineUserMessages = 'Aucun autre utilisateur n’est actuellement en ligne';
    } else {
      if (data.nbOnlineUsers === 1) {
        self.nbOnlineUserMessages = '1 autre utilisateur est actuellement en ligne';
      } else {
        self.nbOnlineUserMessages = data.nbOnlineUsers + ' autres utilisateurs sont actuellement en ligne';
      }
    }


    if (data.nbLoggedIn === 0) {
      self.nbLoggedInMessage = 'Aucun autre membre n’est actuellement connecté';
    } else {
      if (data.nbLoggedIn === 1) {
        self.nbLoggedInMessage = '1 autre membre est actuellement connecté';
      } else {
        self.nbLoggedInMessage = data.nbLoggedIn + ' autres membres sont actuellement connectés';
      }
    }

    $timeout(function() {
      console.log('4 sec have elapsed');
      self.updateNbLoggedIn();
    }, 4000);
  });

  this.updateNbLoggedIn = function() {
    activityMonitor.emit('getNbLoggedIn');
  }

  this.updateNbLoggedIn();
}])


.controller('activityController', ['$log', 'activityMonitor', function ($log, activityMonitor) {
  var self = this;
  var debug = true;

  debug && $log.debug('activityController');

  this.messages = [];

  activityMonitor.on('greetings', function (data) {
    self.messages.push(data.message);
  });

}])


.controller('friendController', ['$http', '$log', '$window', function ($http, $log, $window) {
  var self = this;

  $log.debug('friendController');
}]);
