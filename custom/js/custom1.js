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
});