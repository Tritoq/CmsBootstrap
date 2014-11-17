<?php
/**
 * @author Artur Magalhães <nezkal@gmail.com>
 */

echo json_encode(
    array(
        'insert' => true,
        'item' => array(
            'id' => rand(1, 100),
            'nome' => 'Artur',
            'estoque' => 4,
            'status' => 1
        )
    )
);