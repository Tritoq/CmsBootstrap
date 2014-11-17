define(['angular', '../../js/modules/app/module'], function(angular, module) {


    var mainCtrl = {
        '$http': {},
        module: '',
        activeItem:function (item) {
            this.$http.post('custom/data/activate-item.php', {'id': item.id, module: module}).
                success(function (data) {
                        for(var i in item) {
                            item[i] = data[i];
                        }
                    }
                );
        },
        desactiveItem: function (item) {
            this.$http.post('custom/data/desactivate-item.php', {'id': item.id, module: module}).
                success(function (data) {
                    for(var i in item) {
                        item[i] = data[i];
                    }
                });
        }
    };

    module.register.controller('GroupCustomController', function ($scope, $http, crudItemService) {

        $scope.activeSelected = function () {

            angular.forEach(crudItemService.get(), function (item) {

                if(item.selected && (item.statusNumber == 1 || item.statusNumber == '1')) {
                    mainCtrl.activeItem(item);
                }

                if(item.selected) {
                    item.selected = false;
                }
            });


        };


        $scope.desactiveSelected = function () {

            angular.forEach(crudItemService.get(), function (item) {

                if(item.selected && (item.statusNumber == 2 || item.statusNumber == '2')) {
                    mainCtrl.desactiveItem(item);
                }

                if(item.selected) {
                    item.selected = false;
                }
            });


        };

    });

    module.register.controller('CustomController', function ($scope, $modal, $rootScope, $http, crudDataService) {



        var module = crudDataService.data.crud.module;

        var modalCtrl = function ($scope, $modalInstance, data) {
            $scope.item = data;
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

        mainCtrl.$http = $http;
        mainCtrl.module = module;

        $scope.showCustom = function (item) {

            /*var modalInstance = $modal.open({
                templateUrl: 'views/modules/crud/CustomModal.html',
                controller: modalCtrl,
                resolve: {
                    data: {},
                    load: function ($q, $http) {
                        var defer = $q.defer();
                        defer.resolve(item);
                        return defer.promise;
                    }
                }
            });*/

            item.nome = 'artur';
            //$rootScope.$apply();
        };


        $scope.activeItem = function (item) {
            mainCtrl.activeItem(item);
        };

        $scope.desactiveItem = function (item) {
            mainCtrl.desactiveItem(item);
        };

    });

    module.register.filter('propsFilter', function () {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    });

    module.register.filter('propsFilter', function() {
        return function(items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function(item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        }
    });

    module.register.controller('customInsertController', function ($scope, $rootScope ) {


        $scope.clientes = [
            { name: 'Adam',      email: 'adam@email.com',      age: 10 },
            { name: 'Amalie',    email: 'amalie@email.com',    age: 12 },
            { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30 },
            { name: 'Samantha',  email: 'samantha@email.com',  age: 31 },
            { name: 'Estefanía', email: 'estefanía@email.com', age: 16 },
            { name: 'Natasha',   email: 'natasha@email.com',   age: 54 },
            { name: 'Nicole',    email: 'nicole@email.com',    age: 43 },
            { name: 'Adrian',    email: 'adrian@email.com',    age: 21 }
        ];


        $scope.test = function () {
            console.info($scope.$parent);
        }

    });


});