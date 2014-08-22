<?php

$data = array();

$modes = array('info', 'put', 'del', 'insert');

$ips = array(
    "192.168.1.254",
    "192.168.1.12",
    "192.168.1.09",
    "192.168.0.1",
    "192.168.0.10",
    "200.7.1.87",
);

$actions = array(
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
    "Contrary to popular belief",
    "Latin professor at Hampden-Sydney College in Virginia",
    "Nam accumsan tellus id libero luctus sodales",
    "Curabitur consequat quis",
    "Maecenas felis leo, ultrices nec scelerisque et, pretium vitae elit. Sed sollicitudin dui at libero egestas suscipit."
);


for ($i=0;$i<30; $i++) {
    $registry = new stdClass();    
    $date = new \DateTime('now');    
    $registry->date = $date->format('D d M Y H:i:s');
    $registry->mode = $modes[rand(0, sizeof($modes) -1)];
    $registry->action = $actions[rand(0, sizeof($actions) -1)];
    $registry->ip = $ips[rand(0, sizeof($ips) -1)];
    $data[] = $registry;
}

echo json_encode($data);
