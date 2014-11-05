<div ng-controller="CustomController">
    <button ng-click="activeItem(item)" class="btn btn-primary btn-xs" ng-disabled="item.statusNumber == 2 || item.statusNumber == 0">Ativar</button>
    <button ng-click="desactiveItem(item)" class="btn btn-danger btn-xs" ng-disabled="item.statusNumber == 1 || item.statusNumber == 0">Inativar</button>
</div>