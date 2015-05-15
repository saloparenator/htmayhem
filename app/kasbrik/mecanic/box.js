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

        logger.debug('kasbrik.box.make()');

        function movingObject(context, emit){
            logger.debug('movingObject');
            if (context.x > x+w){
                 emit('willCollide',{vx : -1, vy : context.vy});
            }
            
            if (context.x < x){
                 emit('willCollide',{vx : 1, vy : context.vy});
            }
            
            if (context.y > y+h){
                 emit('willCollide',{vx : context.vx, vy : -1});
            }
            
            if (context.y < y){
                 emit('willCollide',{vx : context.vx, vy : 1});
            }
        }

        dispatcher.bind('ballAt',movingObject);

    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        
        QUnit.test( "kasbrik.box", function( assert ) {
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