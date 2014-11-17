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
<table class="table-datagrid" disabled="disabled" ng-class="{'uploaded': !$root.upload.closed}">
   <thead>
        <tr>
            <th ng-class="{'orderer': column.field == $parent.datagrid.predicate, 'up': !reverse, 'down': reverse}" class="column clickable" id="{{column.field}}" ng-repeat="column in $parent.datagrid.columns" ng-click="changeOrder(column.field)"> {{column.displayName}}</th>
            <th ng-if="$parent.datagrid.custom_columns" ng-repeat="column in $parent.datagrid.custom_columns" class="{{column.field}}"></th>
            <th class="option">Opções</th>
        </tr>
   </thead>
    <tbody>
    <tr ng-dblclick="view(item.id)" ng-init="registerItems(item)"  id="{{item.id}}" ng-repeat="item in $parent.datagrid.data | orderBy:$parent.datagrid.predicate:reverse | filter:query" ng-class="{'selected': (item.selected), 'over': !isMobile, 'attach': $root.upload.itemSelected == item, 'new': item.new}">
            <td ng-click="selectItem(item)" ng-repeat="column in $parent.datagrid.columns" class="{{item.className}}"><span class="{{column.field}}">{{item[column.field]}}</span></td>
            <td ng-if="$parent.datagrid.custom_columns" class="{{column.field}}" ng-repeat="column in $parent.datagrid.custom_columns">
                <custom template="column.templateUrl" item="item"></custom>
            </td>
            <td class="option"><crudoption ng-bind-html="options"></crudoption></td>
    </tr>
    </tbody>
</table>
