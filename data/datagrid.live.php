<?php


$status = array(
    'out' => 'Indisponível',
    'off' => 'Inativo',
    'on' => 'Ativo'
);

$keys = array('out', 'off', 'on');

for ($i = 0; $i < 5; $i++) {


    $r = rand(0, 2);
    $e = rand(0, 4);

    $data[] = array(
        'id' => $i + 1000000,
        'nome' => 'Novo registro ao-vivo' . $i,
        'estoque' => $e,
        'status' => $status[$keys[$r]],
        'custominfo' => rand(3000, 10000),
        'statusNumber' => $r,
        'attachs' => 0,
        'className' => $keys[$r] . ($e === 0 ? ' nostock ' : '')
    );
}

//echo json_encode($data);