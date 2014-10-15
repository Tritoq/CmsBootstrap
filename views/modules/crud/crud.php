<?php
//sleep(10);
?>
<div class="crud">
    <div class="bar"><h1>{{crud.title}}</h1></div>

    <div class="crud-container">
       <ul class="tab">
           <li><a href="#/{{module}}.crud/view" class="view" ng-class="{selected: ('crud.view' | routeSegmentEqualsTo)}">Visualizar</a></li>
           <li><a href="#/{{module}}.crud/insert" class="insert" ng-class="{selected: ('crud.insert' | routeSegmentEqualsTo)}">Inserir</a></li>
           <li><a href="#/{{module}}.crud/update" class="update" ng-class="{selected: tabs.update}">Atualizar</a></li>
           <li><a href="#/{{module}}.crud/search" class="search" ng-class="{selected: tabs.search}">Pesquisar</a></li>
           <li><a href="#/{{module}}.crud/config" class="config" ng-class="{selected: tabs.search}">Preferências</a></li>
       </ul>
       <div class="content" id="grid-container">
           <div class="loader" ng-show="loading">Carregando</div>
           <div app-view-segment="1" ng-hide="loading"></div>
       </div>
    </div>
</div>