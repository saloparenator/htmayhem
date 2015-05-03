define('app/kasbrik/ball',
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
    logger.debug('ball loaded');
    
    function isObstacle(obstacle){
        return lodash.isNumber(obstacle.x) &&
               lodash.isNumber(obstacle.y) &&
               lodash.isNumber(obstacle.w) &&
               lodash.isNumber(obstacle.h);
    }
    
    function isBall(ball){
        return lodash.isNumber(ball.id) &&
               lodash.isNumber(ball.x) &&
               lodash.isNumber(ball.y) &&
               lodash.isNumber(ball.vx) &&
               lodash.isNumber(ball.vy) &&
            lodash.isFunction(ball.setVector) &&
            lodash.isFunction(ball.move) &&
            lodash.isFunction(ball.bounceLeft) &&
            lodash.isFunction(ball.bounceRight) &&
            lodash.isFunction(ball.bounceTop) &&
            lodash.isFunction(ball.bounceUnder) &&
            lodash.isFunction(ball.isLeftOf) &&
            lodash.isFunction(ball.isRightOf) &&
            lodash.isFunction(ball.isTopOf) &&
            lodash.isFunction(ball.isUnderOf) &&
            lodash.isFunction(ball.willCollide);
    }
    
    function hypothenuse(w,h){
        return Math.sqrt(Math.pow(w,2)+Math.pow(h,2));
    }
    
    function normalise(vx,vy){
        var len = hypothenuse(vx,vy);
        return {
            vx : vx / len,
            vy : vy / len
        };
    }

    function makeBall(id,x,y,vx,vy){
        logger.debug('makeBall()');
        if (vx > 1 || vy < -1 || vy > 1 || vy < -1){
            var normale = normalise(vx,vy);
            vx = normale.vx,
            vy = normale.vy
        }
        
        function move(){
            return makeBall(id,
                            x+vx,
                            y+vy,
                            vx,
                            vy);
        }
        
        function setVector(nuDx,nuDy){
            return makeBall(id,x,y,nuDx,nuDy);
        }

        function stop(){
            return makeBall(id,x,y,0,0);
        }
        
        function bounce(obstacle){
            if (isObstacle(obstacle)){
                return makeBall(id,x,y,vx,vy);
            }
            return makeBall(id,x,y,vx,vy);
        }
        
        function willCollide(obstacle){
            return isObstacle(obstacle) &&
                   (lodash.inRange(x+vx,obstacle.x,obstacle.x+obstacle.w) && 
                   lodash.inRange(y+vy,obstacle.y,obstacle.y+obstacle.h));
        }

        return {
            id : id,
            x : x,
            y : y,
            vx : vx,
            vy : vy,
            setVector : setVector,
            move : move,
            bounce : bounce,
            stop : stop,
            willCollide : willCollide
        };
    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        
        QUnit.test( "ball.move", function( assert ) {
            var ballBR = makeBall(0,0,0,1,1).move();
            assert.ok(ballBR.vx == 1);
            assert.ok(ballBR.vy == 1);
            var ballBL = makeBall(0,0,0,-1,1).move();
            assert.ok(ballBL.vx == -1);
            assert.ok(ballBL.vy == 1);
            var ballTR = makeBall(0,0,0,1,-1).move();
            assert.ok(ballTR.vx == 1);
            assert.ok(ballTR.vy == -1);
            var ballTL = makeBall(0,0,0,-1,-1).move();
            assert.ok(ballTL.vx == -1);
            assert.ok(ballTL.vy == -1);
        });
        
        QUnit.test( "ball.stop", function( assert ) {
            var ball = makeBall(0,0,0,1,1).stop();
            assert.ok(ball.vx == 0);
            assert.ok(ball.vy == 0);
        });
        
        QUnit.test( "ball.bounce", function( assert ) {
            assert.ok(false,'undone');
        });
        
        
        QUnit.test( "ball.willCollide", function( assert ) {
            var ballIn = makeBall(0,0,0,0,0);
            
            var ballGoInTL = makeBall(0,-2,-2,1.5,1.5);
            var ballGoInBL = makeBall(0,-2,2,1.5,-1.5);
            var ballGoInTR = makeBall(0,2,-2,-1.5,1.5);
            var ballGoInBR = makeBall(0,2,2,-1.5,-1.5);
            
            var ballGoOutTL = makeBall(0,0.5,0.5,-1,-1);
            var ballGoOutBL = makeBall(0,-0.5,0.5,-1,1);
            var ballGoOutTR = makeBall(0,0.5,-0.5,1,-1);
            var ballGoOutBR = makeBall(0,-0.5,-0.5,1,1);
            
            var ballNotGoInTL = makeBall(0,-2,-2,-1,-1);
            var ballNotGoInBL = makeBall(0,-2,2,-1,1);
            var ballNotGoInTR = makeBall(0,2,-2,1,-1);
            var ballNotGoInBR = makeBall(0,2,2,1,1);
            
            var obstacle = {
                x:-1,
                y:-1,
                w:2,
                h:2
            };
            
            assert.ok(ballIn.willCollide(obstacle));
            
            assert.ok(ballGoInTL.willCollide(obstacle));
            assert.ok(ballGoInBL.willCollide(obstacle));
            assert.ok(ballGoInTR.willCollide(obstacle));
            assert.ok(ballGoInBR.willCollide(obstacle));
            
            assert.ok(!ballGoOutTL.willCollide(obstacle));
            assert.ok(!ballGoOutBL.willCollide(obstacle));
            assert.ok(!ballGoOutTR.willCollide(obstacle));
            assert.ok(!ballGoOutBR.willCollide(obstacle));
            
            assert.ok(!ballNotGoInTL.willCollide(obstacle));
            assert.ok(!ballNotGoInBL.willCollide(obstacle));
            assert.ok(!ballNotGoInTR.willCollide(obstacle));
            assert.ok(!ballNotGoInBR.willCollide(obstacle));
        });
        
        QUnit.test( "ball.setVector", function( assert ) {
            var ballT = makeBall(0,0,0,0,0);
            var ballTwithVector1 = ballT.setVector(0.5,0.5);
            assert.ok(ballTwithVector1.x == 0);
            assert.ok(ballTwithVector1.y == 0);
            assert.ok(ballTwithVector1.vx == 0.5);
            assert.ok(ballTwithVector1.vy == 0.5);
            var ballTwithVector2 = ballT.setVector(0.5,-0.5);
            assert.ok(ballTwithVector2.x == 0);
            assert.ok(ballTwithVector2.y == 0);
            assert.ok(ballTwithVector2.vx == 0.5);
            assert.ok(ballTwithVector2.vy == -0.5);
            var ballTwithVector3 = ballT.setVector(-0.5,0.5);
            assert.ok(ballTwithVector3.x == 0);
            assert.ok(ballTwithVector3.y == 0);
            assert.ok(ballTwithVector3.vx == -0.5);
            assert.ok(ballTwithVector3.vy == 0.5);
            var ballTwithVector4 = ballT.setVector(-0.5,-0.5);
            assert.ok(ballTwithVector4.x == 0);
            assert.ok(ballTwithVector4.y == 0);
            assert.ok(ballTwithVector4.vx == -0.5);
            assert.ok(ballTwithVector4.vy == -0.5);
            var ballTwithAnormalVector1 = ballT.setVector(1.5,1.5);
            assert.ok(ballTwithAnormalVector1.x == 0);
            assert.ok(ballTwithAnormalVector1.y == 0);
            assert.ok(ballTwithAnormalVector1.vx == 0.7071067811865476);
            assert.ok(ballTwithAnormalVector1.vy == 0.7071067811865476);
            var ballTwithAnormalVector2 = ballT.setVector(1.5,-1.5);
            assert.ok(ballTwithAnormalVector2.x == 0);
            assert.ok(ballTwithAnormalVector2.y == 0);
            assert.ok(ballTwithAnormalVector2.vx == 0.7071067811865476);
            assert.ok(ballTwithAnormalVector2.vy == -0.7071067811865476);
            var ballTwithAnormalVector3 = ballT.setVector(-1.5,1.5);
            assert.ok(ballTwithAnormalVector3.x == 0);
            assert.ok(ballTwithAnormalVector3.y == 0);
            assert.ok(ballTwithAnormalVector3.vx == -0.7071067811865476);
            assert.ok(ballTwithAnormalVector3.vy == 0.7071067811865476);
            var ballTwithAnormalVector4 = ballT.setVector(-1.5,-1.5);
            assert.ok(ballTwithAnormalVector4.x == 0);
            assert.ok(ballTwithAnormalVector4.y == 0);
            assert.ok(ballTwithAnormalVector4.vx == -0.7071067811865476);
            assert.ok(ballTwithAnormalVector4.vy == -0.7071067811865476);
        });
    };

    /**-------------------------------------------------------------------------
     *                      public
     -------------------------------------------------------------------------*/
    return {
        makeBall : makeBall,
        test : test
    };
/*______________________________________________________________________________
                            end
______________________________________________________________________________*/
});