<div ng-controller="uploadController" id="upload" ng-class="{'closed': upload.closed, 'open': !upload.closed, 'chidden': !upload.opened, 'fullsize': upload.fullsize }">
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
            <span ng-show="upload.itemSelected.badge > 0" class="label label-warning badged">{{upload.itemSelected.badge}}</span>
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
                            <a href="" class="delete" title="Excluir" ng-click="upload.attach.delete(item)"><span class="glyphicon glyphicon-remove"></span></a>
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