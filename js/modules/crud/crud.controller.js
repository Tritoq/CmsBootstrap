/**
 * Created by arturmagalhaes on 21/08/14.
 */
define(['../app/module', 'lazyload', 'config', 'routes', 'ngGridLayout'], function (module, lazyload, config, routes) {

    module.register.controller('crudController', function ($scope, $rootScope, $routeParams, crudDataService, Page, $http) {
        var crudData = crudDataService.data.crud;
        $scope.crud = crudData;
        Page.setTitle(crudData.title);

        lazyload.css.addFile(config.css.get('crud'));
        lazyload.css.addFile('vendor/angular-grid/ng-grid.min.css');

        $scope.module = crudData.module;

        $scope.tabs = {
            view: $routeParams.view ? true : false,
            insert: $routeParams.insert ? true : false,
            update: $routeParams.update ? true : false,
            search: $routeParams.search ? true : false
        };

        if(!$scope.tabs.view && !$scope.tabs.insert  && !$scope.tabs.update && !$scope.tabs.search) {
            $scope.tabs.view = true;
        }

        $scope.datagridData = {};

        $scope.columnDefs = {};


        var layoutPlugin = new ngGridLayoutPlugin();

        $scope.gridOptions = {data: 'datagridData', columnDefs: 'columnDefs', enableColumnResize : true, plugins: [layoutPlugin]};

        $scope.getDataGrid = function () {
            var request = $http({url: routes.datagrid , params: {'module': crudData.module},  method: 'get'});
            request.then(function (resp) {

                $scope.columnDefs = resp.data.columns;
                $scope.datagridData = resp.data.grid;
            });
        };


        window.setTimeout(function() {
            layoutPlugin.updateGridLayout();
        }, 100);


    });
});