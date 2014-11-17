/**
 * Created by arturmagalhaes on 10/11/14.
 */
define(['../app/module', 'lazyload', 'config', 'routes', './crud.events', 'text-angular'], function (module, lazyload, config, routes, CRUD_EVENT) {
    module.register.controller('crudInsertController', function ($scope, $rootScope, $http, Message, crudDataService, $timeout) {

        var crud = crudDataService.data.crud;

        $scope.data = {};

        $scope.openTest = function () {
            //console.info($rootScope.dz);
            //$('#area-upload').click();
        };



        $scope.insert = function () {
            var req = $http.post(routes.insert, {obj: $scope.data, module: crud.module});
            req.success(function (data) {
                if(data.insert == true) {
                    Message.show('success', 'Dados inseridos');
                    $scope.data = null;
                    $scope.insertForm.$setPristine();

                    var item = data.item;

                    var inp = document.getElementById('files');

                    if(inp.files.length > 0) {
                        var dz = $rootScope.dz;

                        $rootScope.$broadcast(CRUD_EVENT.UPLOAD_OPEN, item);
                        $rootScope.$broadcast(CRUD_EVENT.UPLOAD_MINIMIZE);

                        //console.info(inp.files);

                        for(var i = 0; i < inp.files.length; i++) {
                            var item = inp.files[i];

                            var reader = new FileReader();
                            reader.data = item;

                            console.info(reader.data);

                            reader.onload = function () {
                                var url = this.result;
                                dz.emit('addedfile', this.data);
                                dz.emit('thumbnail', this.data, url);
                                dz.files.push( this.data );
                                dz.uploadFile(this.data);
                            };

                            reader.readAsDataURL(item);
                        }


                        $timeout(function () {
                            console.info('processou');
                            dz.processQueue();
                            //dz.uploadFiles();
                        }, 1000);
                    }

                } else {
                    Message.show('info', 'Não foi possível realizar a inserção');
                }

            });

            req.error(function (err) {
                Message.show('error', 'Ocorreu um erro na inserção');
                console.error(err);
            });
        };

        $rootScope.$broadcast(CRUD_EVENT.UPLOAD_MINIMIZE);


    });


    module.register.controller('crudUpdateController', function ($scope, $route, form, $http, Message, $rootScope) {
        $scope.data = form;
        $rootScope.$broadcast(CRUD_EVENT.UPLOAD_CLOSE);
        $scope.update = function () {
            var req = $http.put(routes.update, $scope.data);

            req.success(function (data) {
                if(data.update == true) {
                    Message.show('success', 'Dados atualizados');
                } else {
                    Message.show('info', 'Não foi possível realizar a atualização');
                }
            });

            req.error(function (err) {
                Message.show('error', 'Ocorreu um erro na atualização');
                console.error(err);
            });
        };

    });

});