<!--<div class="datagrid" ng-grid="gridOptions"></div>-->
<div class="control-bar">
    <ul class="actions">
        <li class="selectall"><a ng-click="selectAll()" href="" ng-class="{'checked': checkedAll}" title="Selecionar todos"></a></li>
        <li><a href="" class="pdf" title="Exportar para PDF">PDF</a></li>
        <li><a href="" class="csv" title="Exportar para CSV">csv</a></li>
        <li><a href="" class="live" title="Habilitar a opção aovivo" ng-class="{'selected': isLive}" ng-click="isLive = !isLive"><span class="glyphicon glyphicon-flash"></span></a></li>
        <li><a href="" class="search" title="Filtrar no GRID" ng-class="{'selected': filter}" ng-click="filter = !filter">Filtrar</a></li>
        <li ng-repeat="item in groupCustom">
            <custom template="item"></custom>
        </li>

    </ul>

    <ul class="stats">
        <li class="total">{{$parent.datagrid.total | number:0}} | {{$parent.datagrid.interval}}</li>
        <li class="pages">
            <a href="" ng-click="$parent.datagrid.get(page)" ng-repeat="page in $parent.datagrid.pages" ng-class="{'selected': page == $parent.datagrid.currentPage}">{{ page }}</a>
        </li>
        <li class="delete">
            <a href="" title="Deletar selecionados" ng-click="deleteSelected(true)" ></a>
        </li>
    </ul>
</div>
<div class="search" ng-class="{'opened': filter}">
    <div>
    <h2>Filtro Dinâmico</h2>
        <form class="form-inline" ng-submit="searchDynamic()">
        <div class="form-group">

        </div>
        <div class="clear clearfix"></div>
        <div class="form-group">
            <input type="text" ng-init="search=''" class="form-control" ng-model="search" placeholder="Digite a palavra chave" /><button type="submit" class="btn btn-primary">Buscar</button>

            <a href="" class="" ng-click="clearSearch()" ng-init="query['$'] = ''" ng-hide="query['$'] == ''">Limpar busca</a>
        </div>
        </form>
    </div>
</div>
<div class="header-fixed">
    <ul>
        <li ng-repeat="column in $parent.datagrid.columns"> {{column.displayName}}</li>
        <li ng-repeat="column in $parent.datagrid.custom_columns"> {{column.displayName}}</li>
        <li class="option">Opções</li>
    </ul>
</div>
<div class="refresh">

</div>
<table class="table-datagrid" disabled="disabled" ng-class="{'uploaded': !upload.closed}">
   <thead>
        <tr>
            <th ng-class="{'orderer': column.field == $parent.datagrid.predicate, 'up': !reverse, 'down': reverse}" class="column clickable" id="{{column.field}}" ng-repeat="column in $parent.datagrid.columns" ng-click="changeOrder(column.field)"> {{column.displayName}}</th>
            <th ng-if="$parent.datagrid.custom_columns" ng-repeat="column in $parent.datagrid.custom_columns" class="{{column.field}}"></th>
            <th class="option">Opções</th>
        </tr>
   </thead>
    <tbody>
    <tr ng-dblclick="viewObject(item.id)" ng-init="registerItems(item)"  id="{{item.id}}" ng-repeat="item in $parent.datagrid.data | orderBy:$parent.datagrid.predicate:reverse | filter:query" ng-class="{'selected': (item.selected), 'over': !isMobile, 'attach': upload.itemSelected == item, 'new': item.new}">
            <td ng-click="selectItem(item)" ng-repeat="column in $parent.datagrid.columns" class="{{item.className}}"><span class="{{column.field}}">{{item[column.field]}}</span></td>
            <td ng-if="$parent.datagrid.custom_columns" class="{{column.field}}" ng-repeat="column in $parent.datagrid.custom_columns">
                <custom template="column.templateUrl" item="item"></custom>
            </td>
            <td class="option"><crudoption ng-bind-html="options"></crudoption></td>
    </tr>
    </tbody>
