<?php

set_time_limit(0);

include('exception.php');

$data = file_get_contents("php://input");
$objData = json_decode($data);

$url = $objData->url;

if(!$url) {
    throwException(500);
}

$url = filter_var($url, FILTER_SANITIZE_URL);

/*
 * url = http://google.com.br/image01.jpg
 */

$sfile = explode('/', $url);
$filename = $sfile[sizeof($sfile)-1];

$ext = explode('.', $filename);
$ext = $ext[sizeof($ext) - 1];

$notAllowedExtensions = array('php', 'html');

foreach($notAllowedExtensions as $e) {
    if(preg_match("/$e/", $ext)) {
        throwException(405);
    }
}

/**
 * Rule is file extension is allowed / Verificar as regras para permitir os arquivos certos de envio
 */
$fp = fopen('uploads/' . $filename, 'w+');
$ch = curl_init($url);

curl_setopt($ch, CURLOPT_TIMEOUT, 50);
curl_setopt($ch, CURLOPT_FILE, $fp);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_exec($ch);
curl_close($ch);
fclose($fp);

echo json_encode(array('attach' => true));
