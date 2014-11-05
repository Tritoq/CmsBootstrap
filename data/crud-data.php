<?php
//sleep(1);
$data = file_get_contents("php://input");
$objData = json_decode($data);

$rdata['crud'] = array(
    "title" => ucwords($objData->module),
    'module' => $objData->module,
    "perms" => "Permissão Concedida",
    'css' => array('custom/css/custom.module.css'),
    'js' => array('custom/js/custom1.js'),
    'isLive' => ($objData->module == 'Produtos' ? true : false)
);

if ($objData->module == 'Produtos') {
    $rdata['crud']['group'] = array('custom/views/custom-group-grid.php');
}

echo json_encode($rdata);