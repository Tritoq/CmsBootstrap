/**
 * Created by arturmagalhaes on 21/08/14.
 */
define(['../app/module', 'lazyload', 'config', 'routes', './crud.events','dropzone', 'jquery-mobile'], function (module, lazyload, config, routes, CRUD_EVENT, Dropzone) {

    'use strict';

    module.register.controller('crudController', function ($scope, $sce, $rootScope, $routeParams, crudDataService, Page, $http, $q, Error, crudItemService) {
        /* Carrega as informações do CRUD */

        var crudData = crudDataService.data.crud;
        $scope.crud = crudData;
        // Seta o título da página
        Page.setTitle(crudData.title);

        // Carrega os arquivos CSS

        lazyload.css.addFile(config.css.get('crud'));
        lazyload.css.addFile(config.css.get('crud.mobile', 'crud'));


        lazyload.css.addFile('css/components/dropzone/basic.css');

        if (crudData.css != undefined) {
            for (var i in crudData.css) {
                lazyload.css.addFile(crudData.css[i]);
            }
        }

        $scope.jsLoaded = 0;
        $scope.jsTotal = (crudData.js != undefined) ? crudData.js.length : 0;

        if (crudData.js != undefined) {
            for (var i in crudData.js) {
                require([crudData.js[i].replace('.js', '')], function () {
                    $scope.groupCustom = crudData.group;
                    $scope.jsLoaded = $scope.jsLoaded + 1;
                    $scope.$apply();
                });
            }
        }

        $scope.module = crudData.module;


        $scope.datagridData = {};
        $scope.perms = {};
        $scope.loading = false;
        $scope.firstLoad = false;


        $scope.refresh = {
            value: false,
            show: function () {
                $('.crud-container .refresh').height($('.table-datagrid').height()).show();
                this.value = true;
            },
            hide: function () {
                $('.crud-container .refresh').hide();
                this.value = false;
            }
        };


        $scope.datagrid = {
            columns: {},
            data: {},
            pages: {},
            options: {},
            currentPage: 1,
            interval: '',
            total: 0,
            predicate: 'id',

            // ACTIONS

            "get": function (page) {

                if (page != undefined) {
                    $rootScope.$broadcast(CRUD_EVENT.DATAGRID_PAGE_CHANGE, {newPage: page, oldPage: this.currentPage});
                    this.currentPage = page;
                }

                if (!$scope.firstLoad) {
                    $scope.loading = true;
                } else {
                    $scope.refresh.show();
                }

                $scope.firstLoad = true;

                // Dispatch Event
                $rootScope.$broadcast(CRUD_EVENT.DATAGRID_LOAD, {module: $scope.module});

                var request = $http({
                    url: routes.datagrid,
                    params: {'module': crudData.module, 'page': this.currentPage},
                    method: 'get'
                });
                //
                request.success(function (data) {

                    $rootScope.live.data[$scope.module] = 0;
                    $rootScope.live.update();

                    var populate = function () {
                        $scope.datagrid.columns = data.columns;
                        $scope.datagrid.custom_columns = data.custom_columns;
                        $scope.datagrid.data = data.grid;
                        $scope.datagrid.pages = data.pages;
                        $scope.datagrid.options = $sce.trustAsHtml(data.options);
                        $scope.datagrid.interval = data.interval;
                        $scope.datagrid.total = data.total;
                        $scope.loading = false;
                        $scope.refresh.hide();
                        crudItemService.reset();
                        //Dispatch Event
                        $rootScope.$broadcast(CRUD_EVENT.DATAGRID_COMPLETE, data);
                    };

                    if ($scope.jsTotal > 0 && $scope.jsTotal > $scope.jsLoaded) {
                        $scope.$watch('jsLoaded', function (newValue, oldValue) {
                            if ($scope.jsLoaded >= $scope.jsTotal) {
                                populate();
                            }
                        });
                    } else {
                        populate();
                    }


                }).error(function (error, code) {
                    if (code >= 500) {
                        Error.show('Ocorreu um erro na requisição do GRID', code);
                    }
                });
            }
        };




        // ACTIONS

        if (config.debug) {

            for (var k in CRUD_EVENT) {
                $scope.$on(CRUD_EVENT[k], function (event, data) {
                    console.info('event called [' + event.name + ']:');
                    console.info(data);
                });
                //console.info(CRUD_EVENT[k]);
            }


        }

    });

    module.register.controller('crudViewController', function ($scope, $modal, $http, $rootScope, Mobile, Busy, crudItemService, Error, Message, $timeout, Live, Lightbox) {

        if (Object.keys($scope.$parent.datagrid.data).length == 0) {
            $scope.$parent.datagrid.get();
        }

        $scope.checkedAll = false;

        Busy.isBusy(false);

        $scope.items = [];
        crudItemService.reset();

        $scope.registerItems = function (item) {
            $scope.items.push(item);
            crudItemService.add(item);
        };

        $scope.reverse = true;
        $scope.isLive = $scope.$parent.crud.isLive;

        $scope.$on('$liveUpdate', function (e, data) {

            var module = $scope.module;

            if(data[module] > 0) {
                $rootScope.live.data[module] = 0;
                var request = $http.get(routes.datagridLive, {module: $scope.module});

                request.success(function (data) {
                    var items = $scope.$parent.datagrid.data;

                    if(data.length > 0) {
                        for(var i in data) {
                            data[i].new = true;
                            items.push(data[i]);
                        }
                    }
                });
            }

        });

        $scope.$watch('isLive', function (newValue, oldValue) {
            if(newValue) {
                $rootScope.$broadcast(CRUD_EVENT.LIVE_REGISTER, {module: $scope.module});
                Live.add($scope.module);
            } else {
                $rootScope.$broadcast(CRUD_EVENT.LIVE_UNREGISTER, {module: $scope.module});
                Live.remove($scope.module);
            }
        });



        var updateLiveOption = function (event) {
            var opt = false;

            if(event.name == CRUD_EVENT.LIVE_REGISTER) {
                opt = true;
            } else {
                opt = false;
            }

            var req = $http.put(routes.liveUpdate, {opt: opt, module: $scope.module});
        };

        $scope.$on(CRUD_EVENT.LIVE_REGISTER, updateLiveOption);
        $scope.$on(CRUD_EVENT.LIVE_UNREGISTER, updateLiveOption);

        $scope.selectAll = function () {
            angular.forEach($scope.items, function (item) {
                if ($scope.checkedAll) {
                    item.selected = false;
                } else {
                    item.selected = true;
                }
            });
            $scope.checkedAll = !$scope.checkedAll;
            $rootScope.$broadcast(($scope.checkedAll ? CRUD_EVENT.DATAGRID_CHECKEDALL : CRUD_EVENT.DATAGRID_UNCHECKEDALL), $scope.items);
        };


        $scope.changeOrder = function (predicate) {
            if (predicate == $scope.$parent.datagrid.predicate) {
                $scope.reverse = !$scope.reverse;
            } else {
                $scope.reverse = true;
            }
            $scope.$parent.datagrid.predicate = predicate;

        };


        var viewModalCtrl = function ($scope, $modalInstance, $sce, data) {
            $scope.data = data;
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.toHtml = function (value) {
                return $sce.trustAsHtml(value + '');
            };

            $scope.delete = function () {
                $modalInstance.dismiss('cancel');
                $rootScope.$broadcast(CRUD_EVENT.DELETE_REQUEST, {item: {id: data.data[0].value}});
            };

            $scope.print = function (id) {
                var frame = $('<iframe></iframe>');
                $(frame).attr('src', routes.printItem + '?id=' + id + '&module=' + module);
                $(frame).css('width', 0).css('height', 0);
                $('body').append(frame);

                $rootScope.$broadcast(CRUD_EVENT.VIEW_PRINT, id);
            };
        };

        var module = $scope.$parent.module;

        $scope.viewObject = function (id) {
            var modalInstance = $modal.open({
                templateUrl: config.view.get('ViewModal', 'html', 'crud'),
                controller: viewModalCtrl,
                resolve: {
                    data: {},
                    load: function ($q, $http, Busy, Error) {
                        Busy.isBusy(true);
                        var defer = $q.defer();
                        var request = $http({url: routes.viewDatagrid, params: {'module': module, 'id': id}});
                        request.success(function (data) {
                            Busy.isBusy(false);
                            $scope.value = data;
                            defer.resolve(data);
                            $rootScope.$broadcast(CRUD_EVENT.VIEW_OPEN, data);
                        }).error(function (msg, code) {
                            Busy.isBusy(false);
                            if (code >= 500) {
                                Error.show('Ocorreu um erro na visualização do item', code);
                            } else if (code == 404) {
                                Error.show('Não foi possível encontrar o arquivo ' + routes.viewDatagrid, code);
                            } else {
                                Error.show(msg, code);
                            }
                        });
                        return defer.promise;
                    }
                },
                windowClass: 'modal viewDialog'
            });
        };

        var deleteItems = function (items) {

            var request = $http.delete(routes.delete, {items: items});
            Busy.isBusy(true);

            request.success(function (data) {
                Busy.isBusy(false);
                if (data.delete == true) {
                    Message.show('success', 'Itens removidos', 0, 5000);
                    $scope.datagrid.get();
                    $rootScope.$broadcast(CRUD_EVENT.DELETE_OK, {items: items});
                }

            }).error(function (msg, code) {
                Busy.isBusy(false);
                if (code >= 500) {
                    Error.show('Erro ao deletar os items', code);
                } else if (code == 404) {
                    Error.show('Não foi possível encontrar o arquivo ' + routes.delete, code);
                } else {
                    Error.show(msg, code);
                }

                $rootScope.$broadcast(CRUD_EVENT.DELETE_ERROR, {items: items});
            });

        };

        var deleteModalCtrl = function ($scope, $modalInstance, data) {
            $scope.items = data;
            $scope.cancel = function () {
                $rootScope.$broadcast(CRUD_EVENT.DELETE_CLOSE, {items: data});
                $modalInstance.dismiss('cancel');
            };
            $scope.confirm = function () {
                $rootScope.$broadcast(CRUD_EVENT.DELETE_CLOSE, {items: data});
                $modalInstance.dismiss('cancel');
                deleteItems(data);
            };
        };


        $scope.searchDynamic = function () {
            $scope.query["$"] = $scope.search;
            $rootScope.$broadcast(CRUD_EVENT.SEARCH_SUBMIT, $scope.search);
        };

        $scope.clearSearch = function () {
            $scope.query["$"] = $scope.search = "";
            $rootScope.$broadcast(CRUD_EVENT.SEARCH_SUBMIT, $scope.search);
        };

        $scope.deleteItem = function (item) {
            $rootScope.$broadcast(CRUD_EVENT.DELETE_REQUEST, {item: item});
        };

        $scope.selectItem = function (item) {
            item.selected = !item.selected;
            $scope.upload.close();
        }

        $scope.attachItem = function (item) {
            item.selected = false;
            $scope.upload.open(item);
        };


        $scope.deleteSelected = function (isMultiple, itemSelected) {
            var items = crudItemService.get();
            var ids = [];

            if (isMultiple) {
                angular.forEach(items, function (item) {
                    if (item.selected) {
                        ids.push(item);
                    }
                });
            } else {
                ids = [itemSelected];
            }

            if (ids.length > 0) {
                var modalInstance = $modal.open(
                    {
                        templateUrl: config.view.get('DeleteModal', 'html', 'crud'),
                        controller: deleteModalCtrl,
                        resolve: {
                            data: {},
                            load: function ($q) {
                                var defer = $q.defer();
                                defer.resolve(ids);
                                return defer.promise;
                            }
                        },
                        windowClass: 'deleteDialog'
                    }
                );
            } else {
                Message.show('info', 'Selecione pelo menos um item', 0, 4000);
            }
        };


        $scope.$on(CRUD_EVENT.DELETE_REQUEST, function (event, data) {
            if (data.item != undefined) {
                $scope.deleteSelected(false, data.item);
            }
        });

        $scope.query = {};

        $scope.isMobile = false;

        $scope.$on(CRUD_EVENT.DATAGRID_COMPLETE, function () {
            setTimeout(function () {
                if (!Mobile.isMobile()) {
                    $scope.isMobile = false;
                } else {
                    $scope.isMobile = true;

                    $('.table-datagrid tbody tr').bind('taphold', function (event) {
                        $(this).addClass('touched');
                    }).bind('touchend', function (event) {

                        if ($(this).hasClass('touched')) {
                            $scope.viewObject($(this).attr('id'));

                        }
                        $(this).removeClass('touched');
                    });
                }

            }, 1000);
        });


        $scope.$watch('filter', function (newValue) {
            if(newValue) {
                $rootScope.$broadcast(CRUD_EVENT.SEARCH_OPEN, {});
            } else {
                $rootScope.$broadcast(CRUD_EVENT.SEARCH_CLOSE, {});
            }
        });

        var headerAdjust = function () {
            $('.crud-container .table-datagrid thead th').each(function (index) {
                $('.crud-container .header-fixed ul li:eq(' + index + ')').width($(this).width() + 8);
            });
        };

        $('.crud-container .header-fixed').bind('show', headerAdjust);


        var headerCtrl = function () {
            var ws = $(window).scrollTop();
            var table = $('.crud-container .table-datagrid').scrollTop();
            var margin = 210;

            if ($('.crud-container div.search').height() > 0) {
                margin = 330;
            }

            if (this.ws == undefined) {
                this.table = table;
            }

            if (ws > (this.table + margin)) {
                if (!$('.crud-container .header-fixed').is(':visible')) {
                    $('.crud-container .header-fixed').trigger('show').show();
                }
                if ($('.notification, .bar-notification').is(':visible')) {
                    $('.notification, .bar-notification').hide();
                }
            } else {
                if (!$('.notification, .bar-notification').is(':visible')) {
                    $('.notification, .bar-notification').show();
                }

                if ($('.crud-container .header-fixed').is(':visible')) {
                    $('.crud-container .header-fixed').hide();
                }
            }
        };


        $(window).bind('resize', headerAdjust);

        headerAdjust();

        $(window).bind('scroll', headerCtrl);

        if (Mobile.isMobile()) {
            $(window).bind('touchmove touchend', headerCtrl);
        }

        $scope.$watch('upload.itemSelected', function () {
            if($scope.upload.attach.show) {
                $scope.upload.attach.open(true);
            }
        });

        $scope.upload = {
            itemSelected: null,
            opened: false,
            closed: true,
            progress: 0,
            isProcess: false,
            totalFiles: 0,
            title: null,
            fullsize: false,
            isFullsize: false,
            toFull: function () {
                if(this.isFullsize) {
                    if(!this.fullsize) {
                        this.fullsize = true;
                        this.closed = false;
                    } else {
                        this.fullsize = false;
                        this.close = false;
                    }
                }
            },

            minimize: function () {
                this.closed = !this.closed;
                this.fullsize = false;
            },
            setTitle: function (progress) {
                if(!this.title) {
                    this.title = $('title').html();
                }

                $('title').html(progress + '%' + ' | ' + this.title);
            },
            clearTitle: function () {
                $('title').html(this.title);
            },
            setFavicon: function (href) {
                var link = document.createElement('link');
                link.id = 'dynamic-favicon';
                link.rel = 'shortcut icon';
                link.href = href;
                $('#dynamic-favicon').remove();

                $(document.head).append(link);
            },
            changeFavicon: function (isTotal) {
                if(isTotal) {
                    this.setFavicon('/favicon-upload-success.ico');
                } else {
                    this.setFavicon('/favicon-upload.ico');
                }
            },
            defaultFavicon: function () {
                this.setFavicon('/favicon.ico');
            },
            open: function (item) {
                if(item == this.itemSelected) {
                    this.close();
                } else {
                    if(this.attach.show == true || item.badge == undefined) {
                        item.badge = 0;
                        item.uploads = {};
                        item.uploads.processed = 0;
                        item.uploads.completed = 0;
                    }



                    this.itemSelected = item;
                    this.opened = true;
                    this.closed = false;
                    $('.dz-preview').hide();
                    $('.dz-preview.c'+ item.id).show();



                    $('html, body').animate({scrollTop: $('tr#' + item.id).offset().top - (document.body.clientHeight/2)}, 2000);
                }

            },
            close: function () {
                if(!this.isProcess) {
                    this.opened = false;
                    this.closed = true;
                    this.itemSelected = null;
                } else {
                    this.closed = true;
                }

                $scope.upload.attach.close();
            },


            attachCtrl: function ($scope, $modalInstance, $http, data) {
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.confirm = function (item) {
                    $scope.isLoading = true;
                    var request = $http.post(routes.attachLink, {url: item.url});

                    request.success(function (resp) {
                        if(resp.attach == true) {
                            $modalInstance.dismiss('cancel');
                            Message.show('success', 'Link anexado');
                            data.badge++;
                            data.attachs++;
                        }
                    });
                };
            },

            attachLink: function () {

                var modal = $modal.open(
                    {
                        templateUrl: config.view.get('AttachLinkModal', 'html', 'crud'),
                        controller: this.attachCtrl,
                        resolve: {
                            data: {},
                            link: function ($q) {
                                var defer = $q.defer();
                                defer.resolve($scope.upload.itemSelected);
                                return defer.promise;
                            }
                        },
                        windowClass: 'attachModal'
                    }
                );


            },

            attach: {
                show: false,
                items: [],
                images: [],
                isLoading: false,
                sortableTimeout: null,
                isSelectAll: false,
                sortableOptions: {
                    "ui-floating": true,
                    'placeholder': 'portlet-placeholder',
                    update: function (e, ui) {
                        var idx = $scope.upload.attach.getItemPosition(ui.item.scope().item);
                        $http.put(routes.attachSortable, {item: ui.item.scope().item, idx: idx});
                    }
                },

                getItemPosition: function(item) {
                    var items = $scope.upload.attach.items;
                    var idx = null;
                    for(var c in items) {
                        if(items[c] == item) {
                            idx = c;
                        }
                    }

                    return idx;
                },
                thumbPreview: routes.thumbPreview,
                resizeElements: function () {
                    try {
                        var areaTotal = document.body.clientWidth - 125;
                        var columns = Math.round(areaTotal/180);
                        var width = (areaTotal) / columns;
                        $('#attach-list li').width(width - 1);



                        if($scope.upload.attach.items.length <= columns * 2) {
                            $scope.upload.isFullsize = false;
                        } else {
                            $scope.upload.isFullsize = true;
                        }

                        $scope.$apply();

                    } catch(e) {
                        $(window).unbind(this.resizeElements);
                    }
                },
                open: function (notSwap) {
                    if(!notSwap) {
                        this.show = !this.show;
                    }

                    this.isSelectAll = false;

                    if(this.show) {
                        $scope.upload.itemSelected.badge = 0;


                        //var scroll = new IScroll('#attach-list', {mouseWheel: true});
                        this.items = [];

                        this.isLoading = true;

                        var request = $http.get(routes.attachs, {
                            params: {
                                'module': module,
                                'id': $scope.upload.itemSelected.id
                            }
                        });


                        request.success(function (resp) {
                            $scope.upload.attach.items = resp;
                            $scope.upload.attach.isLoading = false;
                            $scope.upload.attach.prepareImages();

                            setTimeout($scope.upload.attach.resizeElements, 400);
                            $(window).unbind('resize', $scope.upload.attach.resizeElements).bind('resize', $scope.upload.attach.resizeElements);
                        });
                    } else {
                        this.close();
                    }


                },

                prepareImages: function () {

                    this.images = [];

                     for(var i in this.items) {
                         if(this.items[i].type == 'image/jpeg' || this.items[i].type == 'image/png' || this.items[i].type == 'image/gif') {
                            this.images.push(this.items[i]);
                         }
                     }
                },

                getImageIndex: function (filename) {
                    var idx = 0;

                    for(var i in this.images) {
                       if(this.images[i].filename == filename) {
                           idx = i;
                       }
                    }

                    return idx;
                },
                close: function () {
                    this.show = false;
                    this.isProcess = false;
                    $scope.upload.isFullsize = false;
                },

                editCtrl: function ($scope, $http, $modalInstance, data) {
                    $scope.data = data.item;
                    $scope.thumbPreview = data.thumbPreview;
                    $scope.idx = data.idx;
                    $scope.totalItems = data.items.length;
                    $scope.item = {position: data.idx};


                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.getRange = function (total) {
                        return new Array(total);
                    };

                    $scope.confirm = function (item) {
                        $scope.isLoading = true;
                        var request = $http.post(routes.attachSubtitle, {item: data.item, subtitle: item.subtitle, position: item.position});
                        request.success(function () {

                            if(item.subtitle != undefined)  {
                                data.item.subtitle = item.subtitle;
                            }

                            if(item.position != $scope.idx) {
                                $scope.position(item.position);
                            }

                            $scope.isLoading = false;
                            $modalInstance.dismiss('cancel');
                        });
                    };

                    $scope.position = function (pos) {
                        data.items.splice(this.idx, 1);

                        for (var i = data.items.length; i > pos ; i--) {
                            data.items[i] = data.items[i-1];
                        }

                        data.items[pos] = data.item;


                    };

                },
                edit: function (item) {
                    var modal = $modal.open({
                        templateUrl: config.view.get('AttachEditModal', 'html', 'crud'),
                        windowClass: 'attachModal',
                        controller: this.editCtrl,
                        resolve: {
                            data: {},
                            link: function ($q) {
                                var defer = $q.defer();
                                defer.resolve({item: item, thumbPreview: $scope.upload.attach.thumbPreview, idx: $scope.upload.attach.getItemPosition(item), items: $scope.upload.attach.items});
                                return defer.promise;
                            }
                        }
                    });
                },

                selectAll: function () {
                    this.isSelectAll = !this.isSelectAll;

                    for(var i in this.items) {
                        this.items[i].selected = this.isSelectAll;
                    }
                },

                deleteCtrl: function ($scope, $modalInstance, data) {
                    $scope.items = data;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };
                },

                deleteSelected: function () {
                    var items = [];

                    angular.forEach(this.items, function (item) {
                        if(item.selected === true) {
                            items.push(item);
                        }
                    });

                    if(items.length > 0) {
                        var modal = $modal.open({
                            templateUrl: config.view.get('AttachDeleteModal', 'html', 'crud'),
                            controller: this.deleteCtrl,
                            windowClass: 'deleteModal',
                            resolve: {
                                data: {},
                                link: function ($q) {
                                    var defer = $q.defer();
                                    defer.resolve(items);
                                    return defer.promise;
                                }
                            }
                        });
                    }


                },
                openLightbox: function (item) {

                    var imgs = [];

                    for(var i in this.images) {
                        imgs.push({url: this.images[i].file});
                    }

                    Lightbox.openModal(imgs, this.getImageIndex(item.filename));
                }
            }
        };

        //Dropzone.options.

        var dz = new Dropzone('div#area-upload', { url: routes.upload, dictDefaultMessage: '' });

        dz.on('processing', function () {
            $scope.upload.isProcess = true;
            $scope.$apply();
        });

        dz.on('addedfile', function (file) {
            file.item = $scope.upload.itemSelected;
            file.item.uploads.processed++;

            $(file.previewTemplate).addClass('c'+file.item.id);

        })

        dz.on('totaluploadprogress', function (total) {
            //$scope.upload.progress = Math.round(totalBytesSent / totalBytes) * 100;
            $scope.upload.progress = Math.round(total);
            $scope.upload.setTitle(Math.round(total));
            $scope.$apply();
        });

        dz.on('sending', function (file, xhr, formData) {
            formData.append('id', file.item.id);
        });

        dz.on('complete', function (file) {
            file.item.badge++;
            file.item.attachs++;
            file.item.uploads.completed++;
            $scope.$apply();
        });

        dz.on('success', function (file) {
            $(file.previewElement).fadeOut(400, function () {
                $(this).remove();
            });
        });

        dz.on('queuecomplete', function () {
            $scope.upload.clearTitle();
            $scope.upload.isProcess = false;

            if(!$rootScope.windowFocus) {
                $scope.upload.changeFavicon(true);

                var fct = function () {
                    if($scope) {
                        $scope.upload.defaultFavicon();
                    } else {
                        $(window).unbind('focus', fct);
                    }
                };

                $(window).bind('focus', fct);
            } else {
                $scope.upload.defaultFavicon();
            }
            //

            $timeout(function () {
                $scope.upload.progress = 0;
                Message.show('success', 'Todos arquivos foram anexados', null, 10000);
            }, 3000);
        });


        $scope.$watch('upload.isProcess', function (newValue, oldValue) {
            if(newValue) {
                $scope.upload.changeFavicon(false);
                $rootScope.$broadcast('$disableLeftMenu');
            } else {
                $rootScope.$broadcast('$enableLeftMenu');
            }
        });


        window.onbeforeunload = function (e) {

            if($scope.upload.isProcess) {
                var message = "Você deseja realmente sair da página, existem uploads processando no momento e serão cancelados",
                    e = e || window.event;
                // For IE and Firefox
                if (e) {
                    e.returnValue = message;
                }

                // For Safari
                return message;
            }

        };

    });
});