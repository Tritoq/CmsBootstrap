/**
 * loads sub modules and wraps them up into the main module.
 * This should be used for top-level module definitions only.
 */
define([
    'angular',
    './modules/app/app.controller',
    './modules/app/notify.controller'
], function (angular) {
    'use strict';
    return angular.module('main', ['app.main']);
});