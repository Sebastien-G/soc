(function() {
  'use strict';

  var sgPostModule = angular.module('sgPostModule', [])
  .controller('postController', ['$http', '$log', '$q', '$interval', function($http, $log, $q, $interval) {
    var debug = true;
    var self = this;

    $log.debug('post contrtoller instanciated');
    this.posts = [];
    this.newPosts = [];
    this.nbNewPosts = 0;

    this.formData = {
      'message': 'nothing'
    };

    this.getPosts = function(initial) {
      $http({
        method: 'GET',
        url: '/post',
        data : self.formData
      }).then(function (response) {
        $log.debug('initial: ' + initial);
        if (initial) {

          $log.debug('response.data.posts');
          self.posts = response.data.posts;
        } else {
          if (response.data.posts.length > self.posts.length ) {
            self.newPosts = response.data.posts;
          }
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });
    };

    this.addNewPosts = function() {
      this.posts = angular.copy(this.newPosts);
      this.newPosts = [];
    };

    this.init = function () {
      this.getPosts(true);

      $interval(function () {
        self.getPosts(false);
        if (self.newPosts.length > 0) {
          self.nbNewPosts = self.newPosts.length - self.posts.length;
        }
        $log.debug('Yo!');
      }, 5000);
    }
    this.init();

    this.save = function() {
      $log.debug('Post a post');
      $log.debug(self.formData);

      $http({
        method: 'POST',
        url: '/post',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'error') {
          $log.debug('Crap');
        }
        if (response.data.status === 'success') {
          self.posts = response.data.posts;
          $log.debug(self.posts);
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });

    };
  }])
  ;

  angular.module('app').requires.push('sgPostModule');
}());