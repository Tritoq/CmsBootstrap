/**
 * Created by arturmagalhaes on 21/08/14.
 */
define(['../app/module'], function (module) {

    module.register.controller('crudController', function ($scope, $rootScope, $routeParams, crudDataService, Page) {
        var crudData = crudDataService.data.crud;
        $scope.crud = crudData;
        Page.setTitle(crudData.title);
    });
});