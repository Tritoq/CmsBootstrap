<?php
//sleep(10);
?>
<div class="crud">
    <div class="bar"><h1>{{crud.title}}</h1></div>

    <div class="crud-container">
       <ul class="tab">
           <li><a href="#/{{module}}.crud?view" class="view" ng-class="{selected: tabs.view}">Visualizar</a></li>
           <li><a href="#/{{module}}.crud?insert" class="insert" ng-class="{selected: tabs.insert}">Inserir</a></li>
           <li><a href="#/{{module}}.crud?update" class="update" ng-class="{selected: tabs.update}">Atualizar</a></li>
           <li><a href="#/{{module}}.crud?search" class="search" ng-class="{selected: tabs.search}">Pesquisar</a></li>
       </ul>
       <div class="content">
            <div class="datagrid" ng-grid="gridOptions" ng-init="getDataGrid()"></div>
       </div>
    </div>
</div>