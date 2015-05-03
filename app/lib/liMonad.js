define('app/lib/liMonad',
[
    'loglevel',
    'lodash'
],
function (
    logger,
    lodash
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('liMonad loaded');

    function make(new_binding){

        logger.debug('liMonad.make()');
        
        /**
         * init
         */
        var binding = {};
        for (var action in new_binding){
            if (lodash.isString(action) &&
                lodash.isArray(new_binding[action])){
                
                if(!lodash.contains(binding,action)){
                    binding[action] = [];
                }
                
                for (var monad in new_binding[action]){
                    if(lodash.isFunction(monad)){
                        binding[action].push(monad);
                    }
                    else{
                        logger.error('liMonad make error %o', new_binding[action]);
                    }
                }
            }
            else{
                logger.error('liMonad make error %o', new_binding);
            }
        }
        
        /**
         * 
         */
        function isDispatch(dispatch){
            return lodash.isObject(dispatch.context) && 
                   lodash.isString(dispatch.action);
        }

        /**
         * 
         */
        function exec(dispatchLst){
            var new_dispatch = [];
            function emitter (new_action,new_context){
                if (lodash.isObject(new_context) && 
                    lodash.isString(new_action)){
                    new_dispatch.push({
                        action : new_action,
                        context : new_context
                    });
                }
            }
            
            for (var i in dispatchLst){
                var dispatch = dispatchLst[i];
                if (isDispatch(dispatch) &&
                    dispatch.action in binding){
                    logger.debug('monad execution %o',dispatch);
                    for (var j in binding[dispatch.action]){
                        var monad = binding[dispatch.action][j];
                        try{
                            monad(lodash.cloneDeep(dispatch.context),emitter);
                        }
                        catch(err){
                            logger.error(err);
                        }
                    }
                }
            }
            
            return new_dispatch;
        }
        
        /**
         * add monad to action listener
         */
        function bind(action_name,monad){
            if (lodash.isFunction(monad) && lodash.isString(action_name)){
                if (!lodash.contains(binding,action_name)){
                    binding[action_name] = [];
                }
                binding[action_name].push(monad);
            }
        }
        
        /**
         * remove monad to action listener
         */
        function unbind(action_name,monad){
            if (lodash.isFunction(monad) && lodash.isString(action_name)){
                if (!lodash.contains(binding,action_name)){
                    binding[action_name] = [];
                }
                binding[action_name].remove(monad);
            }
        }

        /**
         * trigger one action
         */
        function emit(action,ctx){
            if (!ctx){
                ctx = {};
            }
            var dispatchLst = [
                {
                    action : action,
                    context : ctx
                }
            ];
            var cnt = 0;
            var actionSet = [];     //todo warn if one action is called two time by the same emit
            while(dispatchLst.length){
                cnt += 1;
                logger.debug('emit level %i dispatch %o',cnt,dispatchLst);
                actionSet = lodash.union(lodash.keys(dispatchLst), actionSet);
                dispatchLst = exec(dispatchLst);
            }
        }


        /**
         * public
         */
        return {
            bind : bind,
            unbind : unbind,
            emit : emit
        };
    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        QUnit.test( "liMonad action(1) monad(1) no emit", function( assert ) {
            var success = false;
            var context = {
                msg : "hello"
            };
            function monad(ctx){
                assert.ok(lodash.isEqual(context,ctx),'monad context');
                success = true;
            }
            var limonad = make();
            limonad.bind('test',monad);
            limonad.emit('test',context);
            assert.ok(success,'monad executed');
        });
        
        QUnit.test( "liMonad action(1) monad(2) emit(1)", function( assert ) {
            var success = false;
            var success2 = false;
            var context = {
                msg : "hello"
            };
            var context2 = {
                msg : "hello world"
            };
            function monad(ctx,emit){
                assert.ok(lodash.isEqual(context,ctx),'monad context');
                success = true;
                ctx.msg += ' world';
                emit('test2',ctx);
            }
            function monad2(ctx){
                assert.ok(lodash.isEqual(context2,ctx),'monad2 context');
                success2 = true;
            }
            var limonad = make();
            limonad.bind('test',monad);
            limonad.bind('test2',monad2);
            limonad.emit('test',context);
            assert.ok(success,'monad executed');
            assert.ok(success2,'monad2 executed');
        });
        
        QUnit.test( "liMonad action(1) monad(3) chained emit(2)", function( assert ) {
            var success = false;
            var success2 = false;
            var success3 = false;
            var context = {
                msg : "hello"
            };
            var context2 = {
                msg : "hello world"
            };
            var context3 = {
                msg : "hello world!!!"
            };
            function monad(ctx,emit){
                assert.ok(lodash.isEqual(context,ctx),'monad context');
                success = true;
                ctx.msg += ' world';
                emit('test2',ctx);
            }
            function monad2(ctx,emit){
                assert.ok(lodash.isEqual(context2,ctx),'monad2 context');
                success2 = true;
                ctx.msg += '!!!';
                emit('test3',ctx);
            }
            function monad3(ctx){
                assert.ok(lodash.isEqual(context3,ctx),'monad3 context');
                success3 = true;
            }
            var limonad = make();
            limonad.bind('test',monad);
            limonad.bind('test2',monad2);
            limonad.bind('test3',monad3);
            limonad.emit('test',context);
            assert.ok(success,'monad executed');
            assert.ok(success2,'monad2 executed');
            assert.ok(success3,'monad3 executed');
        });
        
        QUnit.test( "liMonad action(1) monad(3) forked emit(2)", function( assert ) {
            var success = false;
            var success2 = false;
            var success3 = false;
            var context = {
                msg : "hello"
            };
            var context2 = {
                msg : "hello "
            };
            function monad(ctx,emit){
                assert.ok(lodash.isEqual(context,ctx),'monad context');
                success = true;
                ctx.msg += ' ';
                emit('test2',ctx);
                emit('test3',ctx);
            }
            function monad2(ctx,emit){
                assert.ok(lodash.isEqual(context2,ctx),'monad2 context');
                ctx.msg += 'world';
                success2 = true;
            }
            function monad3(ctx){
                assert.ok(lodash.isEqual(context2,ctx),'monad3 context');
                ctx.msg += 'you';
                success3 = true;
            }
            var limonad = make();
            limonad.bind('test',monad);
            limonad.bind('test2',monad2);
            limonad.bind('test3',monad3);
            limonad.emit('test',context);
            assert.ok(success,'monad executed');
            assert.ok(success2,'monad2 executed');
            assert.ok(success3,'monad3 executed');
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