<?php
/**
 * @author Artur Magalhães <nezkal@gmail.com>
 */

$module = isset($_GET['module']) ? $_GET['module'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : rand(3, 999);

$data = array(
    'id' => $id,
    'scliente'=> array('name' => 'Adam', 'age' => 13, 'email'=> 'teste@teste.com'),
    'nome' => 'Artur',
    'email' => 'nezkal@gmail.com',
    'status' => 1,
    'descr' => '<p><strong>Teste</strong></p>'
);


echo json_encode($data);