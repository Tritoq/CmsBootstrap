/**
 * Created by arturmagalhaes on 21/08/14.
 */
define(['./module'], function (module) {
    'use strict';

    module.controller("NotificationController", function ($scope, $rootScope, $http, $timeout, NOTIFY_EVENTS, Mobile) {

        /** Setting objects **/
        $scope.loading = false;

        /** Setting objects **/
        $scope.loading = false;

        $scope.isLoading = function (value) {
            if(value == undefined) {
                return $scope.loading;
            } else {
                $scope.loading = value;
                $rootScope.$broadcast(NOTIFY_EVENTS.load, {value: value});
                return $scope;
            }
        };

        $scope.user = {
            password: '',
            nome: '',
            cpassword: '',
            email: '',
            grupo: '',
            isLoad: false
        };

        $scope.history = {
            isLoad: false,
            items: {}
        };

        $scope.dashboard = {
            isLoad: false,
            items: {}
        };

        $scope.cache = {
            isLoad: false,
            date: ""
        };

        $scope.sortableOptions = {
            update: function(e, ui) {},
            stop: function(e, ui) {}
        };

        $scope.message = {
            show: false,
            text: 'Empty',
            delay:5000,
            type: 'false',
            prepend: function () {
                this.show = true;
                $('.bar-notification #msg').removeClass('error success');
            },
            error: function (msg) {
                this.prepend();
                this.text = msg;
                this.type = 'error';
                console.error(msg);
                $timeout(function () { $scope.message.hide(); }, this.delay);
                $('.bar-notification #msg').addClass('error');
            },
            success: function (msg) {
                this.prepend();
                this.text = msg;
                this.type = 'success';
                $timeout(function () { $scope.message.hide(); }, this.delay);
                $('.bar-notification #msg').addClass('success');
            },
            hide: function () {
                $scope.message.show = false;
                $scope.$apply();
            }
        };

        /** Object interactions **/

        $('.bar-notification input').focus(function () {
            $('body').bind('touchmove', function(e){e.preventDefault()});
        }).blur(function () {
            $('body').unbind('touchmove');
        });

        /** Listeners **/

        $rootScope.$on(NOTIFY_EVENTS.loadHistory, function (e) {
            var request = $http({'method': 'GET', url: 'data/history.php'});
            request.then(function (e) {
                $scope.history.items = e.data;
                $scope.isLoading(false);
                $scope.history.isLoad = true;
                $timeout(function () {
                    if(Mobile.isNotMobile()) {
                        var scroll = new IScroll('#history-list', {mouseWheel: true});
                    }
                }, 500);
            }, function(e) {
                $scope.isLoading(false);
                console.error(e);
            });
        });

        $rootScope.$on(NOTIFY_EVENTS.updateHistory, function (e) {
            if($scope.history.isLoad) {
                $rootScope.$broadcast(NOTIFY_EVENTS.loadHistory);
            }
        });

        $rootScope.$on(NOTIFY_EVENTS.open, function(e, obj) {

            switch(obj.tab) {
                case 'user':
                    if(!$scope.user.isLoad) {
                        $scope.isLoading(true);
                        var request = $http({'method': 'GET', url: 'data/user-data.php'});
                        request.then(function (e) {
                            $scope.user = e.data.user;
                            $scope.isLoading(false);
                            $scope.user.isLoad = true;
                        }, function (e) {
                            $scope.isLoading(false);
                            console.error(e);
                        });
                    }
                    break;
                case 'history':
                    if(!$scope.history.isLoad) {
                        $scope.isLoading(true);
                        $timeout(function () {
                            $rootScope.$broadcast(NOTIFY_EVENTS.loadHistory);
                        }, 800);
                    }
                    break;
                case 'dashboard':
                    if(!$scope.dashboard.isLoad) {
                        $scope.isLoading(true);
                        var request = $http({'method': 'GET', url: 'data/dashboard.php'});
                        request.then(function (e) {
                            $scope.dashboard.items = e.data;
                            $scope.isLoading(false);
                            $scope.dashboard.isLoad = true;
                            $timeout(function () {
                                $('.bar-notification .dashboard ul>li').bind('mousedown', function () {
                                    $(this).removeClass('mouseup').addClass('mousedown');
                                }).bind('mouseup', function () {
                                    $(this).removeClass('mousedown').addClass('mouseup');
                                });
                            }, 400);


                        }, function (e) {
                            $scope.isLoading(false);
                            console.error(e);
                        });
                    }
                    break;
                case 'cache':
                    if(!$scope.cache.isLoad) {
                        $scope.isLoading(true);
                        var request = $http({'method': 'GET', url: 'data/clear-cache.php'});
                        request.then(function (e) {
                            $scope.cache = e.data.cache;
                            $scope.isLoading(false);
                            $scope.cache.isLoad = true;
                        }, function (e) {
                            $scope.isLoading(false);
                            console.error(e);
                        });
                    }
                    break;
            }

        });

        /** Methods / Actions **/

        $scope.clearCache = function () {
            var request = $http({method: "PUT", url: "data/clear-cache.php"});
            $scope.isLoading(true);
            request.then(function (response) {
                $scope.isLoading(false);
                $scope.message.success('Dashboard atualizado');
                $rootScope.$broadcast(NOTIFY_EVENTS.updateHistory);
            }, function (response) {
                $scope.isLoading(false);
                $scope.message.error('Erro na atualização dos dados');
            });
        };

        $scope.updateDashboard = function (list) {
            var request = $http({method: "PUT", url: "data/dashboard.php", data: list});
            $scope.isLoading(true);
            request.then(function (response) {
                $scope.isLoading(false);
                $scope.message.success('Dashboard atualizado');
                $rootScope.$broadcast(NOTIFY_EVENTS.updateHistory);
            }, function (response) {
                $scope.isLoading(false);
                $scope.message.error('Erro na atualização dos dados');
            });
        };

        $scope.updateUser = function (user, isValid) {

            if(isValid) {
                var request = $http({method: "PUT", url: "data/user-data.php", data: user});
                $scope.isLoading(true);
                request.then(function (response) {
                    $scope.isLoading(false);
                    $scope.message.success('Dados do usuário atualizados');
                    $scope.user.password = $scope.user.cpassword = '';
                    $rootScope.$broadcast(NOTIFY_EVENTS.updateHistory);
                }, function (response) {
                    $scope.isLoading(false);
                    $scope.message.error('Erro na atualização dos dados');
                });
            }
        };

    });

    return module;
});