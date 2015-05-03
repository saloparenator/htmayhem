define('app/clickeux/grid',
[
    'loglevel',
    'lodash',
    'pouchdb',
    'qunit'
],
function (
    log,
    lodash,
    pouchdb
          ) {
/*______________________________________________________________________________
                            code
______________________________________________________________________________*/
    log.debug('card loaded');
    
    var designDoc = {
        "_id" : "_design/card",
        "language" : "javascript",
        "views" : {
            "grid" : {
                "map" : "function(doc){if(doc.type == 'grid')emit(doc.name,doc)}"
            },
            "card" : {
                "map" : "function(doc){if(doc.type == 'card')emit([doc.character,doc.name],doc)}"
            },
            "character" : {
                "map" : "function(doc){if(doc.type == 'character')emit(doc.name,doc)}"
            }
        }
    };
    
    function Model(dbName){
        var db = new pouchdb.PouchDB(dbName);
        //put design doc if not exist
        db.get('_design/card').catch(function(err){db.put('_design/card',designDoc);});
        
        
        
    }

    
    /**-------------------------------------------------------------------------
     *                Unit testing
     -------------------------------------------------------------------------*/
    function test(){
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
            logger.info(tmp.neighbor(1,1));
            logger.info(tmp.neighbor(1,2));
            logger.info(tmp.neighbor(1,2,true));
            logger.info(tmp.neighbor(2,1));
            logger.info(tmp.neighbor(2,1,true));
            assert.ok(false);
        });
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