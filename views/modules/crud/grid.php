<!--<div class="datagrid" ng-grid="gridOptions"></div>-->
<div class="control-bar">
    <ul class="actions">
        <li><a href="" class="pdf" title="Exportar para PDF">PDF</a></li>
        <li><a href="" class="csv" title="Exportar para CSV">csv</a></li>
        <li><a href="" class="search" title="Filtrar no GRID" ng-class="{'selected': filter}" ng-click="filter = !filter">Filtrar</a></li>
    </ul>

    <ul class="stats">
        <li class="total">{{$parent.datagrid.total | number:0}} | {{$parent.datagrid.interval}}</li>
        <li class="pages">
            <a href="" ng-click="$parent.datagrid.get(page)" ng-repeat="page in $parent.datagrid.pages" ng-class="{'selected': page == $parent.datagrid.currentPage}">{{ page }}</a>
        </li>
    </ul>
</div>
<div class="search" ng-class="{'opened': filter}">
    <div>
    <h2>Pesquisa Dinâmica</h2>
        <form class="form-inline">
        <div class="form-group">
            <ul>
            <li ng-repeat="column in $parent.datagrid.columns"><label><input type="checkbox" checked="checked" /> {{column.displayName}}</label></li>
            </ul>
        </div>
        <div class="clear clearfix"></div>
        <div class="form-group">
            <input type="text" class="form-control" placeholder="Digite a palavra chave" /><button class="btn btn-primary">Buscar</button>
        </div>
        </form>
    </div>
</div>
<div class="header-fixed">
    <ul>
        <li><input type="checkbox" ng-click="selectAll()" ng-model="checkedAll" /></li>
        <li ng-repeat="column in $parent.datagrid.columns"> {{column.displayName}}</li>
        <li class="option">Opções</li>
    </ul>
</div>
<table class="table-datagrid">
   <thead>
        <tr>
            <th><input type="checkbox" ng-click="selectAll()" ng-model="checkedAll"  /></th>
            <th ng-repeat="column in $parent.datagrid.columns"> {{column.displayName}}</th>
            <th class="option">Opções</th>
        </tr>
   </thead>
    <tbody>
    <tr ng-repeat="item in $parent.datagrid.data" ng-click="item.selected = !item.selected" ng-class="{'selected': (item.selected )}">
            <td><input type="checkbox" ng-model="item.selected" ng-init="registerItems(item)"  /></td>
            <td ng-repeat="column in $parent.datagrid.columns"> {{item[column.field]}}</td>
            <td class="option"><crudoption ng-bind-html="options"></crudoption></td>
    </tr>
    </tbody>
</table>