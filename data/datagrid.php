<?php
/**
 * @author Artur Magalhães <nezkal@gmail.com>
 */

$data = array();

sleep(2);

for ($i = 0; $i < 50; $i++) {

    $data[] = array(
        'id' => $i,
        'nome' => $_GET['module'] . ' Produto ' . $i . 'soidasdoiajsdaosijdasoidjasoidjsaoidjasodij',
        'estoque' => rand(1, 99),
        'status' => rand(1, 3),
        'attachs' => rand(0, 200)
    );
}

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


$out['pages'] = array();

for ($i = 1; $i <= 5; $i++) {
    $out['pages'][] = $i;
}

$out['total'] = rand(5000, 50000);
$out['interval'] = '1-10';
$out['options'] = file_get_contents('../views/modules/crud/options.php');

echo json_encode($out);