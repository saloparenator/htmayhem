define('app/lib/dangerousDispatcher',
[
    'loglevel',
    'lodash'
],
function (
    logger,
    lodash
          ) {
    var debug = false;
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('dangerousDispatcher loaded');

    function make(new_binding){

        logger.debug('DD: dangerousDispatcher.make()');
        
        /**
         * init, perform a deep copy of new_binding and perform structural precondition
         */
        var binding = {}; //todo use immutable
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
                        logger.error('DD: dangerousDispatcher make error %o', new_binding[action]);
                    }
                }
            }
            else{
                logger.error('DD: dangerousDispatcher make error %o', new_binding);
            }
        }
        
        /**
         * tell if given object is a dispatch
         */
        function isDispatch(dispatch){
            return lodash.isObject(dispatch.context) && 
                   lodash.isString(dispatch.action);
        }

        /**
         * execute a list of dispatch and return union of all returned dispatchLst
         */
        function exec(dispatchLst){
            var new_dispatch = [];
            
            //emitter is bundled permit many return per mecanic action
            function emitter (new_action,new_context){
                logger.info('info : %s(%o)',new_action,new_context);
                if (lodash.isObject(new_context) && 
                    lodash.isString(new_action)){
                    new_dispatch.push({
                        action : new_action,
                        context : new_context
                    });
                }
            }
            
            //for all dispatch in dispatchLst if dispatch in binding
            for (var i in dispatchLst){
                var dispatch = dispatchLst[i];
                if (isDispatch(dispatch) &&
                    dispatch.action in binding){
                    if(debug) logger.debug('DD: mecanic execution %o',dispatch);
                    //try to execute all action
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
         * add mecanic to action listener
         */
        function bind(action_name,monad){
            if (lodash.isFunction(monad) && lodash.isString(action_name)){
                if (binding[action_name] == undefined){
                    binding[action_name] = [];
                }
                binding[action_name].push(monad);
                if(debug) logger.debug('DD: $s bound to %o',action_name,monad);
                return true;
            }
            return false;
        }
        
        /**
         * remove mecanic to action listener
         */
        function unbind(action_name,monad){
            if (lodash.isFunction(monad) && lodash.isString(action_name)){
                if (!lodash.contains(binding,action_name)){
                    binding[action_name] = [];
                }
                binding[action_name].remove(monad);
                if(debug) logger.debug('DD: $s unbound from %o',action_name,monad);
                return true;
            }
            return false;
        }

        /**
         * trigger one action
         */
        function emit(action,ctx){
            logger.info('info : %s(%o)',action,ctx);
            if (!ctx){ctx = {};}
            var dispatchLst = [{action : action,context : ctx}];
            var cnt = 0;
            var actionSet = [];     //todo warn if one action is called two time by the same emit
            //execute mecanic and tail-call all mecanic that is bound to returned dispatch list
            //this make all mecanic in a continuation
            while(dispatchLst.length){
                cnt += 1;
                if(debug) logger.debug('DD: emit level %i dispatch %o',cnt,dispatchLst);
                actionSet = lodash.union(lodash.keys(dispatchLst), actionSet);
                //todo use worker if available
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
        QUnit.test( "dangerousDispatcher action(1) monad(1) no emit", function( assert ) {
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
        
        QUnit.test( "dangerousDispatcher action(1) monad(2) emit(1)", function( assert ) {
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
        
        QUnit.test( "dangerousDispatcher action(1) monad(3) chained emit(2)", function( assert ) {
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
        
        QUnit.test( "dangerousDispatcher action(1) monad(3) forked emit(2)", function( assert ) {
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
        
        QUnit.test( "dangerousDispatcher action(1) monad(3) forked emit(0)", function( assert ) {
            var success = false;
            var success2 = false;
            var success3 = false;
            var context = {
                msg : "hello"
            };
            function monad(ctx,emit){
                assert.ok(lodash.isEqual(context,ctx),'monad context');
                success = true;
                ctx.msg += ' ';
            }
            function monad2(ctx,emit){
                assert.ok(lodash.isEqual(context,ctx),'monad2 context');
                ctx.msg += 'world';
                success2 = true;
            }
            function monad3(ctx){
                assert.ok(lodash.isEqual(context,ctx),'monad3 context');
                ctx.msg += 'you';
                success3 = true;
            }
            var limonad = make();
            limonad.bind('test',monad);
            limonad.bind('test',monad2);
            limonad.bind('test',monad3);
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