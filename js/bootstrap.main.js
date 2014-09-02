define([
    'angular',
    'config',
    './app'
], function (angular, config) {
    'use strict';

    // You can place operations that need to initialize prior to app start here
    // using the `run` function on the top-level module

    // as script is at the very bottom of the page no waiting for domReady

    // Set the default format
    config.view.defaultFormat = 'php';

    angular.bootstrap(document, ['main']);
});