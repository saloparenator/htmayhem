define('app/kasbrik/mecanic/ball',
[
    'loglevel'
],
function (
    logger
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('kasbrik ball loaded');
    
    function make(x,y,limonad){

        logger.debug('kasbrik.ball.make()');
        
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
        
        function move(context, emit){
            var vector = normalise(ball.vx, ball.vy);
            ball.vx = vector.vx;
            ball.vy = vector.vy;
            ball.x = ball.x + ball.vx;
            ball.y = ball.y + ball.vy;
            emit('ballAt',ball);
        }

        function collide(context, emit){
            //cancel last move
            ball.x = ball.x - ball.vx;
            ball.y = ball.y - ball.vy;
            //calculate bounce direction
            ball.vx = context.vx;
            ball.vy = context.vy;
            logger.info(ball);
            emit('ballImpact',ball);
        }

        limonad.bind('60hz',move);
        limonad.bind('willCollide',collide);

    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        
        QUnit.test( "kasbrik.ball", function( assert ) {
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