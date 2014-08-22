<?php
$data = array();

$days = array();

$data[0]['name'] = 'Visitas';
      
for($i=1;$i<=30;$i++) {
    $days[] = $i;
    $data[0]['data'][] = rand(100, 2000);
    
}

$data[1]['name'] = 'Pageviews';

for($i=1;$i<=30;$i++) {
    $data[1]['data'][] = rand(400, 10000);

}

echo json_encode(array('series' => $data, 'days' => $days));