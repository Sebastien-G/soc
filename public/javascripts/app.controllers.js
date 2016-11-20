angular.module('app.controllers', [])

.controller('topBarController', ['$log', function ($log) {
  this.tooltips = {
    profile: 'Profile',
    messages: 'Messages',
    notifications: 'Notifications',
    invitations: 'Invitations',
    settings: 'Réglages'
  }

  this.notifications = [
    'New messages',
    'New friend requests'
  ];
}]) // TopBarController


.controller('searchController', ['$log', '$window', function ($log, $window) {
  var self = this;
  var debug = false;

  debug && $log.debug('searchController');

  this.selectedObjectCallback = function(obj) {
    debug && $log.debug('selectedObjectCallback');
    debug && $log.debug(obj);

    $window.location = '/user/' + obj.originalObject.uid;
  }
}]) // searchController


.controller('activityController', ['$scope', '$log', '$timeout', '$attrs', 'socketIoService', 'chatModalService', function ($scope, $log, $timeout, $attrs, socketIoService, chatModalService) {
  var self = this;
  var debug = true;

  debug && $log.debug('activityController');

  this.nbLoggedInMessage = '';
  this.nbOthersLoggedInMessage = '';
  this.nbOnlineUserMessages = '';
  this.onlineFriends = [];

  socketIoService.on('error', function(data) {
    debug && $log.debug('Socket.io Error:');
    debug && $log.debug(data);
  });

  socketIoService.on('activityStatus', function(data) {
    debug && $log.debug('Updating activity status...');

    if (data.nbOnlineUsers > 0) {
      data.nbOnlineUsers--; // Me - 1
    }

    self.onlineFriends = data.onlineFriends;
    if (data.nbOnlineUsers === 0) {
      self.nbOnlineUserMessages = '😟 Aucun autre utilisateur n’est actuellement en ligne';
    } else {
      if (data.nbOnlineUsers === 1) {
        self.nbOnlineUserMessages = '🙂 1 autre utilisateur est actuellement en ligne';
      } else {
        self.nbOnlineUserMessages = '🙂 ' + data.nbOnlineUsers + ' autres utilisateurs sont actuellement en ligne';
      }
    }

    if (data.nbLoggedIn === 0) {
      self.nbLoggedInMessage = 'Aucun membre n’est actuellement connecté';
      self.nbOthersLoggedInMessage = '🙁 Aucun autre membre n’est actuellement connecté';
    } else {
      if (data.nbLoggedIn === 1) {
        self.nbLoggedInMessage = '1 membre est actuellement connecté';
        self.nbOthersLoggedInMessage = '🙁 Aucun autre membre n’est actuellement connecté';
      } else {
        self.nbLoggedInMessage = data.nbLoggedIn + ' membres sont actuellement connectés';
        if ((data.nbLoggedIn - 1) === 1) {
          self.nbOthersLoggedInMessage = '😄 1 autre membre est actuellement connecté';
        } else {
          self.nbOthersLoggedInMessage = '😄 ' + (data.nbLoggedIn - 1) + ' autres membres sont actuellement connectés';
        }
      }
    }

    if (data.onlineFriends.length > 0) {
      debug && $log.debug('Here are your friends');
      debug && $log.debug(data.onlineFriends);
    }

    $timeout(function() {
      self.updateNbLoggedIn();
    }, 4000);
  });

  this.updateNbLoggedIn = function() {
    socketIoService.emit('getActivityStatus');
  }

  this.updateNbLoggedIn();
}]) // activityController


.controller('chatRequestController', ['$log', 'socketIoService', 'chatModalService', function($log, socketIoService, chatModalService) {

  var self = this;
  var debug = true;

  this.request = function (fromUid, toUid) {
    socketIoService.emit('startChat', {
      fromUid: fromUid,
      toUid: toUid
    });
    chatModalService.open('small', true, false, fromUid, toUid);
  };
}]) // chatRequestController


.controller('chatController', ['$log', 'socketIoService', 'chatModalService', function($log, socketIoService, chatModalService) {

  var self = this;
  var debug = true;

  socketIoService.on('chatRequest', function(data) {
    debug && $log.debug('%cchatRequest', 'font-size:1.5rem;color:#ff0;');
    debug && $log.debug(data);
    chatModalService.open('small', true, false, data.fromUid, data.toUid);
  });

}]) // cha


.controller('friendController', ['$http', '$log', '$window', function ($http, $log, $window) {
  var self = this;

  $log.debug('friendController');
}]);
