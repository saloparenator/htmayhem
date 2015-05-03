/*const*/
var imgUrl = 'http://www.placecage.com/c/{{w}}/{{h}}';
var txtUrl = 'http://loripsum.net/api/{{nParagraph}}';
/*import*/
define('main',
        [
            /*amd compatible*/
            'loglevel',
            'lodash',
            'pouchdb',
            'mustache',
            /*non amd compatible lib*/
            'bootstrap',
            'easeljs',
            /*other ressource*/
            'text!app/tpl/canvas.tpl'
        ],
        function (
            logger,
            lodash, 
            pouchdb,
            mustache,
            bootstrap,
            easeljs,
            canvasTpl
                  ) {
    logger.setLevel('trace');
/*code*/

    $(document).ready(function(){
        logger.debug('biatche');
        
        var canvasHtml = mustache.to_html(canvasTpl, {id:'mainCanvas',width:640,height:360});
        $('#main').append(canvasHtml);
        var stage = new createjs.Stage("mainCanvas");
        var circle = new createjs.Shape();
        circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
        circle.x = 100;
        circle.y = 100;
        stage.addChild(circle);
        stage.update();

    });
    
    
/*end*/
});