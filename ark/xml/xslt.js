/*
function loadXMLDoc(filename)
{
    if (window.ActiveXObject){
        xhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    else{
        xhttp = new XMLHttpRequest();
    }
    xhttp.open("GET", filename, false);
    try {
        xhttp.responseType = "msxml-document"
    } catch(err) {} // Helping IE11
    xhttp.send("");
    return xhttp.responseXML;
}
*/
/*
function transform()
{
    xml = loadXMLDoc("cdcatalog.xml");
    xsl = loadXMLDoc("cdcatalog.xsl");
    // code for IE
    if (window.ActiveXObject || xhttp.responseType == "msxml-document")
    {
        return xml.transformNode(xsl);
    }
    // code for Chrome, Firefox, Opera, etc.
    else if (document.implementation && document.implementation.createDocument)
    {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        return xsltProcessor.transformToFragment(xml, document);
    }
}
*/

function getTransformator(){
    function loadXMLIE(filename){
        xhttp = new ActiveXObject("Msxml2.XMLHTTP");
        xhttp.open("GET", filename, false);
        try {
            xhttp.responseType = "msxml-document"
        } catch(err) {} // Helping IE11
        xhttp.send("");
        return xhttp.responseXML;
    }
    
    function loadXML(filename){
        xhttp = new XMLHttpRequest();
        xhttp.open("GET", filename, false);
        xhttp.send("");
        return xhttp.responseXML;
    }
    
    function transformIE(xmlFile,xsltFile){
        xml = loadXMLIE(xmlFile);
        xsl = loadXMLIE(xsltFile);
        return xml.transformNode(xsl);
    }
    
    function transform(xmlFile,xsltFile){
        xml = loadXML(xmlFile);
        xsl = loadXML(xsltFile);
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xsl);
        return xsltProcessor.transformToFragment(xml, document);
    }
    
    if (window.ActiveXObject)
        return transformIE;
    return transform;
}