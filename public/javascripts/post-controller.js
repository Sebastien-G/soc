(function() {
  'use strict';

  var sgPostModule = angular.module('sgPostModule', [])
  .controller('postController', ['$http', '$log', '$q', '$interval', function($http, $log, $q, $interval) {
    var debug = false;
    var self = this;

    debug && $log.debug('post contrtoller instanciated');
    this.posts = [];
    this.newPosts = [];
    this.nbNewPosts = 0;
    this.alertTextSingular = 'nouveau message';
    this.alertTextPlural = 'nouveaux messages';
    this.alertText = this.alertTextSingular;

    this.formData = {
      'message': ''
    };

    this.getPosts = function(initial) {
      $http({
        method: 'GET',
        url: '/post',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('initial: ' + initial);
        if (initial) {

          debug && $log.debug('response.data.posts');
          self.posts = response.data.posts;
        } else {
          if (response.data.posts.length > self.posts.length ) {
            self.newPosts = response.data.posts;

            if (self.newPosts.length > 0) {
              self.nbNewPosts = self.newPosts.length - self.posts.length;
              if (self.nbNewPosts === 1) {
                self.alertText = self.alertTextSingular;
              } else {
                self.alertText = self.alertTextPlural;
              }
            }
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

        // debug && $log.debug('Yo!');
      }, 5000);
    }
    this.init();

    this.save = function() {
      debug && $log.debug('Post a post');
      debug && $log.debug(self.formData);

      $http({
        method: 'POST',
        url: '/post',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'error') {
          debug && $log.debug('Crap');
        }
        if (response.data.status === 'success') {
          self.formData.message = '';
          self.posts = response.data.posts;
          debug && $log.debug(self.posts);
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
