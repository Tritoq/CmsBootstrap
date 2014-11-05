<?php

$data = file_get_contents("php://input");
$objData = json_decode($data);


sleep(2);

$item = $objData->item;


echo json_encode(array('attach' => true));