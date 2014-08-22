/**
 * Created by arturmagalhaes on 20/08/14.
 */
define(['./module'], function(module) {
    'use strict';

    module.controller('ApplicationController', ['$scope', '$rootScope', '$timeout', '$window', 'AuthService', 'AUTH_EVENTS', 'USER_ROLES', function($scope, $rootScope, $timeout, $window, AuthService, AUTH_EVENTS, USER_ROLES) {

        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
        $scope.loading = false;

        $scope.error = false;
        $scope.warning = false;

        $scope.intervalId = null;

        $scope.attempt = 0;

        $scope.setCurrentUser = function (user) {
            $scope.currentUser = user;


        };

        $rootScope.$on(AUTH_EVENTS.loginProcess, function (event, data) {
            $scope.error = false;
            $scope.warning = false;
            $scope.loading = true;
        });

        $rootScope.$on(AUTH_EVENTS.loginFailed, function(event, data) {

            $scope.error = true;
            $scope.loading = false;

            $scope.attempt++;

            if($scope.attempt > 3) {
                $scope.warning = true;
            }

            $timeout.cancel($scope.intervalId);

            $scope.intervalId = $timeout(function () { $scope.error = false; }, 10000);

            $timeout(function () { $('#username').focus(); }, 500);
        });

        $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event,data) {
            $window.location.href = "app.html";
            //$scope.loading = false;
        });

    }]);
});