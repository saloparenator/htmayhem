define('test',
[
    /*amd compatible*/
    'loglevel',
    'qunit',
    /*module to test*/
    'app/lib/grid',
    'app/lib/bubble',
    'app/kasbrik/ball',
    'app/kasbrik/mecanic/paddle',
    'app/lib/pigCanvas',
    'app/lib/dangerousDispatcher'
    ],
function (logger,
          qunit,
          grid,
          bubble,
          ball,
          kasbrik_paddle,
          pig,
          dangerousDispather) {
    logger.setLevel('debug');
/*code*/
    var suite = [
        //grid,
        //bubble,
        //ball,
        //kasbrik_paddle,
        //pig,
        dangerousDispather
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