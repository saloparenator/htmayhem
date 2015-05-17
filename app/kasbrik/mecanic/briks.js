define('app/kasbrik/mecanic/briks',
[
    'loglevel'
],
function (
    logger
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('kasbrik briks loaded');
    
    function make(dispatcher){

        logger.debug('kasbrik briks: not aagaainnn :o(');

        var briks = {
            brik2dArray : [
                [1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1]
            ],
            topX : 10,
            topY : 10,
            brikW : 40,
            brikH : 10
        };

        dispatcher.bind('ballAt',function (context,emit){
            var brokeOne = false;
            for (var i in briks.brik2dArray){
                for (var j in briks.brik2dArray[i]){
                    var x = j * briks.brikW + briks.topX;
                    var y = i * briks.brikH + briks.topY;
                    var w = briks.brikW;
                    var h = briks.brikH;
                    if (briks.brik2dArray[i][j] == 1 &&
                        context.x < x+w+10 && 
                        context.y < y+h+10 &&
                        context.x > x-10 && 
                        context.y > y-10){
                        briks.brik2dArray[i][j] = 0
                        emit('willCollide',{vx : context.vx, vy : 1});
                        brokeOne = true;
                    }
                }
            }
            if(brokeOne){
                emit('drawBriks',briks);
                logger.debug('kasbrik briks: OH MY GOD YOU %o ARE BREAKING MY PRECIOUS BRIKs %o !!! =o0',context,briks);
            }
        });

        dispatcher.emit('drawBriks',briks);
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