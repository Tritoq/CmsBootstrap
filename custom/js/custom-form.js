/**
 * Created by arturmagalhaes on 12/11/14.
 */
define(['angular', '../../js/modules/app/module'], function(angular, module) {
    module.register.controller('testController', function ($scope) {
           $scope.label = 'Test';
    });
})