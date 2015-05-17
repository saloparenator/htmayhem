define('app/kasbrik/mecanic/ball',
[
    'loglevel'
],
function (
    logger
          ) {
    
    logger.setLevel('debug');
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('kasbrik ball loaded');
    
    function make(x,y,limonad){

        logger.debug('kasbrik ball : hello');
        
        var ball = {
            x : x,
            y : y,
            vx : -1,
            vy : 1
        };
        
        function normalise(deltaX,deltaY){
            var dist = Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2))
            return {
                vx : deltaX / dist,
                vy : deltaY / dist
            };
        }

        limonad.bind('60hz',function (context, emit){
            var vector = normalise(ball.vx, ball.vy);
            ball.vx = vector.vx;
            ball.vy = vector.vy;
            ball.x = ball.x + ball.vx;
            ball.y = ball.y + ball.vy;
            emit('ballAt',ball);
            logger.debug('kasbrik ball: im moving biatch ! look yo %o', ball);
        });
        
        limonad.bind('willCollide', function (context, emit){
            //cancel last move
            ball.x = ball.x - ball.vx;
            ball.y = ball.y - ball.vy;
            //calculate bounce direction
            ball.vx = context.vx;
            ball.vy = context.vy;
            logger.info(ball);
            emit('ballImpact',ball);
            logger.debug('kasbrik ball: no problem yo look im going away %o', ball);
        });

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