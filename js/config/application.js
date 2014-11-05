/**
 * Created by arturmagalhaes on 20/08/14.
 */
define('config', function () {
    'use strict';
    var Config = {
        debug: false,
        css: {
            'basePath': 'css',
            'get': function (file, module) {

                if(module == undefined) {
                    module = file;
                }

                return this.basePath + ('/modules/$module/$file.css').replace(/\$module/g, module).replace(/\$file/g, file);
            }
        },
        view: {
            'basePath': 'views',
            'defaultFormat': 'html',
            'get': function (file, format, module) {

                if(format == undefined) {
                    format = this.defaultFormat;
                }

                if(module == undefined) {
                    module = file;
                }

                return this.basePath + ('/modules/$module/$file.' + format).replace(/\$module/g, module).replace(/\$file/g, file);
            }
        },
        js: {
            'basePath': 'js',
            'libsPath': 'vendor',
            'get': function(file, module) {
                if(module == undefined) {
                    module = file;
                }
                return this.basePath + ('/modules/$module/$file.controller').replace(/\$module/g, module).replace(/\$file/, file);
            }
        }
    };

    return Config;

});