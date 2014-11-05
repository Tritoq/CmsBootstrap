<?php
/**
 * @author Artur Magalhães <nezkal@gmail.com>
 */

$directory = __DIR__ . '/uploads/';
$iterator = new DirectoryIterator($directory);

$data = array();

$fi = finfo_open(FILEINFO_MIME_TYPE);

$c = 0;

foreach ($iterator as $file) {


    if ($file->getFilename() != '.' && $file->getFilename() != '..') {



        $data[$c] = array(
            'file' => 'data/uploads/' . $file->getFilename(),
            'filename' => $file->getFilename(),
            'type' => finfo_file($fi, $directory . $file->getFilename()),
            'subtitle' => $file->getFilename(),
            'size' => filesize($directory . $file->getFilename()),
            'datetime' => date('d/m/Y H:i:s', filemtime($directory . $file->getFilename())),
            'position' => $c
        );
        $c++;
    }

}

shuffle($data);

echo json_encode($data);