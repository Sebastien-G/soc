(function() {
  'use strict';

  var profileModule = angular.module('profileModule', ['ngFileUpload'])
  .controller('profileController', ['$window', '$http', '$log', '$q', function($window, $http, $log, $q) {
    var debug = true;
    var self = this;

    $log.debug('profile contrtoller instanciated');

    this.formData = {
      'about': ''
    };

    this.save = function() {
      $http({
        method: 'POST',
        url: '/profile',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'error') {
          //debug && $log.debug(response.data.formData);
          if (response.data.error && response.data.error === 'UserExists') {
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


  .controller('pictureUploadController', ['$log', 'Upload',function($log, Upload){
    var self = this;

    this.submitUpload = function() { //function to call on form submit
      if (self.ImageUploadform.file.$valid && self.file) { //check if from is valid
        self.upload(self.file); //call upload function
      }
    }

    this.upload = function (file) {
      Upload.upload({
        url: '/profile/picture', //webAPI exposed to upload the file
        data: {
          file:file
        } //pass file as data, should be user ng-model
      }).then(function (resp) { //upload function returns a promise
        if(resp.data.error_code === 0){ //validate success
          $log.debug('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
        } else {
          $log.debug('an error occured');
        }
      }, function (resp) { //catch error
        console.log('Error status: ' + resp.status);
        $log.debug('Error status: ' + resp.status);
      }, function (evt) {
        console.log(evt);
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        self.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
      });
    };
  }])
  ;

  angular.module('app').requires.push('profileModule');
}());
