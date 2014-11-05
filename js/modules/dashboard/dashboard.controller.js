/**
 * Created by arturmagalhaes on 21/08/14.
 */
define(['../app/module', 'lazyload', 'config'], function (module, lazyload, config) {
    module.register.controller('dashboardController', ['$scope', '$http', 'Page', 'Mobile', function ($scope, $http, Page, Mobile) {

        Page.setTitle('Dashboard');

        lazyload.css.addFile(config.css.get('dashboard'));
        lazyload.css.addFile(config.css.get('dashboard.mobile', 'dashboard'));


        if(Mobile.isNotMobile()) {
            $('.crud-snapshot .wrapper').each(function (index) {
                //var scroll = new IScroll('#'+$(this).attr('id'), {mouseWheel: true});
            });
        }


        var squaresHeight = function () {
            if($('.square')) {
                $('.square').height(window.innerHeight);
            } else {
                $(window).unbind('resize', squaresHeight);
            }
        };

        squaresHeight();
        $(window).bind('resize', squaresHeight);

        $scope.gaInterval = null;

        $(window).bind('resize', function () {
            if($scope.gaInterval) {
                clearTimeout($scope.gaInterval);
            }

            $scope.gaInterval = setTimeout(function () {
                try {
                    document.getElementById('ga').contentWindow.location.reload(true);
                } catch(e) {
                    $(window).unbind('resize');
                }
            }, 2000);

        });

    }]);

    return module;
});