</table>
<div id="upload" ng-class="{'closed': upload.closed, 'chidden': !upload.opened, 'fullsize': upload.fullsize }">
    <div class="topbar">
        <div class="progress">
            <div class="progress-bar progress-bar-success progress-bar-striped active"  role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: {{upload.progress}}%">
                <span class="" ng-show="upload.progress > 0">{{upload.progress}}%</span>
            </div>
        </div>
        <a class="closeb"  href="" ng-click="upload.close()" title="Fechar" ng-disabled="upload.isProcess">
            <span class="glyphicon glyphicon-remove"></span>
        </a>
        <a title="Expandir" class="fullsize" href="" ng-click="upload.toFull()" ng-class="{'disabled': !upload.isFullsize}">
            <span class="glyphicon" ng-class="{'glyphicon-resize-full': !upload.fullsize, 'glyphicon-resize-small': upload.fullsize}"></span>
        </a>
        <a title="minimizar" class="" ng-class="{'minimize': !upload.closed , 'maximize': upload.closed}" href="" ng-click="upload.minimize()">
            <span class="glyphicon" ng-class="{'glyphicon-chevron-down': !upload.closed, 'glyphicon-chevron-up': upload.closed}"></span>
        </a>
    </div>
    <div>
        <a href="" ng-click="upload.attach.open()" class="bt-expand" title="Visualizar Anexos">
            <span ng-show="upload.itemSelected.badge > 0" class="label label-warning">{{upload.itemSelected.badge}}</span>
            <span class="glyphicon" ng-class="{'glyphicon-circle-arrow-left': !upload.attach.show, 'glyphicon-circle-arrow-right': upload.attach.show}"></span>
        </a>
        <div class="left" ng-class="{'sattach': upload.attach.show}">
            <a href="" ng-click="upload.attachLink()" class="url-attach" title="Adicionar uma URL">
                <span class="glyphicon glyphicon-link"></span>
            </a>
            <div id="area-upload" class="dropzone">

            </div>
        </div>
        <div class="right" ng-class="{'sattach': upload.attach.show}">
            <div class="menu-top">
                <a href="" title="Excluir selecionados" ng-click="upload.attach.deleteSelected()" class="delete"><span class="glyphicon glyphicon-remove"></span></a>
                <a href="" title="Selecionar todos" class="selectall" ng-click="upload.attach.selectAll()" ng-class="{'selected': upload.attach.isSelectAll}"><span class="glyphicon glyphicon-ok"></span></a>
            </div>
            <div class='title'>Anexos para {{upload.itemSelected.id}}</div>
            <div>
                <div class="preloader" ng-show="upload.attach.isLoading"></div>
                <ul class="list-attachs" id="attach-list" ui-sortable="upload.attach.sortableOptions" ng-model="upload.attach.items" >
                    <li ng-repeat="item in upload.attach.items" ng-class="{'selected': item.selected}">
                        <div class="layer">
                            <a href=""  ng-click="item.selected = !item.selected" ng-class="{'selected': item.selected}" title="Selecionar"><span class="glyphicon glyphicon-ok"></span></a>
                            <a href="" class="edit" title="Editar" ng-click="upload.attach.edit(item)"><span class="glyphicon glyphicon-pencil"></span></a>
                        </div>
                        <div class="layer mright">
                            <a href="" class="delete" title="Excluir"><span class="glyphicon glyphicon-remove"></span></a>
                            <a href="" ng-if="item.type == 'image/jpeg' || item.type == 'image/png' || item.type == 'image/gif'" class="expand" title="Expandir" ng-click="upload.attach.openLightbox(item)"><span class="glyphicon glyphicon-fullscreen"></span></a>
                        </div>
                        <a class="thumb" ng-dblclick="upload.attach.edit(item)" >
                            <div ng-if="item.type == 'image/jpeg' || item.type == 'image/png' || item.type == 'image/gif'" class="img" style="background: url('{{upload.attach.thumbPreview}}?filename={{item.filename}}') no-repeat center center">
                                <span title="{{item.subtitle}}" class="subtitle"> {{item.subtitle}}</span>
                            </div>
                            <div ng-if="item.type != 'image/jpeg' && item.type != 'image/png' && item.type != 'image/gif'" class="img file" mime="{{item.type}}">
                                <span title="{{item.subtitle}}" class="subtitle"> {{item.subtitle}}</span>
                            </div>
                        </a>

                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>