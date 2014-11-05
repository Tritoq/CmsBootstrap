<?php
/**
 * @author Artur Magalhães <nezkal@gmail.com>
 */
include 'exception.php';

$filename = 'uploads/' . (isset($_GET['filename']) ? $_GET['filename'] : '');

if(!is_file($filename)) {
    throwException(404);
}

$fi = finfo_open(FILEINFO_MIME_TYPE);

$mime = finfo_file($fi, $filename);

if ($mime != 'image/jpeg' && $mime != 'image/png' && $mime != 'image/gif') {
    throwException(500);
}


list($width, $height) = getimagesize($filename);


if($width > $height) {
    $newHeight = 100;
    $newWidth = ($newHeight/$height) * $width;
} else {
    $newWidth = 100;
    $newHeight = ($newWidth/$width) * $height;
}

$thumb = imagecreatetruecolor($newWidth, $newHeight);

switch($mime) {
    case 'image/jpeg':
        $source = imagecreatefromjpeg($filename);
        break;
    case 'image/png':
        $source = imagecreatefrompng($filename);
        break;
    case 'image/gif':
        $source = imagecreatefromgif($filename);
        break;
    default:
        throwException(500);
}

header('Content-type: ' . $mime);

imagecopyresampled($thumb, $source, 0,0,0,0,$newWidth, $newHeight, $width, $height);

switch($mime) {
    case 'image/jpeg':
        imagejpeg($thumb);
        break;
    case 'image/png':
        imagepng($thumb);
        break;
    case 'image/gif':
        imagegif($thumb);
        break;
}