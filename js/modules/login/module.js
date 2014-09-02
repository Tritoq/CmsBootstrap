/**
 * Created by arturmagalhaes on 20/08/14.
 */
define([
    'angular',
    'routes',
    'ngAnimate',
    'jquery-ui',
    'ui.bootstrap',
    'ui.bootstrap.tpls'
], function (angular, routes) {
    'use strict';
    var $app = angular.module('app.login', ['ngAnimate', 'ui.bootstrap']);


    /*
        Factory, serviço se autentição
     */

    $app.factory('AuthService', function ($http, Session) {

        var authService = {};

        authService.login = function (credentials) {

            var request = $http.post(routes.auth, credentials);
            request.then(
                function (res) {
                    var data = res.data;

                    if(data.auth_result) {
                        Session.create(data.session_id, data.user.id, data.user.role);
                        return data.user;
                    } else {
                        return false;

                    }
                },
                function (res) {
                    throw "Username/Passowrd incorret";
                }
            );

            return request;
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        }

        authService.isAuthorized = function (authorizedRoles) {
            if(!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }

            return (authService.isAuthenticated() && authService.indexOf(Session.userRole) !== -1);
        };

        return authService;
    });


    /*
        Services
     */

    $app.service('Session', function () {
        this.create = function (sessionId, userId, userRole) {
            this.id = sessionId;
            this.userId = userId;
            this.userRole = userRole;
        };

        this.destroy = function () {
            this.id = null;
            this.userId = null;
            this.userRole = null;
        };

        return this;
    });

    /*
        Constants
     */
    $app.constant('USER_ROLES', {
        all: '*',
        admin: 'admin',
        'super': 'super',
        guest: 'guest'
    });

    $app.constant('AUTH_EVENTS', {
        loginProcess: 'auth-login-process',
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    });

    return $app;
});