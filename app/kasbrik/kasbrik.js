define('app/kasbrik/kasbrik',
[
    'loglevel',
    'jquery',
    'app/lib/dangerousDispatcher'
],
function (
    logger,
    jquery,
    dangerousDispather
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    logger.debug('master loaded');
    
    function init(){

        logger.debug('master : hello');
        
        $(document).ready(function(){
            $('#main').append($('<canvas id="kasbrikCanvas" width="500" height="300" style="border : 1px solid black;">kasbrik</canvas>'));
            
            var dispatcher = dangerousDispather.make();
            
            require(['app/kasbrik/mecanic/draw'],function(kdraw){
                kdraw.make('kasbrikCanvas',dispatcher);
            });
            require(['app/kasbrik/mecanic/ball'],function(kball){
                kball.make(200,150,dispatcher);
            });
            require(['app/kasbrik/mecanic/box'],function(kbox){
                kbox.make(10,10,480,280,dispatcher);
            });
            require(['app/kasbrik/mecanic/briks'],function(kbriks){
                kbriks.make(dispatcher);
            });
            require(['app/kasbrik/mecanic/paddle'],function(kpaddle){
                kpaddle.make(225, 280,50,0,500,dispatcher);
            });
            
            setInterval(function () {
                dispatcher.emit('60hz',{});
            }, 15);
            
            $(document).on('keyup',function(event){
                if (event.originalEvent.keyCode == 37) dispatcher.emit('key',{direction : undefined})
                if (event.originalEvent.keyCode == 39) dispatcher.emit('key',{direction : undefined})
            });
            $(document).on('keydown',function(event){
                if (event.originalEvent.keyCode == 37) dispatcher.emit('key',{direction : 'left'})
                if (event.originalEvent.keyCode == 39) dispatcher.emit('key',{direction : 'right'})
            });
            
        });

    }

    /**-------------------------------------------------------------------------
     *                      public
     -------------------------------------------------------------------------*/
    return {
        init : init
    };
/*______________________________________________________________________________
                            end
______________________________________________________________________________*/
});