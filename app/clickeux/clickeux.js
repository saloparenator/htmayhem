define('clickeux',
        [
            /*amd compatible*/
            'loglevel',
            'lodash',
        ],
        function (
            logger,
            lodash
                  ) {
    logger.setLevel('trace');
/*code*/
    function makeGrid(w,h,default='',begin=[]){
        var grid = [];
        function getAt(x,y){
            return lodash.findWhere(grid,{x:x,y:y}) || default;
        }
        function setAt(x,y,value){
            grid = lodash.chain(grid)
                         .reject({x:x,y:y})
                         .push({x:x,y:y,val:value})
                         .value();
        }
        return {
            getAt : getAt,
            setAt : setAt
        };
    }

    function findAllAdjacentSame(grid,x,y){
        
    }


    return {
        
    };
/*end*/
});