define('app/kasbrik/mecanic/draw',
[
    'loglevel'
],
function (
    logger
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('kasbrik artist loaded');
    
    function make(mainId,dd){

        logger.debug('kasbrik artist: hello there');
        
        var mainCanvas = document.getElementById(mainId);
        var width = mainCanvas.width;
        var height = mainCanvas.height;
        var mainCtx = mainCanvas.getContext('2d');

        var ballBufferCanvas = document.createElement('canvas');
        ballBufferCanvas.width = width;
        ballBufferCanvas.height = height;
        var ballCtx = ballBufferCanvas.getContext('2d');
        dd.bind('ballAt',        function (context, emit){
            logger.debug('kasbrik artist: I get yo $o !',context);
            ballCtx.clearRect(0, 0, width, height);
            ballCtx.beginPath();
            ballCtx.fillStyle = "#FF0000";
            ballCtx.arc(context.x,context.y,10,0,2*Math.PI);
            ballCtx.fill();
        });
        
        var paddleBufferCanvas = document.createElement('canvas');
        paddleBufferCanvas.width = width;
        paddleBufferCanvas.height = height;
        var paddleCtx = paddleBufferCanvas.getContext('2d');
        dd.bind('paddleMove',function (context,emit){
            logger.debug('kasbrik artist: you alway stay elegant in all position you take $o',context);
            paddleCtx.clearRect(0, 0, width, height);
            paddleCtx.fillStyle = "gray";
            paddleCtx.fillRect(context.x,context.y,context.w,10);
            // paddleCtx.strokeStyle = "black";
            // paddleCtx.rect(context.x,context.y,context.w,10);
            // paddleCtx.stroke();
        });
                
        var briksBufferCanvas = document.createElement('canvas');
        briksBufferCanvas.width = width;
        briksBufferCanvas.height = height;
        var briksCtx = briksBufferCanvas.getContext('2d');
        dd.bind('drawBriks',function (context,emit){
            logger.debug('kasbrik artist: im painting this moment $o',context);
            briksCtx.clearRect(0, 0, width, height);
            for (var i in context.brik2dArray){
                for (var j in context.brik2dArray[i]){
                    if (context.brik2dArray[i][j] == 1){
                        var x = j * context.brikW + context.topX;
                        var y = i * context.brikH + context.topY;
                        var w = context.brikW;
                        var h = context.brikH;
                        briksCtx.fillStyle = "blue";
                        briksCtx.fillRect(x,y,w,h);
                        // briksCtx.strokeStyle = "black";
                        // briksCtx.rect(x,y,w,h);
                        // briksCtx.stroke();
                    }
                }
            }
        });
        
        
        
        dd.bind('60hz',        function (context, emit){
            logger.debug('kasbrik artist: hold on ! let me turn the page so I can catch up');
            mainCtx.clearRect(0, 0, width, height);
            mainCtx.drawImage(briksBufferCanvas, 0, 0);
            mainCtx.drawImage(paddleBufferCanvas, 0, 0);
            mainCtx.drawImage(ballBufferCanvas, 0, 0);
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