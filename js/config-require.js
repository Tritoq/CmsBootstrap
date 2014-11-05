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
        'angular'                                   :               'vendor/angular/angular',
        'jquery'                                    :               'vendor/jquery/dist/jquery',
        'jquery-ui'                                 :               'vendor/jquery-ui/jquery-ui',
        'jquery-mobile'                             :               'vendor/jquery-mobile/jquery.mobile.custom',
        'iscroll'                                   :               'vendor/iscroll/build/iscroll',

        'ngAnimate'                                 :               'vendor/angular-animate/angular-animate',
        'ngResource'                                :               'vendor/angular-resource/angular-resource',
        'ngRoute'                                   :               'vendor/angular-route/angular-route',
        'ngTouch'                                   :               'vendor/angular-touch/angular-touch',
	    'ngGrid'                                    :               'vendor/angular-grid/build/ng-grid',
	    'ngGridLayout'                              :               'vendor/angular-grid/plugins/ng-grid-layout',
	    'ngGridFlexibleHeight'                      :               'vendor/angular-grid/plugins/ng-grid-flexible-height',
	    'route-segment'                             :               'vendor/angular-route-segment/build/angular-route-segment',
	    'ui.bootstrap'                              :               'vendor/angular-bootstrap/ui-bootstrap',
        'ui.bootstrap.tpls'                         :               'vendor/angular-bootstrap/ui-bootstrap-tpls',
        'ui.router'                                 :               'vendor/angular-ui-router/release/angular-ui-router',
        'ui.sortable'                               :               'vendor/angular-ui-sortable/sortable',
        'bootstrapLightbox'                         :               'vendor/angular-bootstrap-lightbox/dist/angular-bootstrap-lightbox',
        'angular-loading-bar'                       :               'vendor/angular-loading-bar/build/loading-bar',

        'lazyload'                                  :               'js/components/lazy/lazyload',
        'dropzone'                                  :               'vendor/dropzone/downloads/dropzone',
        'config'                                    :               'js/config/application'
    },

    shim: {
        'angular': {
            'deps'                                  :               ['jquery'],
            'exports'                               :               'angular'
        },

        'jquery-ui'                                 :               ['jquery'],
        'jquery-mobile'                             :               ['jquery'],
        'dropzone'                                  :               ['jquery'],

        'ngAnimate'                                 :               ['angular'],
        'ngResource'                                :               ['angular'],
        'ngRoute'                                   :               ['angular'],
        'ngGrid'                                    :               ['angular'],
        'ngGridLayout'                              :               ['angular'],
        'ngTouch'                                   :               ['angular'],
	    'route-segment'                             :               ['angular'],
        'ui.router'                                 :               ['angular'],
        'ui.bootstrap'                              :               ['angular'],
        'ui.bootstrap.tpls'                         :               ['angular'],
        'ui.sortable'                               :               ['angular'],
        'angular-loading-bar'                       :               ['angular'],
        'bootstrapLightbox'                         :               ['angular', 'angular-loading-bar']

    }
});