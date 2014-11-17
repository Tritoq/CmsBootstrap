/**
 * Created by arturmagalhaes on 10/11/14.
 */
define(['../app/module', 'lazyload', 'config', 'routes', './crud.events', 'dropzone', 'jquery-mobile'], function (module, lazyload, config, routes, CRUD_EVENT, Dropzone) {

    'use strict';

     var module = module.register.controller('uploadController', function ($scope, $rootScope, $timeout, $http, $modal, Lightbox, Message, WindowNotification) {
         /**
          * Carregamento do CSS do plugin de UPLOAD externo
          */
        lazyload.css.addFile('css/components/dropzone/basic.css');

        $rootScope.upload = {};

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
                    if(item != undefined && (this.attach.show == true || item.badge == undefined)) {
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


                    if($('tr#' + item.id)) {
                        //$('html, body').animate({scrollTop: $('tr#' + item.id).offset().top - (document.body.clientHeight/2)}, 2000);
                    }

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


                deleteListener: function (event, data) {

                    var req = $http.post(routes.attachDelete, {items: data.items, id: data.id, module: data.module});

                    req.success(function (r) {
                        if(r.attach == true) {
                            $rootScope.$broadcast(CRUD_EVENT.ATTACH_DELETE_SUCCESS);
                        } else {
                            $rootScope.$broadcast(CRUD_EVENT.ATTACH_DELETE_ERROR);
                        }

                    });

                    req.error(function (r) {
                        $rootScope.$broadcast(CRUD_EVENT.ATTACH_DELETE_ERROR);
                    });

                    var items = $scope.upload.attach.items;

                    for(var i in items) {
                        for(var j in data.items) {
                            if(items[i] == data.items[j]) {
                                items.splice(i, 1);
                            }
                        }
                    }

                },

                deleteCtrl: function ($scope, $rootScope, $modalInstance, data, $http) {
                    $scope.items = data.items;

                    var itemSelected = data.itemSelected;

                    $scope.cancel = function () {
                        $modalInstance.dismiss('cancel');
                    };

                    $scope.confirm = function () {

                        $scope.isLoading = true;

                        $scope.$on(CRUD_EVENT.ATTACH_DELETE_ERROR, function () {
                            $modalInstance.dismiss('cancel');
                            Message.show('error', 'Não foi possível excluir');
                        });


                        $scope.$on(CRUD_EVENT.ATTACH_DELETE_SUCCESS, function () {
                            $modalInstance.dismiss('cancel');
                            Message.show('success', 'Anexos excluídos');
                        });


                        $rootScope.$broadcast(CRUD_EVENT.ATTACH_DELETE_REQUEST, {items: data.items, id: itemSelected.id, module: data.module});

                    };
                },

                deleteSelected: function (item) {
                    var items = [];

                    if(item == undefined) {
                        angular.forEach(this.items, function (item) {
                            if(item.selected === true) {
                                items.push(item);
                            }
                        });
                    } else {
                        items = [item];
                    }


                    if(items.length > 0) {
                        var modal = $modal.open({
                            templateUrl: config.view.get('AttachDeleteModal', 'html', 'crud'),
                            controller: this.deleteCtrl,
                            windowClass: 'deleteModal',
                            resolve: {
                                data: {},
                                link: function ($q) {
                                    var defer = $q.defer();
                                    defer.resolve({items: items, itemSelected: $scope.upload.itemSelected, module: $scope.module});
                                    return defer.promise;
                                }
                            }
                        });
                    }


                },

                "delete": function (item) {
                    this.deleteSelected(item);
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



        $scope.$watch('upload.itemSelected', function () {
            if($scope.upload.attach.show) {
                $scope.upload.attach.open(true);
            }

            $rootScope.upload.itemSelected = $scope.upload.itemSelected;
        });


         $scope.$watch('upload.isProcess', function (newValue, oldValue) {
             if(newValue) {
                 $scope.upload.changeFavicon(false);
                 $rootScope.$broadcast('$disableLeftMenu');
             } else {
                 $rootScope.$broadcast('$enableLeftMenu');
             }
         });


         $scope.$watch('upload.closed', function () {
             $rootScope.upload.closed = $scope.upload.closed;
         });

         $scope.$watch('upload.opened', function () {
             $rootScope.upload.opened = $scope.upload.opened;
         });


        $scope.$on(CRUD_EVENT.ATTACH_DELETE_REQUEST, $scope.upload.attach.deleteListener);


        $scope.$on(CRUD_EVENT.UPLOAD_OPEN, function (event, data) {
            $scope.upload.open(data);
        });

        $scope.$on(CRUD_EVENT.UPLOAD_CLOSE, function (event) {
            $scope.upload.close();
        });

         $scope.$on(CRUD_EVENT.UPLOAD_MINIMIZE, function (event) {
             if(!$scope.upload.closed) {
                 $scope.upload.minimize();
             }

         });


         $scope.$on(CRUD_EVENT.UPLOAD_ADDED, function (event) {

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

                    WindowNotification.send('Upload completo', 'Todos arquivos foram anexados');

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

            $rootScope.dz = dz;
             console.info(dz);
        });



    });

    return module;
});