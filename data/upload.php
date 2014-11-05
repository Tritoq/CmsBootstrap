<?php
// In PHP versions earlier than 4.1.0, $HTTP_POST_FILES should be used instead
// of $_FILES.

include('exception.php');
$uploaddir = __DIR__ . '/uploads/';
$uploadfile = $uploaddir . basename($_FILES['file']['name']);

sleep(9);

if(move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile)) {
    echo json_encode(array('upload' => true, $_POST));
} else {
    throwException(500);
}
