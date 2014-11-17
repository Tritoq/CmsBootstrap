/**
 * Created by arturmagalhaes on 25/09/14.
 */
define([], function () {
    'use strict';

    var event = {
        'DATAGRID_LOAD'                             : 'crud.datagrid.load',
        'DATAGRID_COMPLETE'                         : 'crud.datagrid.complete',
        'DATAGRID_CHECKEDALL'                       : 'crud.datagrid.checkedall',
        'DATAGRID_UNCHECKEDALL'                     : 'crud.datagrid.uncheckedall',
        'DATAGRID_PAGE_CHANGE'                      : 'crud.datagrid.page_change',

        'VIEW_OPEN'                                 : 'crud.view.open',
        'VIEW_CLOSE'                                : 'crud.view.close',
        'VIEW_PRINT'                                : 'crud.view.print',

        'DELETE_SHOW'                               : 'crud.delete.show',
        'DELETE_CLOSE'                              : 'crud.delete.close',
        'DELETE_OK'                                 : 'crud.delete.ok',
        'DELETE_ERROR'                              : 'crud.delete.error',

        'SEARCH_OPEN'                               : 'crud.search.open',
        'SEARCH_CLOSE'                              : 'crud.search.close',
        'SEARCH_SUBMIT'                             : 'crud.search.submit',
        'SEARCH_REQUEST'                            : 'crud.search.request',

        //
        'LIVE_REGISTER'                             : 'crud.live.register',
        'LIVE_UNREGISTER'                           : 'crud.live.unregister',

        // REQUEST

        'DELETE_REQUEST'                            : 'crud.delete.request',

        // ATTACHS

        'UPLOAD_OPEN'                               : 'crud.upload.open',
        'UPLOAD_CLOSE'                              : 'crud.upload.close',
        'UPLOAD_ADDED'                              : 'crud.upload.added',
        'UPLOAD_MINIMIZE'                           : 'crud.upload.minimize',
        'ATTACH_DELETE_REQUEST'                     : 'crud.attach.delete.request',
        'ATTACH_DELETE_SUCCESS'                     : 'crud.attach.delete.success',
        'ATTACH_DELETE_ERROR'                       : 'crud.attach.delete.error'

    };

    return event;
});