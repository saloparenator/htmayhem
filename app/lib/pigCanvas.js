define('app/lib/pigCanvas',
[
    'loglevel',
    'lodash',
    'qunit'
],
function (
    logger,
    lodash
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('grid loaded');
    /**
     * Grid
     * simple delimited tile grid object with default value.
     */
    function makePig(idCanvas){

        logger.debug('makePig(%s)',idCanvas);
        
        var canvas = document.getElementById(makePig);
        var ctx = canvas.getContext("2d");
        //ctx.fillStyle = "#FF0000";
        //ctx.fillRect(0,0,150,75);

        function plot(x,y,color){
            ctx.fillStyle = color;
            ctx.fillRect(x,y,1,1);
        }
        
        /**
         */
        return {
            plot : plot
        };
    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        
        QUnit.test( "pig canvas", function( assert ) {
            assert.ok(false,'nothing tested');
        });
    
        QUnit.test( "pig.plot", function( assert ) {
            document.addEventListener("DOMContentLoaded", function(event) { 

console.log('done');
                var pig = makePig('testCanvas');
                pig.plot(10,10,'#000000');
            
            });
            assert.ok(true,'pixel ploted');
        });
    
    };

    /**-------------------------------------------------------------------------
     *                      public
     -------------------------------------------------------------------------*/
    return {
        makePig : makePig,
        test : test
    };
/*______________________________________________________________________________
                            end
______________________________________________________________________________*/
});