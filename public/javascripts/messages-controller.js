(function() {
  'use strict';

  var sgMessagesModule = angular.module('sgMessagesModule', [])
  .controller('messagesController', ['$http', '$log', '$q', '$interval', function($http, $log, $q, $interval) {
    var debug = false;
    var self = this;

    debug && $log.debug('messagesController instanciated');
    this.compose = '';
    this.inboxMessages = [];
    this.sentMessages = [];
    this.tos = [];
    this.sendErrorMessage = [];

    this.tabInbox = function () {
      this.getIncoming();
    }; // tabInbox

    this.tabSent = function () {
      this.getSent();
    }; // tabSent

    this.tabCompose = function () {

    }; // tabCompose

    this.send = function () {
      this.sendErrorMessage = [];

      var toUids = [];
      var sendError = false;
      if (this.compose.trim() === '') {
        sendError = true;
        this.sendErrorMessage.push('Veuillez saisir un message');
      }

      if (this.tos.length === 0) {
        sendError = true;
        this.sendErrorMessage.push('Veuillez saisir un destinataire');
      } else {
        this.tos.forEach(function(element) {
          toUids.push(element.uid);
        });
      }

      debug && $log.debug(toUids);

      if (!sendError) {
        debug && $log.debug('Send it!');

        var postData = {
          content: this.compose,
          toUids : toUids
        };
        $http({
          method: 'POST',
          url: '/api/messages/send',
          data: postData
        }).then(function (response) {
          debug && $log.debug(response);
          if (response.data.status === 'success') {
            self.compose = '';
            self.tos = [];
          }
        }, function (response) {
          debug && $log.debug('$http request error:');
          debug && $log.debug(response);
        });
      }
    }; // send

    this.getIncoming = function() {
      $http({
        method: 'GET',
        url: '/api/messages/get/received'
      }).then(function (response) {
          self.inboxMessages = response.data.results;
          debug && $log.debug(self.inboxMessages);
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });
    };


    this.getSent = function() {
      $http({
        method: 'GET',
        url: '/api/messages/get/sent'
      }).then(function (response) {
          self.sentMessages = response.data.results;
          debug && $log.debug(self.sentMessages);
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });
    };

    this.selectedObjectCallback = function(obj) {
      debug && $log.debug('selectedObjectCallback');
      debug && $log.debug(obj);

      self.tos.push(obj.originalObject);
    }


  }])
  ;

  angular.module('app').requires.push('sgMessagesModule');
}());
