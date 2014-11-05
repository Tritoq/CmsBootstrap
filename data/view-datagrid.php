<?php
/**
 * @author Artur Magalhães <nezkal@gmail.com>
 */

include('exception.php');


$module = isset($_GET['module']) ? $_GET['module'] : '';
$id = isset($_GET['id']) ? $_GET['id'] : rand(3, 999);

$data = array(
    0 => array(
        'field' => 'id',
        'fieldName' => 'ID',
        'value' => $id
    ),
    1 => array(
        'field' => 'nome',
        'fieldName' => 'Nome',
        'value' => $module . ' Item ' . $id . ' asdadasdad'
    ),
    2 => array(
        'field' => 'estoque',
        'fieldName' => 'Estoque',
        'value' => rand(10, 1000)
    ),
    3 => array(
        'field' => 'status',
        'fieldName' => 'Status',
        'value' => rand(10, 1000)
    ),
    4 => array(
        'field' => 'descricao',
        'fieldName' => 'Descrição',
        'value' => '<p>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin scelerisque accumsan purus, vitae bibendum sem fermentum ut. Fusce ultricies felis nec elit gravida, eu luctus neque vulputate. Nulla facilisi. Maecenas rhoncus, ante ac posuere fermentum, nisl enim facilisis neque, vitae mollis felis velit facilisis libero. Proin in accumsan enim. Nam cursus risus non nulla porta, eu mollis nisi efficitur. Phasellus at nulla quis elit ullamcorper iaculis eu vel nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc viverra erat a nulla varius, eu sagittis ipsum volutpat. Vestibulum sed magna nec lacus varius porta. Nunc ac leo sagittis, vestibulum mi et, ultricies nunc. Curabitur id tellus non leo malesuada lobortis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent feugiat metus sed condimentum tincidunt.
</p>'
    ),
    5 => array(
        'field' => 'attachs',
        'fieldName' => 'Anexos',
        'value' => rand(10,100)
    )
);

$out['data'] = $data;
$out['perms'] = array(
    'update' => true,
    'attach' => false,
    'delete' => true
);

echo json_encode($out);