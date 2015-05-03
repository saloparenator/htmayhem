define('app/lib/grid',
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
    function makeGrid(w,h,dflt,grid){
        dflt = dflt || '';
        grid = grid || [];
        //logger.debug('makeGrid(%i,%i,%o,%o)',w,h,dflt,grid);
        
        /**
         * getAt
         * @param x
         * @param y
         * @return 
         */
        function getAt(x,y){
            return lodash.chain(grid)
                         .where({x:x,y:y})
                         .map('val')
                         .first()
                         .value() || dflt;
        }
        
        /**
         */
        function setAt(x,y,value){
            if (!lodash.inRange(x,w) || !lodash.inRange(y,h)){
                return makeGrid(w,h,dflt,grid);
            }
            var tmpGridChain = lodash.chain(grid).reject({x:x,y:y});
            if (value == dflt){
                return makeGrid(w,h,dflt,tmpGridChain.value());
            }
            return makeGrid(w,h,dflt,tmpGridChain.push({x:x,y:y,val:value}).value());
        }

        /**
         * get entire line from given Y coordinate
         */
        function getLine(y){
            var padding = lodash.fill(Array(w),dflt);
            lodash.chain(grid)
                  .filter({y:y})
                  .forEach(function(cell){
                      padding[cell.x] = cell.val;
                  })
                  .value();
            return padding;
        }

        /**
         * get entire column from given X coordinate
         */
        function getCol(x){
            var padding = lodash.fill(Array(h),dflt);
            lodash.chain(grid)
                  .filter({x:x})
                  .forEach(function(cell){
                      padding[cell.y] = cell.val;
                  })
                  .value();
            return padding;
        }

        /**
         * get whole grid in order
         */
        function iter(){
            var padding = lodash.fill(Array(w*h),dflt);
            lodash.forEach(grid,function(cell){
                padding[cell.x + cell.y * w] = cell.val;
            });
            return padding;
        }
        
        /**
         */
        function scroll(dx,dy){
            if (dx==0 && dy==0)
                return makeGrid(w,h,dflt,grid);
            return makeGrid(w,h,dflt,
                        lodash.chain(grid)
                              .map(function(cell){
                                return {
                                    x : cell.x+dx,
                                    y : cell.y+dy,
                                    val : cell.val
                                };
                            })
                            .filter(function(cell){
                                return lodash.inRange(cell.x,w) &&
                                       lodash.inRange(cell.y,h);
                            })
                            .value());
        }
        
        /**
         * 
         */
        function insideGroup(group){
            var funcCoord = function(coordinate){
                return getAt(coordinate.x,coordinate.y);
            };
            var predicateDflt = function(cell){
                return cell!=dflt;
            };
            return lodash.chain(group)
                         .map(funcCoord)
                         .filter(predicateDflt)
                         .value();
        }
        
        function neighbor(x,y,diag){
            var group = [
                {x:x+1,y:y},
                {x:x-1,y:y},
                {x:x,y:y+1},
                {x:x,y:y-1}
            ];
            if(diag){
                group = lodash.union(group,[
                    {x:x+1,y:y+1},
                    {x:x-1,y:y+1},
                    {x:x+1,y:y-1},
                    {x:x-1,y:y-1}
                ]);
            }
            return insideGroup(group);
        }
        
        function insideBox(xx,yy,ww,hh){
            var allYs = lodash.chain().range(yy,yy+hh);
            var funcX = function(x){
                var funcY = function(y){
                    return {x:x,y:y};
                };
                return allYs.map(funcY).value();
            };
            var group = lodash.chain()
                              .range(xx,xx+ww)
                              .map(funcX)
                              .flatten()
                              .value();
            logger.debug(group);
            return insideGroup(group);
        }
        
        /**
         */
        return {
            getAt : getAt,
            setAt : setAt,
            getLine : getLine,
            getCol : getCol,
            iter : iter,
            scroll : scroll,
            insideGroup : insideGroup,
            insideBox : insideBox,
            neighbor : neighbor
        };
    }

    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
        
        QUnit.test( "grid.getAt", function( assert ) {
            var tmp = makeGrid(3,3,'',[{x:1,y:1,val:'val'}]);
            assert.ok( 'val' == tmp.getAt(1,1), 'expect a value' );
            assert.ok( '' == tmp.getAt(0,1), 'left of value');
            assert.ok( '' == tmp.getAt(1,0), 'top of value' );
            assert.ok( '' == tmp.getAt(2,1), 'right of value' );
            assert.ok( '' == tmp.getAt(1,2), 'bottom of value' );
            assert.ok( '' == tmp.getAt(4,4), 'outside the grid' );
            assert.ok( '' == tmp.getAt(-1,-1),'negative coordinate' );
            assert.ok( '' == tmp.getAt(1,'a'),'invalid coordinate' );
        });
        
        QUnit.test( "grid.setAt", function( assert ) {
            var tmp = makeGrid(3,3,'default',[{x:1,y:1,val:'val'}]);
            
            tmp.setAt(1,1,'newVal');
            assert.ok( 'val' == tmp.getAt(1,1),'immutability test' );
            assert.ok( 'newVal' == tmp.setAt(1,1,'newVal').getAt(1,1),'mutator test' );
            assert.ok( 'default' == tmp.setAt(4,4,'newVal').getAt(4,4),'outbound test' );
            assert.ok( 'default' == tmp.setAt(-1,-1,'newVal').getAt(-1,-1),'negative coordinate test' );
            assert.ok( 'default' == tmp.setAt(1,1,'default').getAt(1,1),'default value' );
            assert.ok( 'default' == tmp.setAt(1,1,undefined).getAt(1,1),'undefined value' );
        });
        
        QUnit.test("grid.iter", function (assert){
            var tmp = makeGrid(3,3,'.',[
                {x:1,y:1,val:'val'},
                {x:1,y:2,val:'anotherval'},
                {x:2,y:1,val:'otherval'}
            ]);
            assert.ok(lodash.isEqual(['.','.','.','.','val','otherval','.','anotherval','.'],tmp.iter()),'iteration test' );
        });
        
        QUnit.test("grid.line", function (assert){
            var tmp = makeGrid(3,3,'.',[
                {x:1,y:1,val:'val'},
                {x:1,y:2,val:'anotherval'},
                {x:2,y:1,val:'otherval'}
            ]);
            assert.ok(lodash.isEqual(['.','.','.'],tmp.getLine(0)),'line 0 test' );
            assert.ok(lodash.isEqual(['.','val','otherval'],tmp.getLine(1)),'line 1 test' );
            assert.ok(lodash.isEqual(['.','anotherval','.'],tmp.getLine(2)),'line 2 test' );
        });
        
        QUnit.test("grid.col", function (assert){
            var tmp = makeGrid(3,3,'.',[
                {x:1,y:1,val:'val'},
                {x:1,y:2,val:'anotherval'},
                {x:2,y:1,val:'otherval'}
            ]);
            assert.ok(lodash.isEqual(['.','.','.'],tmp.getCol(0)),'line 0 test' );
            assert.ok(lodash.isEqual(['.','val','anotherval'],tmp.getCol(1)),'line 1 test' );
            assert.ok(lodash.isEqual(['.','otherval','.'],tmp.getCol(2)),'line 2 test' );
        });
        
        QUnit.test("grid.scroll", function (assert){
            var tmp = makeGrid(3,3,'default',[
                {x:1,y:1,val:'val'},
                {x:1,y:2,val:'anotherval'},
                {x:2,y:1,val:'otherval'}
            ]);
            tmp.scroll(1,1);
            assert.ok('val' == tmp.getAt(1,1),'immutability');
            tmp = tmp.scroll(1,1);
            assert.ok('val' == tmp.getAt(2,2),'new location');
            assert.ok('default' == tmp.getAt(2,3),'new location outbound');
            assert.ok('default' == tmp.getAt(3,2),'new location outbound');
            assert.ok('default' == tmp.getAt(1,1),'old location empty');
            assert.ok('default' == tmp.getAt(1,2),'old location empty');
            assert.ok('default' == tmp.getAt(2,1),'old location empty');
        });
        
        QUnit.test("grid.neighbor", function (assert){
            /*
            [.][.][.]
            [.][1][2]
            [.][3][.]
            */
            var tmp = makeGrid(3,3,'default',[
                {x:1,y:1,val:'val'},
                {x:1,y:2,val:'anotherval'},
                {x:2,y:1,val:'otherval'}
            ]);
            assert.ok(lodash.isEqual(['otherval','anotherval'],tmp.neighbor(1,1)));
            assert.ok(lodash.isEqual(['val'],tmp.neighbor(1,2)));
            assert.ok(lodash.isEqual(['val','otherval'],tmp.neighbor(1,2,true)));
            assert.ok(lodash.isEqual(['val'],tmp.neighbor(2,1)));
            assert.ok(lodash.isEqual(['val','anotherval'],tmp.neighbor(2,1,true)));
        });
        
        // QUnit.test("grid.insideBox", function (assert){
        //     /*
        //     [.][.][.]
        //     [.][1][2]
        //     [.][3][.]
        //     */
        //     var tmp = makeGrid(3,3,'default',[
        //         {x:1,y:1,val:'val'},
        //         {x:1,y:2,val:'anotherval'},
        //         {x:2,y:1,val:'otherval'}
        //     ]);
        //     logger.debug(tmp.insideBox(1,1,2,2))
        //     assert.ok(lodash.isEqual(['val','otherval','anotherval'],tmp.insideBox(1,1,2,2)));
        //     assert.ok(lodash.isEqual(['val'],tmp.neighbor(0,0,2,2)));
        //     assert.ok(lodash.isEqual(['val','anotherval','otherval'],tmp.neighbor(0,0,3,3)));
        //     assert.ok(lodash.isEqual(['val','anotherval','otherval'],tmp.neighbor(-1,-1,5,5)));
        // });
    };

    /**-------------------------------------------------------------------------
     *                      public
     -------------------------------------------------------------------------*/
    return {
        makeGrid : makeGrid,
        test : test
    };
/*______________________________________________________________________________
                            end
______________________________________________________________________________*/
});