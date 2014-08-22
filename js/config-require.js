/**
 * Created by arturmagalhaes on 20/08/14.
 */
if (typeof define !== 'function') {
    // to be able to require file from node
    var define = require('amdefine')(module);
}

define({
    baseUrl: '.',
    // Here paths are set relative to `/source` folder
    paths: {
        'angular'         : 'vendor/angular/angular',
        //'async'           : 'vendor/requirejs-plugins/src/async',
        'jquery'          : 'vendor/jquery/dist/jquery',
        'jquery-ui'       : 'vendor/jquery-ui/jquery-ui',
        'iscroll'         : 'vendor/iscroll/build/iscroll',
        'ngAnimate'       : 'vendor/angular-animate/angular-animate',
        'ngResource'      : 'vendor/angular-resource/angular-resource',
        'ngRoute'         : 'vendor/angular-route/angular-route',
        'ui.bootstrap'    : 'vendor/angular-bootstrap/ui-bootstrap',
        'ui.bootstrap.tpls': 'vendor/angular-bootstrap/ui-bootstrap-tpls',
        'lazyload'        : 'js/components/lazy/lazyload',
        'config'          : 'js/config/application'
    },

    shim: {
        'angular': {
            'deps': ['jquery'],
            'exports': 'angular'
        },
        'jquery-ui': ['jquery'],
        'ngAnimate':  ['angular'],
        'ngResource': ['angular'],
        'ngRoute':    ['angular'],
        'ui.router':  ['angular'],
        'ui.bootstrap': ['angular'],
        'ui.bootstrap.tpls': ['angular']
    }
});