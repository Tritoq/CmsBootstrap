<?php
//sleep(4);
$squares = 3;

if($squares > 3) {
    $class3 = "col-xs6 col-sm-4";
} else {
    $class3 = "col-xs8 col-sm-6";
}
?>

<div class="square <?php echo $class3?>" >
    <div id="ga-chart">
        <iframe id="ga" frameborder=0 scrolling=no src="views/modules/dashboard/ga.php" style="width:100%; height:100%; display:block;" ></iframe>
    </div>
</div>
<?php for($j=0;$j<$squares;$j++): ?>
    <div class="square <?php echo $class3?> crud-snapshot" >
        <h2>Catalogo</h2> <h5>Últimos 20 cadastros</h5>
        <div class='clear clearfix'></div>
        <div class="wrapper" id='grid-<?php echo $j?>' >
            <table class="container table table-striped">
                <tbody>
                    <?php for($i=0;$i<20;$i++):?>
                        <tr>
                            <td>Item <?php echo $i ?></td>
                            <td class="update"><a href="">Atualizar</a></td>
                        </tr>
                    <?php endfor ?>
                </tbody>
            </table>
        </div>
        <div class="form-group"><button class='btn btn-success'>Inserir novo</button> <button class='btn btn-info'>Visualizar Grid</button></div>
    </div>
<?php endfor ?>