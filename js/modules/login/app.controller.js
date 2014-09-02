/**
 * Created by arturmagalhaes on 20/08/14.
 */
define(['./module', 'routes'], function(module, routes) {
    'use strict';


    var PasswordModalInstanceCtrl = function ($scope, $rootScope, $http, $timeout, $window, $modalInstance) {


        $scope.recovery = {};

        $scope.rloading = false;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.send = false;

        $scope.getPassword = function (recovery, isValid) {
            if(isValid) {
                $scope.rloading = true;
                var request = $http({'url': routes.recoveryPassword, 'method': 'post', 'data': recovery});
                request.then(function (res) {
                    $scope.rloading = false;
                    if(res.data.send == 'ok') {
                        $scope.rmsg = 'E-mail enviado, leia as instruções que lhe foram enviadas';
                        $scope.send = true;
                        $timeout(function () {
                            $scope.rmsg = false;

                            $modalInstance.dismiss('cancel');
                        }, 10000);
                    }
                }, function () {
                    $scope.rmsg = 'Erro ao enviar e-mail';
                    $scope.rloading = false;
                    $scope.send = false;
                });
            }
        };
    };

    module.controller('ApplicationController', ['$scope', '$rootScope', '$timeout', '$window', '$modal', '$http', 'AuthService', 'AUTH_EVENTS', 'USER_ROLES', function($scope, $rootScope, $timeout, $window, $modal, $http, AuthService, AUTH_EVENTS, USER_ROLES) {

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
            $window.location.href = routes.app;
            //$scope.loading = false;
        });


        $scope.password = function () {
            var modalInstance = $scope.modalInstance = $modal.open({
                templateUrl: 'PasswordModalContent.html',
                controller: PasswordModalInstanceCtrl,
                resolve: {},
                windowClass: "modal passwordDialog"
            });

            $timeout(function () {
                $('#remail').focus();
            }, 200);

        };


        $timeout(function () { $('#username').focus(); }, 500);
    }]);
});