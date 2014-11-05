<?php

$data = file_get_contents("php://input");
$objData = json_decode($data);


$item = $objData->item;
$idx = $objData->idx;


echo json_encode(array('attach' => true));