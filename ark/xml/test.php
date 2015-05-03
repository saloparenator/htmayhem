<html>
    <head>
    </head>
    <body>
<?php
// Load XML file
$xml = new DOMDocument;
$xml->load('test.xml');

// Load XSL file
$xsl = new DOMDocument;
$xsl->load('test.xsl');

// Configure the transformer
$proc = new XSLTProcessor;

// Attach the xsl rules
$proc->importStyleSheet($xsl);

$is_valid_xml = $xml->schemaValidate('test.xsd');

if ($is_valid_xml)
    echo $proc->transformToXML($xml);
else
    echo 'nope';
?>
    </body>
</html>