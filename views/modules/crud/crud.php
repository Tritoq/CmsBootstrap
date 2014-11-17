<?php
//sleep(10);
?>
<div class="crud">
    <div class="bar"><h1>{{crud.title}}</h1></div>

    <div class="crud-container">
       <ul class="tab">
           <li><a href="#/{{module}}.crud/view" class="view" ng-class="{selected: ('crud.view' | routeSegmentEqualsTo)}"><span class="glyphicon glyphicon-th"></span> Visualizar</a></li>
           <li><a href="#/{{module}}.crud/insert" class="insert" ng-class="{selected: ('crud.insert' | routeSegmentEqualsTo)}"><span class="glyphicon glyphicon-plus"></span> Inserir</a></li>
           <li><a href="#/{{module}}.crud/update" class="update" ng-class="{selected: ('crud.update' | routeSegmentEqualsTo)}"><span class="glyphicon glyphicon-refresh"></span> Atualizar</a></li>
           <li><a href="#/{{module}}.crud/search" class="search" ng-class="{selected: tabs.search}"><span class="glyphicon glyphicon-search"></span> Pesquisar</a></li>
           <li><a href="#/{{module}}.crud/config" class="config" ng-class="{selected: tabs.search}"><span class="glyphicon glyphicon-cog"></span> Preferências</a></li>
       </ul>
       <div class="content" id="grid-container">
           <div class="loader" ng-show="loading">Carregando</div>
           <div app-view-segment="1" class="" ng-hide="loading"></div>
           <div class="clearfix"></div>
       </div>
        <div id="upload-container"></div>
    </div>
</div>