<?php
//sleep(1);
$data = file_get_contents("php://input");
$objData = json_decode($data);

$rdata['crud'] = array(
    "title" =>  "Produtos " . $objData->module,
    'module' =>  $objData->module,
    "perms" => "Permissão Concedida"
);

echo json_encode($rdata);