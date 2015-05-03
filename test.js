define('test',
[
    /*amd compatible*/
    'loglevel',
    'qunit',
    /*module to test*/
    'app/lib/grid',
    'app/lib/bubble',
    'app/kasbrik/ball'
    ],
function (logger,
          qunit,
          grid,
          bubble,
          ball) {
    logger.setLevel('info');
/*code*/
    var suite = [
        grid,
        bubble,
        ball
    ];
    
    for (var index in suite){
        var module = suite[index];
        if (module){
            if (module.test){
                module.test();
            }
            else{
                logger.error('module ('+index+') with no test');
            }
        }
        else{
            logger.error('undefined module ('+index+')');
        }
    }
    
    QUnit.load();
    QUnit.start();
/*end*/
});