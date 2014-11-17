<div class="insert">
    <form class="form" name="insertForm" ng-submit="update(data)">
        <div class="form-body">
            <div class="form-group">
                <label class="form-label">Cliente</label>
                <div class="input-group" ng-controller="customInsertController">
                        <lazyload src="http://cdnjs.cloudflare.com/ajax/libs/selectize.js/0.8.5/css/selectize.default.css" type="css"></lazyload>
                        <lazyload src="custom/css/select.css" type="css"></lazyload>
                        <ui-select ng-init="test()" theme="bootstrap" ng-model="$parent.data.scliente">
                            <ui-select-match placeholder="Digite um cliente">{{$select.selected.name}}</ui-select-match>
                            <ui-select-choices repeat="cliente in clientes | propsFilter: {name: $select.search, age: $select.search}">
                                <div ng-bind-html="cliente.name | highlight: $select.search"></div>
                                <small>
                                    email: {{cliente.email}}
                                    age: <span ng-bind-html="''+cliente.age | highlight: $select.search"></span>
                                </small>
                            </ui-select-choices>
                        </ui-select>
                    <div class="input-group-addon"><span class="glyphicon glyphicon-user"></span></div>
                </div>

            </div>
            <div class="form-group has-feedback" ng-class="{'has-success': insertForm.nome.$valid, 'has-error': insertForm.nome.$invalid && insertForm.nome.$dirty}">
                <label class="control-label">Nome</label>
                <input ng-model="data.nome" type="text" value="" name="nome" required="required" placeholder="Ex: value" class="form-control" />
                <span class="glyphicon form-control-feedback" ng-class="{'glyphicon-ok': insertForm.nome.$valid, 'glyphicon-remove': insertForm.nome.$invalid && insertForm.nome.$dirty}"></span>
            </div>
            <div class="form-group has-feedback" ng-class="{'has-success': insertForm.email.$valid, 'has-error': insertForm.email.$invalid && insertForm.email.$dirty}">
                <label class="control-label">Email</label>
                <input ng-model="data.email" type="email" required="required" name="email" value="" placeholder="Ex: email@domain.com" class="form-control" />
                <span class="glyphicon form-control-feedback" ng-class="{'glyphicon-ok': insertForm.email.$valid, 'glyphicon-remove': insertForm.email.$invalid && insertForm.email.$dirty}"></span>
            </div>
            <div class="form-group">
                <label>Status</label> <br/>
                <label class="radio-inline"><input type="radio" ng-model="data.status" value="1" />Ativo</label>
                <label class="radio-inline"><input type="radio" ng-model="data.status" value="2" />Inativo</label>
            </div>

            <div class="form-group">
                <label>Descrição</label>
                <text-angular ng-required="true" name="descr" ng-model="data.descr"></text-angular>
            </div>
            <!--<div>
                <label> Anexos</label>
                <input multiple type="file" class="form-control" name="arquivo[]" id="files">

                <button ng-click="openTest()" class="btn btn-danger">Teste</button>
            </div>-->
        </div>

        <div class="form-group form-bar" ng-class="{'uploaded': ($root.upload.opened)}">
            <button class="btn btn-success" ng-disabled="insertForm.$invalid" type="submit">Atualizar</button>
            <button class="btn btn-warning pull-right" ng-disabled="!insertForm.$dirty" ng-click="data=null" type="reset">Limpar</button>
        </div>
    </form>
</div>
<div class="preview">
    <div class="form-body">
        <div class="form-group">
            <label custom-tooltip="Sim">Cliente</label>
            <p>{{data.scliente.name}}</p>
        </div>
        <div class="form-group">
            <label custom-tooltip="Sim">Nome</label>
            <p>{{data.nome}}</p>
        </div>
        <div class="form-group">
            <label>E-mail</label>
            <p>{{data.email}}</p>
        </div>
        <div class="form-group">
            <label>Status</label>
            <p ng-switch="data.status">
                <span ng-switch-when="1">Ativo</span>
                <span ng-switch-when="2">Inativo</span>
                &nbsp;
            </p>
        </div>
        <div class="form-group">
            <label>Descrição</label>
            <div ng-bind-html="data.descr | toHtml" class="container-html"></div>
        </div>
    </div>
</div>