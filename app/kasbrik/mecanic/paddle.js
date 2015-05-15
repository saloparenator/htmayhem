define('app/kasbrik/mecanic/paddle',
[
    'loglevel'
],
function (
    logger
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('kasbrik paddle loaded');
    
    function make(x, y, w, minX, maxX, dispatcher){

        logger.debug('kasbrik.paddle.make()');

        var direction = undefined;

        function setMovement(context,emit){
            direction = context.direction;
        }

        function refresh(context,emit){
            if (direction == 'left' && x > minX){
                x -= 2;    
            }
            else if (direction == 'right' && x + w < maxX){
                x += 2;
            }
            emit('paddleMove',{x : x, y : y, w : w})
        }

        dispatcher.bind('60hz',refresh);
        dispatcher.bind('key',setMovement);

    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        
        QUnit.test( "kasbrik.paddle", function( assert ) {
            assert.ok(false,'no test yet');
        });
        
    };

    /**-------------------------------------------------------------------------
     *                      public
     -------------------------------------------------------------------------*/
    return {
        make : make,
        test : test
    };
/*______________________________________________________________________________
                            end
______________________________________________________________________________*/
});