<?php

//sleep(2);
$user = new stdClass();

$user->nome = "Artur";
$user->email = "artur@tritoq.com";
$user->grupo = "Super Usuário";
sleep(1);

echo json_encode(array('user'=>$user));