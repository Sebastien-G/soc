angular.module('app.services', [])

.factory('focusField', ['$timeout', '$window', function($timeout, $window) {
  return function(id) {
    /* http://stackoverflow.com/a/25597540/1347953 */
    // timeout makes sure that it is invoked after any other event has been triggered.
    // e.g. click events that need to run before the focus or
    // inputs elements that are in a disabled state but are enabled when those events
    // are triggered.
    $timeout(function() {
      var element = $window.document.getElementById(id);
      if(element)
        element.focus();
    });
  };
}])


.service('socketIoService', ['$rootScope', '$log', function ($rootScope, $log) {

  var self = this;
  var debug = false;

  //var socket = io.connect();
  var socket = io('ws://' + window.location.host + '/monitor');

  debug && $log.debug(socket);

  this.on = function (eventName, callback) {
    socket.on(eventName, function () {
      var args = arguments;
      $rootScope.$apply(function () {
        callback.apply(socket, args);
      });
    });
  };

  this.emit = function (eventName, data, callback) {
    socket.emit(eventName, data, function () {
      var args = arguments;
      $rootScope.$apply(function () {
        if (callback) {
          callback.apply(socket, args);
        }
      });
    })
  };
}]) // socketIoService service



.service('chatModalService', ['$rootScope', '$modal', '$log', function($rootScope, $modal, $log) {

  var self = this;
  var debug = true;

  this.fromUid;
  this.toUid;
  this.message = 'dz dz ';
  this.placeholder = 'test (this)';

  this.open = function (size, backdrop, closeOnClick, fromUid, toUid) {

    var params = {
      templateUrl: '/templates/chat-modal.html',
      controllerAs: 'chatModalCtrl',
      controller: ['$modalInstance', 'socketIoService', 'focusField', function($modalInstance, socketIoService, focusField) {

        var chat = this;

        this.placeholder = '';
        this.message = '';
        this.messages = [];
        this.user;
        this.toUser;
        this.ready = false;

        this.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        this.init = function () {
          debug && $log.debug('init modal');

          socketIoService.emit('getChatUser', {
            fromUid: fromUid,
            toUid: toUid
          });
        };

        socketIoService.on('chatUser', function (data) {
          chat.user = data.user;
          chat.toUser = data.toUser;
          chat.ready = true;
          chat.placeholder = 'Envoyez un message à ' + data.toUser.firstname + ' ' + data.toUser.lastname;
        });

        this.send = function() {
          if (chat.ready) {
            if (chat.message.trim() != '') {
              chat.messages.push({
                from: chat.user.firstname,
                content: chat.message
              });
              debug && $log.debug('Send to toUid: ' + toUid);
              debug && $log.debug(chat.messages);
              socketIoService.emit('chatMessage', {
                toUid: toUid,
                message: chat.message
              });
              chat.message = '';
              focusField('chat-message');
            }
          }
        };

        socketIoService.on('chatMessage', function (data) {
          chat.messages.push({
            from: data.fromUser.firstname,
            content: data.message
          });
        });

        this.init();
      }]
    }; // params

    if(angular.isDefined(fromUid)) {
      self.fromUid = fromUid;
    }

    if(angular.isDefined(toUid)) {
      self.toUid = toUid;
    }

    if(angular.isDefined(closeOnClick)) {
      params.closeOnClick = closeOnClick;
    }

    if(angular.isDefined(size)) {
      params.size = size;
    }

    if(angular.isDefined(backdrop)) {
      params.backdrop = backdrop;
    }

    var modalInstance = $modal.open(params);


    modalInstance.result.then(function(selectedItem) {
      //$scope.selected = selectedItem;
    }, function() {
      debug && $log.debug('Modal dismissed at: ' + new Date());
    });
  }; // this.open

}]) // chatModalService
