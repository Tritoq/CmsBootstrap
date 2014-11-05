<?php

session_start();

$session_id = session_id();

$data = file_get_contents("php://input");

$objData = json_decode($data);

//header("Content-type: text/json");

$user = new stdClass();
$user->id = 1;
$user->role = "admin";

$resp["auth_result"] = ($objData->username == 'admin' && $objData->password == 'admin');

if($resp["auth_result"])
    $resp["user"] = $user;

$resp["session_id"] = $session_id;

echo json_encode($resp);
