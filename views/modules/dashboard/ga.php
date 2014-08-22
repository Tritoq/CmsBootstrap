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
?>
<html>
    <head>        
        <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>   
        <script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/highcharts/4.0.3/highcharts.js"></script>
        <style>
        html,body {
            width:100%;
            height:100%;
        }
        </style>
    </head>
    <body>
        <div id="ga-chart"></div>
        <script type="text/javascript">
        
        $().ready(function () { 
            
            setTimeout(function () {
                
            $('#ga-chart').width(document.body.clientWidth).height(document.body.clientHeight-20);
                
            
            $('#ga-chart').highcharts({
                title: {
                    text: 'Visitas x Pageviews | Google Analytics'
                },
                xAxis: {
                    categories: <?php echo json_encode($days); ?>
                },
                yAxis: {
                    title: {
                        text: 'Total'
                    }                
                },
                tooltip: {
                    valueSuffix: ''
                },
                legend: {
                    layout: 'horizontal',
                    align: 'center'
                },
                series: <?php
                        echo json_encode($data);
                ?>
            });
                    
            
            }, 500);
        });
        </script>
    </body>
</html>