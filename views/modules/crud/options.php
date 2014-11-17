<div class="cellOptions">
    <button class="update" title="Atualizar" ng-click="updateItem(item)">Atualizar</button>
    <button class="attach" ng-click="attachItem(item)" title="Anexar">Anexos</button>
    <span class="attachNumber" ng-class="{'badged': item.badge > 0}"title="{{item.attachs}} arquivos anexados">{{item.attachs}}</span>
    <button class="delete" ng-click="deleteItem(item)" title="Excluir">Deletar</button>
</div>