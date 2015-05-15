define('app/kasbrik/mecanic/draw',
[
    'loglevel',
    'easeljs'
],
function (
    logger,
    easeljs
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('kasbrik draw loaded');
    
    function make(mainId,limonad){

        logger.debug('kasbrik.ball.make()');
        
        var mainCanvas = document.getElementById(mainId);
        var width = mainCanvas.width;
        var height = mainCanvas.height;
        var mainCtx = mainCanvas.getContext('2d');
        
        var bufferCanvas = document.createElement('canvas');
        bufferCanvas.width = width;
        bufferCanvas.height = height;
        var ctx = bufferCanvas.getContext('2d');
        
        function refresh(context, emit){
            logger.debug('refresh');
            ctx.fillStyle = "white";
            mainCtx.drawImage(bufferCanvas, 0, 0);
            ctx.fillRect(0,0,width,height);
        }

        function drawBall(context, emit){
            logger.debug('draw');
            ctx.beginPath();
            ctx.fillStyle = "#FF0000";
            ctx.arc(context.x,context.y,10,0,2*Math.PI);
            ctx.fill();
            ctx.fillStyle = "#FFFFFF";
        }
        
        function drawPaddle(context,emit){
            logger.debug('draw');
            ctx.fillStyle = "gray";
            ctx.fillRect(context.x,context.y,context.w,10);
            ctx.strokeStyle = "black";
            ctx.rect(context.x,context.y,context.w,10);
            ctx.stroke();
        }

        limonad.bind('60hz',refresh);
        limonad.bind('ballAt',drawBall);
        limonad.bind('paddleMove',drawPaddle);

    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        
        QUnit.test( "kasbrik.draw", function( assert ) {
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