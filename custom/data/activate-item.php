<?php


$data = file_get_contents("php://input");
$objData = json_decode($data);

$id = $objData->id;
$module = $objData->module;

$r = 2;
$e = rand(0, 4);


$status = array(
    'out' => 'Indisponível',
    'off' => 'Inativo',
    'on' => 'Ativo'
);

$keys = array('out', 'off', 'on');

$item = array(
    'id' => $id,
    'nome' => 'Item changed (ativado)',
    'estoque' => $e,
    'status' => 'Ativo',
    'custominfo' => rand(3000, 10000),
    'statusNumber' => $r,
    'attachs' => rand(0, 200),
    'className' => $keys[$r] . ($e === 0 ? ' nostock ' : '')
);

echo json_encode($item);