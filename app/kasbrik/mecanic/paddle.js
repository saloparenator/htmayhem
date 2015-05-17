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

        logger.debug('kasbrik paddle: heeeelllo!!');

        var direction = undefined;
        var h = 10;

        dispatcher.bind('60hz', function (context,emit){
            if (direction == 'left' && x > minX){
                x -= 5;    
                emit('paddleMove',{x : x, y : y, w : w})
            }
            else if (direction == 'right' && x + w < maxX){
                x += 5;
                emit('paddleMove',{x : x, y : y, w : w})
            }
            logger.debug('kasbrik paddle: YAAAAWWWNNN');
        });
        
        dispatcher.bind('key',function (context,emit){
            logger.debug('kasbrik paddle: I am not confortable %o',context);
            direction = context.direction;
        });
        
        dispatcher.bind('ballAt',function (context,emit){
            if (context.x < x+w+10 && 
                context.y < y+h+10 &&
                context.x > x-10 && 
                context.y > y-10){
                emit('willCollide',{vx : context.vx, vy : -1});
                logger.debug('kasbrik paddle: GET AWAY FROM ME YOU SCUM!!!!! %o',context);
            }
        });

        dispatcher.emit('paddleMove',{x : x, y : y, w : w})
    }
    /**-------------------------------------------------------------------------
     *                      public
     -------------------------------------------------------------------------*/
    return {
        make : make
    };
/*______________________________________________________________________________
                            end
______________________________________________________________________________*/
});