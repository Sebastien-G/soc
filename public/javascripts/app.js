'use strict';

angular.module('app', ['app.services', 'app.controllers', 'app.directives', 'mm.foundation', 'ngAnimate', 'ngMessages', 'angucomplete-alt'])

.config(['$logProvider', '$compileProvider', function($logProvider, $compileProvider) {
  var displayDebugInfo = true; // true | false
  $logProvider.debugEnabled(displayDebugInfo);
  $compileProvider.debugInfoEnabled(displayDebugInfo);
}])

/*
// http://stackoverflow.com/questions/17246309/get-all-user-defined-window-properties
(function () {
    var results, currentWindow,
    // create an iframe and append to body to load a clean window object
    iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    // get the current list of properties on window
    currentWindow = Object.getOwnPropertyNames(window);
    // filter the list against the properties that exist in the clean window
    results = currentWindow.filter(function(prop) {
        return !iframe.contentWindow.hasOwnProperty(prop);
    });
    // log an array of properties that are different
    console.log(results);
    document.body.removeChild(iframe);
}());
*/
