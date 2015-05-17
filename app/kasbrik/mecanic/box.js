define('app/kasbrik/mecanic/box',
[
    'loglevel'
],
function (
    logger
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('kasbrik box loaded');
    
    function make(x,y,w,h,dispatcher){

        logger.debug('kasbrik box: Im hungry!');

        dispatcher.bind('ballAt',        function (context, emit){
            if (context.x > x+w){
                logger.debug('kasbrik box: $o It TICKLE!!!!!!',context);
                 emit('willCollide',{vx : -1, vy : context.vy});
            }
            
            if (context.x < x){
                logger.debug('kasbrik box: $o It tickle!!!!!!',context);
                 emit('willCollide',{vx : 1, vy : context.vy});
            }
            
            if (context.y > y+h){
                logger.debug('kasbrik box: $o Ouch !! this should hurt',context);
                 emit('willCollide',{vx : context.vx, vy : -1});
            }
            
            if (context.y < y){
                logger.debug('kasbrik box: $o Bong',context);
                 emit('willCollide',{vx : context.vx, vy : 1});
            }
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