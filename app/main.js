/*const*/
var imgUrl = 'http://www.placecage.com/c/{{w}}/{{h}}';
var txtUrl = 'http://loripsum.net/api/{{nParagraph}}';
/*import*/
define('main',
        [
            /*amd compatible*/
            'loglevel',
            'app/kasbrik/kasbrik'
        ],
        function (
            logger,
            kmain
                  ) {
    logger.setLevel('debug');
/*code*/

    kmain.init();
    
    logger.debug('mother fucker !!!');
/*end*/
});