/**
 * Created by arturmagalhaes on 20/08/14.
 */
define(['./module'], function (module) {
    'use strict';
    module.controller('LoginController', ['$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService', function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
        $scope.credentials = {
            username: '',
            password: '',
            active: false
        };

        $scope.error = false;

        $scope.login = function (credentials, isValid) {

            if(isValid == false) {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                return false;
            }

            $rootScope.$broadcast(AUTH_EVENTS.loginProcess);

            $scope.error = false;


            var response = {
                success: function (user) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    $scope.setCurrentUser(user);
                },
                error: function () {
                    credentials.username = '';
                    credentials.password = '';
                    $scope.error = true;
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                }
            };

            AuthService.login(credentials).then(function (user) {
                if(user.data.auth_result) {
                    response.success();
                } else {
                    response.error();
                }
            }, function () {
                response.error();
            });
        };
    }]);

});