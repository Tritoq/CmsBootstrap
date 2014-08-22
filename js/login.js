/**
 * Created by arturmagalhaes on 20/08/14.
 */
/**
 * loads sub modules and wraps them up into the main module.
 * This should be used for top-level module definitions only.
 */
define([
    'angular',
    './modules/login/app.controller',
    './modules/login/login.controller'
], function (angular) {
    'use strict';
    return angular.module('login', ['app.login']);
});