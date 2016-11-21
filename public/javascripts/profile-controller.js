(function() {
  'use strict';

  var profileModule = angular.module('profileModule', ['ngFileUpload'])
  //
  // .directive('fileButton', function() {
  //   return {
  //     link: function(scope, element, attributes) {
  //
  //       var el = angular.element(element)
  //       var button = el.children()[0]
  //
  //       el.css({
  //         position: 'relative',
  //         overflow: 'hidden',
  //         width: button.offsetWidth,
  //         height: button.offsetHeight
  //       })
  //
  //       var fileInput = angular.element('<input type="file" multiple ngf-select ng-model="pictureUploadCtrl.file" name="file" accept="image/*" ngf-max-size="5MB" />');
  //
  //       fileInput.css({
  //         position: 'absolute',
  //         top: 0,
  //         left: 0,
  //         'z-index': '2',
  //         width: '100%',
  //         height: '100%',
  //         opacity: '0',
  //         cursor: 'pointer'
  //       });
  //
  //       el.append(fileInput);
  //     }
  //   }
  // })


  .controller('profileController', ['$window', '$http', '$log', '$q', function($window, $http, $log, $q) {
    var debug = true;
    var self = this;

    $log.debug('profileController instanciated');
    self.msg = '';
    self.saveSuccess = false;

    this.formData = {
      'about': '',
      'gender': '',
    };

    this.get = function() {
      $http({
        method: 'GET',
        url: '/api/profile/get'
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'error') {

        } else {
          if (response.data.status === 'success') {
            debug && $log.debug('GET operation successful');
            debug && $log.debug(response.data.results);
            self.formData = response.data.results[0];
          }
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });
    };
    this.get();

    this.save = function() {
      self.saveSuccess = false;
      self.msg = '';
      $http({
        method: 'POST',
        url: '/api/profile/save',
        data : self.formData
      }).then(function (response) {
        debug && $log.debug('HTTP success');
        debug && $log.debug(response);
        if (response.data.status === 'error') {

        } else {
          if (response.data.status === 'success') {
            self.saveSuccess = true;
            self.msg = 'Votre profile a bien été enregistré';
          }
        }
      }, function (response) {
        debug && $log.debug('$http request error:');
        debug && $log.debug(response);
      });
    };
  }])


  .controller('pictureUploadController', ['$window', '$log', 'Upload', function($window, $log, Upload){
    var debug = true;
    var self = this;
    self.progressPercentage = 0;
    self.msg = '';
    self.uploadSuccess = false;

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
          $log.debug('Success ' + resp.config.data.file.name + ' uploaded. Response: ');
          self.uploadSuccess = true;
          self.msg = 'Votre image de profile a bien été mise à jour';
        } else {
          $log.debug('an error occured');
        }
      }, function (resp) { //catch error
        debug && $log.debug('Error status: ' + resp.status);
        $log.debug('Error status: ' + resp.status);
      }, function (evt) {
        debug && $log.debug(evt);
        self.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        debug && $log.debug('progress: ' + self.progressPercentage + '% ' + evt.config.data.file.name);
        self.progress = 'progress: ' + self.progressPercentage + '% '; // capture upload progress
        if (self.progressPercentage === 100) {
          // $window.location.href = '/profile';
        }
      });
    };
  }])
  ;

  angular.module('app').requires.push('profileModule');
}());
