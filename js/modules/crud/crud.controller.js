/**
 * Created by arturmagalhaes on 21/08/14.
 */
define(['../app/module', 'lazyload', 'config', 'routes', './crud.events'], function (module, lazyload, config, routes, CRUD_EVENT) {

    'use strict';

    module.register.controller('crudController', function ($scope, $sce, $rootScope, $routeParams, crudDataService, Page, $http) {
        /* Carrega as informações do CRUD */

        var crudData = crudDataService.data.crud;
        $scope.crud = crudData;
        // Seta o título da página
        Page.setTitle(crudData.title);

        // Carrega os arquivos CSS
        lazyload.css.addFile(config.css.get('crud'));
        lazyload.css.addFile(config.css.get('crud.mobile', 'crud'));

        $scope.module = crudData.module;

        $scope.datagridData = {};
        $scope.perms = {};
        $scope.loading = false;

        $scope.datagrid = {
            columns: {},
            data: {},
            pages:{},
            options: {},
            currentPage: 1,
            interval: '',
            total: 0,

            // ACTIONS

            "get": function (page) {

                if(page != undefined) {
                    this.currentPage = page;
                }

                $scope.loading = true;
                // Dispatch Event
                $scope.$broadcast(CRUD_EVENT.DATAGRID_LOAD, {module: $scope.module});

                var request = $http({url: routes.datagrid , params: {'module': crudData.module, 'page': this.currentPage},  method: 'get'});
                //
                request.then(function (resp) {
                    $scope.datagrid.columns = resp.data.columns;
                    $scope.datagrid.data = resp.data.grid;
                    $scope.datagrid.pages = resp.data.pages;
                    $scope.datagrid.options = $sce.trustAsHtml(resp.data.options);
                    $scope.datagrid.interval = resp.data.interval;
                    $scope.datagrid.total = resp.data.total;
                    $scope.loading = false;
                    //Dispatch Event
                    $scope.$broadcast(CRUD_EVENT.DATAGRID_COMPLETE, resp.data);
                });
            }
        };


        // ACTIONS

    });

    module.register.controller('crudViewController', function ($scope) {

        if(Object.keys($scope.$parent.datagrid.data).length == 0) {
            $scope.$parent.datagrid.get();
        }

        $scope.checkedAll = false;

        $scope.items = [];

        $scope.registerItems = function (item) {
            $scope.items.push(item);
        };

        $scope.selectAll = function () {
            angular.forEach($scope.items, function (item) {
                if($scope.checkedAll) {
                    item.selected = false;
                } else {
                    item.selected = true;
                }
            });
            $scope.checkedAll = !$scope.checkedAll;
        };

        $(window).bind('scroll touchstart touchmove touchend ', function () {
            var ws = $(window).scrollTop();
            var table = $('.crud-container .table-datagrid').scrollTop();
            var margin = 210;

            if($('.crud-container div.search').height() > 0) {
                margin = 330;
            }

            if(this.ws == undefined) {
                this.table = table;
            }


            if(ws > (this.table + margin)) {
                $('.crud-container .header-fixed').show();
                $('.crud-container .table-datagrid thead th').each(function (index) {
                    $('.crud-container .header-fixed ul li:eq('+index+')').width($(this).width() + 8);
                });


                $('.notification, .bar-notification').hide();

            } else {
                $('.notification, .bar-notification').show();
                $('.crud-container .header-fixed').hide();
            }

        });


    });
});