<?php
/**
 * @author Artur Magalhães <nezkal@gmail.com>
 */
$data = array();


for ($i = 0; $i < 100; $i++) {

    $data[] = array(
        'id' => $i,
        'nome' => 'Produto ' . $i,
        'estoque' => rand(1, 99),
        'status' => rand(1,3)
    );
}

$out['grid'] = $data;
$out['columns'] = array(
    array(
        'field' => 'id',
        'displayName' => 'ID',
        'width' => (100/4) . '%'
    ),
    array(
        'field' => 'nome',
        'displayName' => 'Nome',
        'width' => (100/4) . '%'
    ),
    array(
        'field' => 'estoque',
        'displayName' => 'Estoque',
        'width' => (100/4) . '%'
    ),
    array(
        'field' => 'status',
        'displayName' => 'Status',
        'width' => (100/4) . '%'
    )
);

echo json_encode($out);