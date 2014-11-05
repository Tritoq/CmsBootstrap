<?php
include('exception.php');
/**
 * @author Artur Magalhães <nezkal@gmail.com>
 */

$numb = rand(1, 1000);

if($numb === 1) {
    throwException(500);
}

$data = array();

$module = (isset($_GET['module']) ? $_GET['module'] : '');

$nomes_random = array(
    'Lorem Ipsum is simply dummy',
    'Contrary to popular belief',
    'Richard McClintock, a Latin professor',
    'Aliquam sed tortor et nulla dignissim',
    'Praesent tempus est mauris'
);


$status = array(
    'out' => 'Indisponível',
    'off' => 'Inativo',
    'on' => 'Ativo'
);

$keys = array('out', 'off', 'on');

for ($i = 99100; $i < 99150; $i++) {


    $r = rand(0, 2);
    $e = rand(0, 4);

    $data[] = array(
        'id' => $i,
        'nome' => $nomes_random[rand(0, sizeof($nomes_random)-1)],
        'estoque' => $e,
        'status' => $status[$keys[$r]],
        'custominfo' => rand(3000, 10000),
        'statusNumber' => $r,
        'attachs' => 0,
        'className' => $keys[$r] . ($e === 0 ? ' nostock ' : '')
    );
}

shuffle($data);

$out['grid'] = $data;

$out['perms'] = array(
    'update' => true,
    'insert' => true,
    'delete' => true,
    'attach' => true
);

$out['columns'] = array(
    array(
        'field' => 'id',
        'displayName' => 'ID',
    ),
    array(
        'field' => 'nome',
        'displayName' => 'Nome',
    ),
    array(
        'field' => 'estoque',
        'displayName' => 'Estoque',
    ),
    array(
        'field' => 'status',
        'displayName' => 'Status',
    )
);

if($module == 'Produtos') {
    $out['custom_columns'] = array(
        array(
            'field' => 'custom1',
            'displayName'=> '',
            'templateUrl' => 'custom/views/custom-group-buttons.php'
        )
    );
}



$out['pages'] = array();

for ($i = 1; $i <= 5; $i++) {
    $out['pages'][] = $i;
}

$out['total'] = rand(5000, 50000);
$out['interval'] = '1-10';
$out['options'] = file_get_contents('../views/modules/crud/options.php');

echo json_encode($out);