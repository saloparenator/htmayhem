define('app/kasbrik/kasbrik',
[
    'loglevel',
    'jquery',
    'app/lib/dangerousDispatcher',
    'app/kasbrik/mecanic/ball',
    'app/kasbrik/mecanic/draw',
    'app/kasbrik/mecanic/box',
    'app/kasbrik/mecanic/paddle'
],
function (
    logger,
    jquery,
    dangerousDispather,
    kball,
    kdraw,
    kbox,
    kpaddle
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('kasbrik main loaded');
    
    function init(){

        logger.debug('kasbrik.main.make()');
        
        $(document).ready(function(){
            $('#main').append($('<canvas id="kasbrikCanvas" width="500" height="300" style="border : 1px solid black">kasbrik</canvas>'));
            
            var dispatcher = dangerousDispather.make();
            
            kdraw.make('kasbrikCanvas',dispatcher);
            kball.make(200,150,dispatcher);
            kbox.make(10,10,480,280,dispatcher);
            kpaddle.make(225, 280,50,0,500,dispatcher);
            
            setInterval(function () {
                dispatcher.emit('60hz',{});
            }, 15);
            
            $(document).on('keyup',function(event){
                //logger.info(event);
                if (event.originalEvent.keyCode == 37) dispatcher.emit('key',{direction : undefined})
                if (event.originalEvent.keyCode == 39) dispatcher.emit('key',{direction : undefined})
            });
            $(document).on('keydown',function(event){
                //logger.info(event);
                if (event.originalEvent.keyCode == 37) dispatcher.emit('key',{direction : 'left'})
                if (event.originalEvent.keyCode == 39) dispatcher.emit('key',{direction : 'right'})
            });
            
            logger.info(dispatcher);
            
        });

    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        
        QUnit.test( "kasbrik.main", function( assert ) {
            assert.ok(false,'no test yet');
        });
        
    };

    /**-------------------------------------------------------------------------
     *                      public
     -------------------------------------------------------------------------*/
    return {
        init : init,
        test : test
    };
/*______________________________________________________________________________
                            end
______________________________________________________________________________*/
});