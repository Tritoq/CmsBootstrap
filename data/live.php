<?php
/**
 * @author Artur Magalhães <nezkal@gmail.com>
 */

$data = file_get_contents("php://input");

$objData = json_decode($data);



$modules = $objData;

$data = array();

foreach($modules as $item) {
    $data[$item] = 15;
}

//$data['Produtos'] = 10;

echo json_encode($data);