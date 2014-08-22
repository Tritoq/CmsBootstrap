/**
 * Created by arturmagalhaes on 21/08/14.
 */
define('lazyload', function () {
    'use strict';
    var obj = {
        css: {
            resources: new Array(),
            addFile: function (src, callback) {

                if($.inArray(src, this.resources) == -1) {
                    var l = document.createElement('link');
                    l.rel = "stylesheet";
                    l.type = 'text/css';
                    l.href = src;
                    var f = document.getElementsByTagName('link')[document.getElementsByTagName('link').length-1];
                    f.parentNode.appendChild(l, f);

                    this.resources.push(src);

                    if(callback != undefined) {
                        callback();
                    }
                }  else {
                    if(callback != undefined) {
                        callback();
                    }
                }
            }
        }
    };

    return obj;
});