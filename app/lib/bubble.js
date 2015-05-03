define('app/lib/bubble',
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
    logger.debug('bubble loaded');

    function makeBubble(id,x,y,r,vx,vy){
        function distFrom(bubble){
            if (bubble.x && bubble.y){
                return Math.sqrt(Math.pow(bubble.x-x,2) + Math.pow(bubble.y-y,2));
            }
            return NaN;
        }
        
        function dirFrom(bubble){
            if (bubble.x && bubble.y){
                return Math.atan2(bubble.y-y,bubble.x-x);
            }
            return NaN;
        }
        
        function touching(bubble){
            if (bubble.x && bubble.y && bubble.r){
                return Math.pow(bubble.x-x,2) + Math.pow(bubble.y-y,2) < Math.pow(bubble.r+r);
            }
            return null;
        }

        function translate(dx,dy){
            return makeBubble(id,x+dx,y+dy,r,vx,vy);
        }
        function push(fx,fy){
            return makeBubble(id,x,y,r,vx+fx,vy+fy);
        }
        function inertia(){
            return makeBubble(id,x+vx,y+vy,r,vx,vy);
        }
        function stop(){
            return makeBubble(id,x,y,r,0,0);
        }
        return {
            id : id,
            x : x,
            y : y,
            r : r,
            vx : vx,
            vy : vy,
            translate : translate,
            push : push,
            inertia : inertia,
            stop : stop,
            touching : touching
        };
    }
    
    function makeLink(idA,idB,len){

        function giggle(bubbleA,bubbleB){
            if (bubbleA.dirFrom && bubbleA.distFrom){
                var dirA = bubbleA.dirFrom(bubbleB);
                var dirB = dirA - Math.PI;
                var diffA = (bubbleA.distFrom(bubbleB)-len)/2;
                var diffB = -diffA;
                return [
                    bubbleA.translate(Math.sin(dirA)*diffA,Math.cos(dirA)*diffA),
                    bubbleB.translate(Math.sin(dirB)*diffB,Math.cos(dirB)*diffB)
                ];
            }
            return [];
        }
        
        return {
            idA : idA,
            idB : idB,
            len : len,
            giggle : giggle
        };
    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        
        QUnit.test( "bubble.translate", function( assert ) {
            var center = makeBubble(1,0,0,1,0,0);
            center.translate(-10,10);
            assert.ok( center.x == 0 && center.y == 0, 'translate immuability untouched coordinate' );
            assert.ok( center.r == 1, 'translate immuability untouched ray' );
            assert.ok( center.id == 1, 'translate immuability untouched id' );
            assert.ok( center.vx == 0 && center.vy == 0, 'translate immuability untouched vector' );
            var translated = center.translate(1,1);
            assert.ok( translated.x == 1 && translated.y == 1, 'translate bottom right' );
            assert.ok( translated.r == center.r, 'translate bottom right untouched ray' );
            assert.ok( translated.id == center.id, 'translate bottom right untouched id' );
            assert.ok( translated.vx == center.vx && translated.vy == center.vy, 'translate bottom right untouched vector' );
            translated = center.translate(-1,1);
            assert.ok( translated.x == -1 && translated.y == 1, 'translate bottom left' );
            assert.ok( translated.r == center.r, 'translate bottom left untouched ray' );
            assert.ok( translated.id == center.id, 'translate bottom left untouched id' );
            assert.ok( translated.vx == center.vx && translated.vy == center.vy, 'translate bottom left untouched vector' );
            translated = center.translate(1,-1);
            assert.ok( translated.x == 1 && translated.y == -1, 'translate top right' );
            assert.ok( translated.r == center.r, 'translate top right untouched ray' );
            assert.ok( translated.id == center.id, 'translate top right untouched id' );
            assert.ok( translated.vx == center.vx && translated.vy == center.vy, 'translate top right untouched vector' );
            translated = center.translate(-1,-1);
            assert.ok( translated.x == -1 && translated.y == -1, 'translate top left' );
            assert.ok( translated.r == center.r, 'translate top left untouched ray' );
            assert.ok( translated.id == center.id, 'translate top left untouched id' );
            assert.ok( translated.vx == center.vx && translated.vy == center.vy, 'translate top left untouched vector' );
        });
        
        QUnit.test( "bubble.push", function( assert ) {
            var center = makeBubble(1,0,0,1,0,0);
            center.push(-10,10);
            assert.ok( center.x == 0 && center.y == 0, 'push immuability untouched coordinate' );
            assert.ok( center.r == 1, 'push immuability untouched ray' );
            assert.ok( center.id == 1, 'push immuability untouched id' );
            assert.ok( center.vx == 0 && center.vy == 0, 'push immuability untouched vector' );
            var pushed = center.push(1,1);
            assert.ok( pushed.x == center.x && pushed.y == center.y, 'push bottom right' );
            assert.ok( pushed.r == center.r, 'push bottom right untouched ray' );
            assert.ok( pushed.id == center.id, 'push bottom right untouched id' );
            assert.ok( pushed.vx == 1 && pushed.vy == 1, 'push bottom right  vector' );
            pushed = center.push(-1,1);
            assert.ok( pushed.x == center.x && pushed.y == center.y, 'push bottom left' );
            assert.ok( pushed.r == center.r, 'push bottom left untouched ray' );
            assert.ok( pushed.id == center.id, 'push bottom left untouched id' );
            assert.ok( pushed.vx == -1 && pushed.vy == 1, 'push bottom left  vector' );
            pushed = center.push(1,-1);
            assert.ok( pushed.x == center.x && pushed.y == center.y, 'push top right' );
            assert.ok( pushed.r == center.r, 'push top right untouched ray' );
            assert.ok( pushed.id == center.id, 'push top right untouched id' );
            assert.ok( pushed.vx == 1 && pushed.vy == -1, 'push top right  vector' );
            pushed = center.push(-1,-1);
            assert.ok( pushed.x == center.x && pushed.y == center.y, 'push top left' );
            assert.ok( pushed.r == center.r, 'push top left untouched ray' );
            assert.ok( pushed.id == center.id, 'push top left untouched id' );
            assert.ok( pushed.vx == -1 && pushed.vy == -1, 'push top left  vector' );
        });
        
        QUnit.test( "bubble.inertia", function( assert ) {
            var center = makeBubble(1,0,0,1,-10,10);
            center.inertia();
            assert.ok( center.x == 0 && center.y == 0, 'inertia immuability untouched coordinate' );
            assert.ok( center.r == 1, 'inertia immuability untouched ray' );
            assert.ok( center.id == 1, 'inertia immuability untouched id' );
            assert.ok( center.vx == -10 && center.vy == 10, 'inertia immuability untouched vector' );
            center = makeBubble(1,0,0,1,1,1);
            var inertiated = center.inertia();
            assert.ok( inertiated.x == 1 && inertiated.y == 1, 'inertia bottom right' );
            assert.ok( inertiated.r == center.r, 'inertia bottom right untouched ray' );
            assert.ok( inertiated.id == center.id, 'inertia bottom right untouched id' );
            assert.ok( inertiated.vx == center.vx && inertiated.vy == center.vy, 'inertia bottom right untouched vector' );
            center = makeBubble(1,0,0,1,-1,1);
            inertiated = center.inertia();
            assert.ok( inertiated.x == -1 && inertiated.y == 1, 'inertia bottom left' );
            assert.ok( inertiated.r == center.r, 'inertia bottom left untouched ray' );
            assert.ok( inertiated.id == center.id, 'inertia bottom left untouched id' );
            assert.ok( inertiated.vx == center.vx && inertiated.vy == center.vy, 'inertia bottom left untouched vector' );
            center = makeBubble(1,0,0,1,1,-1);
            inertiated = center.inertia();
            assert.ok( inertiated.x == 1 && inertiated.y == -1, 'inertia top right' );
            assert.ok( inertiated.r == center.r, 'inertia top right untouched ray' );
            assert.ok( inertiated.id == center.id, 'inertia top right untouched id' );
            assert.ok( inertiated.vx == center.vx && inertiated.vy == center.vy, 'inertia top right untouched vector' );
            center = makeBubble(1,0,0,1,-1,-1);
            inertiated = center.inertia();
            assert.ok( inertiated.x == -1 && inertiated.y == -1, 'inertia top left' );
            assert.ok( inertiated.r == center.r, 'inertia top left untouched ray' );
            assert.ok( inertiated.id == center.id, 'inertia top left untouched id' );
            assert.ok( inertiated.vx == center.vx && inertiated.vy == center.vy, 'inertia top left untouched vector' );
        });
  
        QUnit.test( "bubble.stop", function( assert ) {
            var center = makeBubble(1,0,0,1,-1,0);
            var stoped = center.stop();
            assert.ok( stoped.x == center.x && stoped.y == center.y, 'push bottom right' );
            assert.ok( stoped.r == center.r, 'push bottom right untouched ray' );
            assert.ok( stoped.id == center.id, 'push bottom right untouched id' );
            assert.ok( stoped.vx == 0 && stoped.vy == 0, 'push bottom right  vector' );
            assert.ok( center.x == 0 && center.y == 0, 'push immuability untouched coordinate' );
            assert.ok( center.r == 1, 'push immuability untouched ray' );
            assert.ok( center.id == 1, 'push immuability untouched id' );
            assert.ok( center.vx == -1 && center.vy == 0, 'push immuability untouched vector' );
        });
        
        QUnit.test("bubble.dirFrom",function(assert) {
            var bubbleA = makeBubble(0,0,1,1,0,0);
            var bubbleB = makeBubble(1,1,1,1,0,0);
            var bubbleC = makeBubble(1,-1,1,1,0,0);
            var bubbleD = makeBubble(-1,1,1,1,0,0);
            var bubbleE = makeBubble(-1,-1,1,1,0,0);
            logger.debug(bubbleB.dirFrom(bubbleA));
            assert.ok(false);
        })
    };

    /**-------------------------------------------------------------------------
     *                      public
     -------------------------------------------------------------------------*/
    return {
        makeBubble : makeBubble,
        makeLink : makeLink,
        test : test
    };
/*______________________________________________________________________________
                            end
______________________________________________________________________________*/
});