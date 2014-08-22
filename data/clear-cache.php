<?php

sleep(2);


$date = new \DateTime('now');


echo json_encode(array('cache' => array('date' => $date->format('D d M Y H:i:s'))));