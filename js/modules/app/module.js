/**
 * Created by arturmagalhaes on 20/08/14.
 */
define([
    'angular',
    'config',
    'routes',
    'ngAnimate',
	'route-segment',
    'jquery-ui',
    'iscroll',
    'ngRoute',
    'ngTouch',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'ui.sortable',
    'bootstrapLightbox'
], function (angular, config, routes) {

    'use strict';


    var $app = angular.module('app.main', ['ngAnimate', 'ngRoute', 'ui.bootstrap', 'route-segment', 'view-segment', 'ngTouch', 'ui.sortable', 'bootstrapLightbox']);

    // Configuration App

    $app.config(['$tooltipProvider', '$routeProvider' , '$locationProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$routeSegmentProvider', 'LightboxProvider',

        function ($tooltipProvider, $routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $routeSegmentProvider, LightboxProvider) {


        $app.register =
        {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            filter: $filterProvider.register,
            factory: $provide.factory,
            service: $provide.service
        };

        /** Tooltip configuration **/

        $tooltipProvider.options({
            appendToBody: true
        });

        LightboxProvider.templateUrl = config.view.get('LightboxModal', 'html', 'crud');

        /** Routes **/

        var resolve = {
            load: function ($route, $q, crudDataService) {
                var defer = $q.defer();
                require([config.js.get('crud')], function () {
                    var data = crudDataService.load($route.current.params.module, defer);
                });
                return defer.promise;
            }
        };

        $routeSegmentProvider.
            when('/', 'dashboard').
            when('/:module.crud', 'crud').
            when('/:module.crud/view', 'crud.view').
            when('/:module.crud/insert', 'crud.insert').
            segment('dashboard', {
                templateUrl: config.view.get('dashboard'),
                controller: 'dashboardController',
                resolve: {
                    load: ['$q', '$rootScope', function ($q, $rootScope) {

                        var defer = $q.defer();

                        require(['js/modules/dashboard/dashboard.controller'], function () {
                            defer.resolve();
                        });

                        return defer.promise;
                    }]
                }
            }).
            segment('crud', {
                templateUrl: config.view.get('crud'),
                controller: 'crudController',
                resolve: resolve,
                dependencies: ['module']
            }).
            within().
            segment('view', {
                default: true,
                templateUrl: config.view.get('grid', null, 'crud'),
                controller: 'crudViewController'
            }).
            segment('insert', {
                templateUrl: config.view.get('insert', null, 'crud')
            });

    }]);

    // Fatories

    $app.factory('Page', function ($rootScope) {
        return {
            setTitle: function (title) {
                $rootScope.title = title + ' | ';
            }
        }
    });

    $app.factory('Mobile', function () {

        var obj = {
            isNotMobile: function () {
                return !this.isMobile();
            },
            isMobile: function () {
                if(navigator.userAgent.match(/Android/i)
                    || navigator.userAgent.match(/webOS/i)
                    || navigator.userAgent.match(/iPhone/i)
                    || navigator.userAgent.match(/iPad/i)
                    || navigator.userAgent.match(/iPod/i)
                    || navigator.userAgent.match(/BlackBerry/i)
                    || navigator.userAgent.match(/Windows Phone/i)
                ){
                    return true;
                }
                else {
                    return false;
                }
            }
        };

        return obj;
    });

    $app.factory('Busy', function ($rootScope) {

        if(!document.getElementById('busy')) {
            var busy = $('<div></div>');
            $(busy).attr('id', 'busy');
            $(document.body).append(busy);
            //$(busy).width(document.body.clientWidth).height(document.body.clientHeight);

            $(window).resize(function () {
                $(busy).width(document.body.clientWidth).height(document.body.clientHeight);
            });

            $(busy).bind('show', function () {
                $(this).width(document.body.clientWidth).height(window.innerHeight);
            });
        }

        $rootScope.$watch('busy', function (value) {
            if(value) {
                $('div#busy').trigger('show').show();
            } else {
                $('div#busy').hide();
            }
        });

        return {
            'isBusy': function (value) {
                if(value == undefined) {
                    return $rootScope.busy;
                } else {
                    $rootScope.busy = value;
                }
            }
        }
    });

    $app.factory('User', function ($http, $rootScope, Live) {
        return {
            isLoad: false,
            data: {},
            load: function () {
                var req = $http.get(routes.userData);
                var obj = this;
                req.success(function (data) {
                    obj.data = $rootScope.user = data.user;
                    obj.isLoad = true;
                    $rootScope.$broadcast('$userLoadData', {user: data.user});

                    if(data.user.live && data.user.live.length > 0) {
                        Live.start(data.user.live);
                    }

                }).error(function (data) {
                    console.error(data);
                });
            }
        };
    });

    $app.factory('WindowNotification', function () {
         return {
             isGranted: function () {
                if(window.webkitNotifications) {
                    return window.webkitNotifications.checkPermission() == 0;
                } else if ("Notification" in window) {
                    return Notification.permission === 'granted';
                } else {
                    return false;
                }
             },
             request: function (callback) {
                if(window.webkitNotifications) {
                    if (window.webkitNotifications.checkPermission() != 0) {
                        window.webkitNotifications.requestPermission();
                    }
                } else if ("Notification" in window) {
                    if(Notification.permission === 'default') {
                        Notification.requestPermission(callback);
                    }
                }
             },
             sound: function (url) {
                 $('body').append("<audio autoplay='autoplay'><source type='audio/mpeg' src='"+ url +"'></source></audio>");
             },
             send: function (title, text) {

                 this.sound('/sound/beep.mp3');

                 if(window.webkitNotifications) {
                     window.webkitNotifications.createNotification('/favicon.ico', title, text).show();
                 } else if('Notification' in window) {
                     if(Notification.permission === 'granted') {
                         var notification = new Notification(title, {
                             icon: '/favicon.ico',
                             body: text
                         });
                         notification.onclick = function () {
                             window.focus();
                             this.close();
                         };

                         var closeNotification = function () {
                             notification.close();
                             $(window).unbind('focus', closeNotification);
                         };

                         $(window).bind('focus', closeNotification);

                     } else {
                         console.info('Not allowed notification browser');
                     }
                 }
             }
         }
    });

    $app.factory('Live', function ($http, $rootScope, $interval, WindowNotification) {
        $rootScope.live = {
            data: {},
            badges: 0,
            update: function () {
                var total = 0;

                for(var i in this.data) {
                    total += this.data[i];
                }

                this.badges = total;
            }
        };

        var saveTitle = '';
        var interval = null;

        var swapTitle = function () {
            if(saveTitle == '') {
                saveTitle = $('title').html();
            }
            var b = false;
            var swap = function () {
                if(b) {
                    $('title').html('(' + $rootScope.live.badges +') Novos registros no sistema');
                } else {
                    $('title').html(saveTitle);
                }
                b = !b;
            };

            if(interval) {
                $timeout.cancel(interval);
            }

            interval = $interval(swap, 1000);
            var clearInterval = function () {
                $('title').html(saveTitle);
                saveTitle = '';
                $interval.cancel(interval);
                $(window).unbind('focus', clearInterval);
            };

            $(window).bind ('focus', clearInterval);
        };

        $rootScope.$watch('live.data', function (newValue) {

            var total = 0;

            for(var i in newValue) {
                total += newValue[i];
            }

            $rootScope.live.badges = total;

        });
        $rootScope.$watch('live.badges', function (newValue) {
            if(newValue > 0) {
                if(WindowNotification.isGranted() && !$rootScope.windowFocus) {
                    WindowNotification.send('Novos registros no sistema', "" + newValue + ' novos registros no sistema');
                    swapTitle();
                }
            }
        });

        return {
            timeInterval: 5000,
            modules: [],
            isStarted: false,
            listener: function () {
                if(this.modules.length > 0) {
                    var request = $http.post(routes.live, this.modules);
                    request.success(function (data) {

                        var badges = 0;
                        for(var i in data) {
                            badges += data[i];
                        }

                        if(badges > 0) {
                            $rootScope.live.data = data;
                            $rootScope.$broadcast('$liveUpdate', data);
                        }
                    }).error(function (e) {
                        console.info(e);
                    });
                }
            },
            add: function (module) {
                var contains = false;

                for(var i in this.modules) {
                    if(this.modules[i] == module) {
                        contains = true;
                    }
                }

                if(!contains) {
                    this.modules.push(module);
                }
            },
            remove: function (module) {
                for(var i in this.modules) {
                    if(this.modules[i] == module) {
                        this.modules.splice(i, 1);
                    }
                }

            },
            start: function (modules) {
                if(!this.isStarted) {
                    this.modules = modules;
                    this.isStarted = true;
                    var obj = this;
                    $interval(function () {

                        obj.listener();

                    }, this.timeInterval);
                } else {
                    for(var i in modules) {
                        this.add(modules[i]);
                    }
                }
            }
        };
    });


    $app.factory('crudDataService', function ($http, $q) {
        return {
            data: {},
            lastModule: null,
            load: function (mod, defer) {

                this.lastModule = mod;

                var deferredAbort = $q.defer();
                var request = $http({method: "post", data: {'module': mod}, url: routes.crudData, timeout: deferredAbort.promise});
                var service = this;

                var promise = request.then(function (response) {
                    service.data = response.data;
                    defer.resolve();
                    return (response.data);
                }, function (response) {
                    return ($q.reject('Error'));
                });

                promise.abort = function () {
                    deferredAbort.resolve();
                }

                promise.finally(
                    function() {
                        promise.abort = angular.noop;
                        deferredAbort = request = promise = null;
                    }
                );
                return promise;


            }
        };
    });

    $app.factory('crudItemService', function () {
        return {
            items: [],
            add: function (item) {
                this.items.push(item);
            },
            get: function () {
                return this.items;
            },
            reset: function () {
                this.items = [];
            }
        }
    });


    $app.factory('Message', function ($rootScope, $timeout) {

        $rootScope.flashMessage = {
            type: '',
            code: false,
            message: ''
        };

        $rootScope.windowFocus = true;

        $(window).bind('focus', function () {
            $rootScope.windowFocus = true;

        }).bind('blur', function () {
            $rootScope.windowFocus = false;
        });


        return {
            event: {
                error: 'ERROR',
                success: 'SUCCESS',
                info: 'INFO',
                display: false
            },
            timeoutID: null,
            show: function (type, msg, code, time) {
                $rootScope.flashMessage.type = type;
                $rootScope.flashMessage.message = msg;
                $rootScope.flashMessage.code = (code == undefined) ? 0 : code;

                if($rootScope.windowFocus) {
                    $rootScope.flashMessage.display = true;
                }



                var event = null;

                switch(type) {
                    case 'error':
                        event = this.event.error;
                        break;
                    case 'info':
                        event = this.event.info;
                        break;
                    case 'success':
                        event = this.event.success;
                        break;
                }

                $rootScope.$broadcast(event, {msg: msg, code: code});

                if(this.timeoutID) {
                    $timeout.cancel(this.timeoutID);
                }


                this.timeoutID = $timeout(this.hide, ((time == undefined) ? 20000 : time));
            },
            hide: function () {
                $rootScope.flashMessage.display = false;
            }
        };
    });


    $app.factory('Error', function (Message) {
        return {
            show: function (msg, code, timeout) {
                Message.show('error', msg, code, timeout)
            }
        };
    });


    // Contants

    $app.constant('APP', {
        "closeWidth": 1200
    });


    $app.constant('NOTIFY_EVENTS', {
        'open':             'notification.open',
        'load':             'notification.load',
        'close':            'notification.close',
        'loadHistory':      'notification.load.history',
        'updateHistory':    'notification.update.history'
    });


   // Directives

    $app.value('$anchorScroll', angular.noop);

    $app.directive('ngTooltip', function () {
        return {
            restrict: 'A',
            template: '<input tooltip tooltip-placement="bottom" tooltip-trigger="focus">',
            replace: true,
            link: function (scope, element, attrs) {
                attrs.$set('tooltip', attrs['placeholder']);
            }
        };
    });


    $app.directive("repeatPassword", function() {
        return {
            require: "ngModel",
            link: function(scope, elem, attrs, ctrl) {
                var otherInput = elem.inheritedData("$formController")[attrs.repeatPassword];

                ctrl.$parsers.push(function(value) {
                    if(value === otherInput.$viewValue) {
                        ctrl.$setValidity("repeat", true);
                        return value;
                    }
                    ctrl.$setValidity("repeat", false);
                });

                otherInput.$parsers.push(function(value) {
                    ctrl.$setValidity("repeat", value === ctrl.$viewValue);
                    return value;
                });
            }
        };
    });

    $app.directive('crudoption', ['$compile', function ($compile) {

        return {
            restrict: 'E',
            replace: true,
            link: function (scope, element, attrs) {

                var value = attrs.ngBindHtml;
                var html = scope.$parent.datagrid[value].toString();

                var template = angular.element($compile(html)(scope));
                element.replaceWith(template);
            }
        }
    }]);


    $app.directive('custom', function ($http, $templateCache, $compile) {
        return {
            restrict: 'E',
            scope: {
                template: "=",
                item: "="
            },
            link: function (scope, elem, attrs) {
                $http.get(scope.template, {cache: $templateCache}).success(function (html) {
                    var template = angular.element($compile(html)(scope));
                    elem.replaceWith(template);
                });
            }
        }
    });

    $app.filter('bytes', function() {
        return function(bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }
    });



    return $app;
});