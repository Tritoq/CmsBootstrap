/**
 * Created by arturmagalhaes on 21/08/14.
 */
define(['../app/module', 'lazyload', 'config', 'routes', './crud.events'], function (module, lazyload, config, routes, CRUD_EVENT) {

    'use strict';

    module.register.controller('crudController', function ($scope, $sce, $rootScope, $routeParams, crudDataService, Page, $http, $q, Error, crudItemService, $compile, $ocLazyLoad) {
        /* Carrega as informações do CRUD */
        /**
         * Recebe os valores de configuração do CRUD
         */
        var crudData = crudDataService.data.crud;

        /**
         * Armazena os valores do crud no escopo
         */
        $scope.crud = crudData;
        /**
         * Armazena o valor do módulo
         */
        $scope.module = crudData.module;

        /**
         * Quantos arquivos js customizados foram carregados
         * @type {number}
         */
        $scope.jsLoaded = 0;
        /**
         * Quantos arquivos js customizados tem no total
         */
        $scope.jsTotal = (crudData.js != undefined) ? crudData.js.length : 0;
        /**
         * Objeto de dados do datagrid
         * @type {{}}
         */
        $scope.datagridData = {};
        /**
         * Permissões do CRUD (Inserir, alterar, excluir, anexos)
         * @type {{}}
         */
        $scope.perms = crudData.perms;
        /**
         * Flag de carregamento
         * @type {boolean}
         */
        $scope.loading = false;

        /**
         * Flag de primeiro carregamento
         * @type {boolean}
         */
        $scope.firstLoad = false;


        /**
         * Seta o titulo da página
         */
        Page.setTitle(crudData.title);

        /**
         * Faz o carregamento preguiçoso dos arquivos CSS
         */
        lazyload.css.addFile(config.css.get('crud'));
        lazyload.css.addFile(config.css.get('crud.mobile', 'crud'));


        /**
         * Verifica o carregamento do módulo de Upload
         */
        if($scope.perms.attach) {
            require(['js/modules/crud/crud.upload'], function () {
                var req = $http.get(config.view.get('upload', null, 'crud'));
                req.success(function (r) {

                    var template = angular.element($compile(r)($scope));
                    var element = angular.element('#upload-container');
                    element.replaceWith(template);

                    $rootScope.$broadcast(CRUD_EVENT.UPLOAD_ADDED);

                });
            });
        }

        /**
         * Carregamento dos arquivos CSS para customização
         */
        if (crudData.css != undefined) {
            for (var i in crudData.css) {
                lazyload.css.addFile(crudData.css[i]);
            }
        }

        /**
         * Carregamento dos arquivos JS para customização
         */
        if (crudData.js != undefined) {
            for (var i in crudData.js) {
                require([crudData.js[i].replace('.js', '')], function () {
                    $scope.groupCustom = crudData.group;
                    $scope.jsLoaded = $scope.jsLoaded + 1;
                    $scope.$apply();
                });
            }
        }

        // Objetos
        /**
         * Exibe o carregador de refresh do CRUD
         *
         * @type {{value: boolean, show: Function, hide: Function}}
         */
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

        /**
         *
         * Objeto do datagrid de manipulação
         *
         * @type {{columns: {}, data: {}, pages: {}, options: {}, currentPage: number, interval: string, total: number, predicate: string, get: Function}}
         */
        $scope.datagrid = {
            /**
             * Colunas
             */
            columns: {},
            /**
             * Dados
             */
            data: {},
            /**
             * Páginas
             */
            pages: {},
            /**
             * Opções
             */
            options: {},
            /**
             * Página atual
             */
            currentPage: 1,

            interval: '',
            /**
             * Total de registros do grid
             */
            total: 0,

            /**
             * Coluna de ordenação do GRID
             */
            predicate: 'id',

            /**
             *
             * Faz o carregamento do grid
             *
             * @param page
             */
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
                // faz o carregamento de dados
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

                    // antes de popular o grid, verifica se tudo foi carregado (modulos customizados)
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


        // DEBUGGER

        if (config.debug) {
            for (var k in CRUD_EVENT) {
                $scope.$on(CRUD_EVENT[k], function (event, data) {
                    console.info('event called [' + event.name + ']:');
                    if(data != undefined) {
                        console.info(data);
                    }
                });
            }
        }

    });

    /**
     * controller do grid (visualização dos dados)
     */
    module.register.controller('crudViewController', function ($scope, $modal, $http, $rootScope, Mobile, Busy, crudItemService, Error, Message, $timeout, Live, Lightbox) {

        /**
         * Informa que não está mais ocupado
         */
        Busy.isBusy(false);

        /**
         * limpa os itens carregados
         */
        crudItemService.reset();

        if (Object.keys($scope.$parent.datagrid.data).length == 0) {
            $scope.$parent.datagrid.get();
        }

        /**
         *
         * @type {boolean}
         */
        $scope.checkedAll = false;
        /**
         * itens do grid
         * @type {Array}
         */
        $scope.items = [];
        /**
         * Ordenação decrescente
         * @type {boolean}
         */
        $scope.reverse = true;
        /**
         *  É ao vivo ?
         */
        $scope.isLive = $scope.$parent.crud.isLive;

        /**
         * Query para busca dinamica
         * @type {{}}
         */
        $scope.query = {};

        /**
         * É um dispositivo móvel ?
         * @type {boolean}
         */
        $scope.isMobile = false;

        /**
         * Resgata o nome do módulo
         */
        var module = $scope.$parent.module;


        // MODAL CONTROLLERS

        /**
         *
         * Controller da Visualização do item do Grid
         *
         * @param $scope
         * @param $modalInstance
         * @param $sce
         * @param data
         */
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

        /**
         * Função que executa a deleção dos registros
         * @param items
         */
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

        /**
         * Controller para deletar os itens selecionados
         * @param $scope
         * @param $modalInstance
         * @param data
         */
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

        // METHODS
        /**
         * Registra os itens do GRID
         * @param item
         */

        $scope.registerItems = function (item) {
            $scope.items.push(item);
            crudItemService.add(item);
        };

        /**
         *  Seleciona todos itens
         */
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


        /**
         * Metodo para visualizar o item
         * @param id
         */
        $scope.view = function (id) {
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

        /**
         * Faz a busca dinâmica no grid
         */
        $scope.searchDynamic = function () {
            $scope.query["$"] = $scope.search;
            $rootScope.$broadcast(CRUD_EVENT.SEARCH_SUBMIT, $scope.search);
        };

        /**
         * Limpa a busca
         */
        $scope.clearSearch = function () {
            $scope.query["$"] = $scope.search = "";
            $rootScope.$broadcast(CRUD_EVENT.SEARCH_SUBMIT, $scope.search);
        };

        /**
         * Faz a requisição para apagar um item
         * @param item
         */
        $scope.deleteItem = function (item) {
            $rootScope.$broadcast(CRUD_EVENT.DELETE_REQUEST, {item: item});
        };

        /**
         * Seleciona um item no grid
         * @param item
         */
        $scope.selectItem = function (item) {
            item.selected = !item.selected;

            $rootScope.$broadcast(CRUD_EVENT.UPLOAD_CLOSE);
        };

        /**
         * Abre a aba dos anexos
         * @param item
         */
        $scope.attachItem = function (item) {
            item.selected = false;
            $rootScope.$broadcast(CRUD_EVENT.UPLOAD_OPEN, item);
        };


        $scope.updateItem = function (item) {
            window.open('#/' + module + '.crud/update/' + item.id, '_self' );
        };

        /**
         * Muda a ordenação do Grid
         * @param predicate
         */
        $scope.changeOrder = function (predicate) {
            if (predicate == $scope.$parent.datagrid.predicate) {
                $scope.reverse = !$scope.reverse;
            } else {
                $scope.reverse = true;
            }
            $scope.$parent.datagrid.predicate = predicate;
        };

        /**
         * Delete os selecionados
         * @param isMultiple
         * @param itemSelected
         */
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





        // LISTENERS

        /**
         * Controla quando há uma atualização aovivo, busca os novos itens
         */
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

        /**
         * Handle listener para quando for marcado ou desrmacado a opção de aovivo do CRUD
         * @param event
         */

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

        /**
         * Ao requisitar para deletar um item
         */
        $scope.$on(CRUD_EVENT.DELETE_REQUEST, function (event, data) {
            if (data.item != undefined) {
                $scope.deleteSelected(false, data.item);
            }
        });

        /**
         * Quando terminar de carregar o grid
         */
        $scope.$on(CRUD_EVENT.DATAGRID_COMPLETE, function () {
            $timeout(function () {
                if (!Mobile.isMobile()) {
                    $scope.isMobile = false;
                } else {
                    $scope.isMobile = true;
                    $('.table-datagrid tbody tr').bind('taphold', function (event) {
                        $(this).addClass('touched');
                    }).bind('touchend', function (event) {

                        if ($(this).hasClass('touched')) {
                            $scope.view($(this).attr('id'));
                        }
                        $(this).removeClass('touched');
                    });
                }

            }, 1000);
        });

        // WATCHES

        /**
         * Verifica quando a opção mudou de valor e dispara o evento de registro do live
         */
        $scope.$watch('isLive', function (newValue) {
            if(newValue) {
                $rootScope.$broadcast(CRUD_EVENT.LIVE_REGISTER, {module: $scope.module});
                Live.add($scope.module);
            } else {
                $rootScope.$broadcast(CRUD_EVENT.LIVE_UNREGISTER, {module: $scope.module});
                Live.remove($scope.module);
            }
        });

        /**
         * Verifica quando a propriedade filter é mudada para abrir e fechar o campo de busca dinamica
         */
        $scope.$watch('filter', function (newValue) {
            if(newValue) {
                $rootScope.$broadcast(CRUD_EVENT.SEARCH_OPEN, {});
            } else {
                $rootScope.$broadcast(CRUD_EVENT.SEARCH_CLOSE, {});
            }
        });

        // Controladores de layout

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