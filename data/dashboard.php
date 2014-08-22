<?php

sleep(2);
$data = array(
    array    
    (
        'id'=> 1,
        'nome'=> 'Google Analytics',
        'type' => 'analytics'        
    )    
);


for($i=2; $i<=5; $i++) {
    $data[] = array(
        'id' => $i,
        'nome' => 'Item 0' . $i,
        'type' => 'crud'
    );
}

echo json_encode($data);