function opCreativeSetCookieA(n, v, d, e){var de = new Date;de.setTime(de.getTime() + e * 1000);document.cookie = n + "=" + escape(v) + ((e==null) ? "" : ("; expires=" + de.toGMTString())) + "; path=/" + ((d==null) ? "" : (";domain=" + d));}
function opCreativeGetDocumentSLD(){var sld = document.domain;var dp = sld.split(".");var l = dp.length;if (l < 2) sld = null;else if (!isNaN(dp[l-1]) && !isNaN(dp[l-2])) sld = null;else sld = "." + dp[l-2] + "." + dp[l-1];return sld;}
opCreativeSetCookieA("op1638enterpriseleadformgum", "a01403q04d297cz0ka0f1e297hq04x42lfc7f", opCreativeGetDocumentSLD(), 5184000);
opCreativeSetCookieA("op1638enterpriseleadformliid", "a01403q04d297cz0ka0f1e297hq04x42lfc7f", opCreativeGetDocumentSLD(), 86400);
optimost.addModule("lead form module", function ()
{
if($vopt.QApersona)document.title=$opt.creative+document.title;
$vopt.clicks={};
$vopt.content=document.getElementById("content");
$vopt.feeddiv=document.getElementById("feeddiv");
$opt.loaded = function(){
var iDocument = ($vopt.myiframe.contentWindow || $vopt.myiframe.contentDocument);
if (iDocument.document) iDocument = iDocument.document;
if(iDocument!=null){
$vopt.closeButton = $opt.get("className","overlayClose","a",iDocument.body);
if($vopt.closeButton){
$opt.addEvent($vopt.closeButton,"click",function(){$vopt.myiframe.style.visibility="hidden";})
}
var railClk='click';
var railSbmt='submit';
$vopt.errors = $opt.get("className","errors","div",iDocument.body);
if($vopt.errors==null){
$vopt.headline = $opt.get("className","mainheading","div",iDocument.body);//27 Aug, in IE7,8 load event fires even with no src param set.  Look for some node to verify something is in here
if($vopt.headline){
$opt.cntr(railClk);
if("All Visitors".toLowerCase().indexOf("qa")!=-1)document.title="|IF changes|"+document.title;
}
}
$vopt.submitButton = $opt.get("name","Submit","input",iDocument.body);
if($vopt.submitButton){
$opt.addEvent($vopt.submitButton,"click",function(sb){return function(){$opt.cntr(sb);}}(railSbmt))
$opt.addEvent($vopt.submitButton,"click",function(){$vopt.myiframe.style.visibility="hidden";})
}
}
$vopt.myiframe.style.visibility="visible";
}
$vopt.myiframe = document.getElementById("overlayfid");
var obj2=document.getElementById("contact");
if($vopt.myiframe){
if ($vopt.myiframe.attachEvent) $vopt.myiframe.attachEvent('onload', $opt.loaded);//27 Aug - IE6,7,8 issue with obj.onload, this works.
else $vopt.myiframe.addEventListener('load', $opt.loaded, false);
}
$vopt.leadForm={};
$vopt.leadForm.topRail=$opt.get("className","sidebar width230","div",$vopt.content);
$vopt.leadForm.btmRail= document.getElementById("contactGroupLanding");
$vopt.lfSet='';
for(var n in $vopt.leadForm){
if($vopt.leadForm[n]!=null){
var tName="a";
var tags=$vopt.leadForm[n].getElementsByTagName(tName);
for(var i=0,len=tags.length;i<len;i++){
if(tags[i].innerHTML=="Have Us Call You"){
$opt.addEvent(tags[i],"click",function(aN){return function(){$vopt.lfSet=aN;}}(n))
tags[i].setAttribute("opClkA","true:"+n);
}
}
}
}
$vopt.allTabsTop=[];
if($vopt.content){
var divs=$vopt.content.getElementsByTagName("div");
$vopt.cDivs=divs;
for(var i=0,len=divs.length;i<len;i++){
if(divs[i].id=="contactGroupLanding")$vopt.allTabsTop.push(divs[i]);
}
}
for(var j=0,lenJ=$vopt.allTabsTop.length;j<lenJ;j++){
var n="btmRail"
var tName="a";
var tags=$vopt.allTabsTop[j].getElementsByTagName(tName);
for(var i=0,len=tags.length;i<len;i++){
if(tags[i].innerHTML=="Have Us Call You"){
if(tags[i].getAttribute("opClkA")==null){
$opt.addEvent(tags[i],"click",function(aN){return function(){$vopt.lfSet=aN;}}(n))
tags[i].setAttribute("opClkA","true:"+n+j);
}
}
}
}
$opt.addChatClick=function(){
var obj=document.getElementById("contact");
if(!obj){
window.setTimeout($opt.addChatClick,1000);
return;
}
var foundChat=false;
var ancs=obj.getElementsByTagName("a");
for(var i=0,len=ancs.length;i<len;i++){
if(ancs[i].innerHTML.toLowerCase().indexOf("chat")!=-1){
if(ancs[i].getAttribute("opClkA")==null){
$opt.addEvent(ancs[i],"click",function(){$opt.cntr("chat")});
ancs[i].setAttribute("opClkA","true:Chat");
foundChat=true;
}
}
}
if(!foundChat)window.setTimeout($opt.addChatClick,500);
}
$opt.addChatClick();
$vopt.clicks.sideShare=document.getElementById("social-share");
$vopt.clicks.topShare= $opt.get("className","share_this2","div",$vopt.content);
if($vopt.clicks.topShare==null)$vopt.clicks.topShare= $opt.get("className","share_this3","div",$vopt.content);
$vopt.clicks.bottomShare= $opt.get("className","share_this4","div",$vopt.content);
$vopt.clicks.rightRail= $opt.get("className","sidebar width230","div",$vopt.content);
$vopt.clicks.downloadMedia= $opt.get("className","group downloadsmedia","div",$vopt.content);
for(var n in $vopt.clicks){
if($vopt.clicks[n]!=null){
var tName="a";
if(n=="topShare" || n=="sideShare" || n=="bottomShare")tName="span";
var tags=$vopt.clicks[n].getElementsByTagName(tName);
for(var i=0,len=tags.length;i<len;i++){
if(n=="rightRail" && tags[i].innerHTML=="Have Us Call You"){}
else{
$opt.addEvent(tags[i],"click",function(lnk){return function(){$opt.cntr(lnk);}}(n))
tags[i].setAttribute("opClkA","true:"+n);
}
}
}
}
$vopt.foundLinksE=0;
$opt.clickTrackingCodeBlogs=function(){
var obj=document.getElementById("feeddiv");
if(obj){
$vopt.ancsNav= obj.getElementsByTagName("a");
for(var j=0,len2=$vopt.ancsNav.length;j<len2;j++){
if($vopt.ancsNav[j].getAttribute("opClkA")==null || $vopt.ancsNav[j].getAttribute("opClkA").indexOf("true")!=-1){
var aName="rightRailBlogs";
$opt.addEvent($vopt.ancsNav[j],"click",function(aN){return function(){$opt.cntr(aN)}}(aName))
$vopt.ancsNav[j].setAttribute("opClkA","true:"+aName);
$vopt.foundLinksE++;
}
}
}
if($vopt.foundLinksE<1)window.setTimeout($opt.clickTrackingCodeBlogs,500);
}
window.setTimeout($opt.clickTrackingCodeBlogs,500);
$vopt.leadForm=(typeof($vopt.leadForm)=="object"?$vopt.leadForm:{});
$vopt.leadForm.topRail=$opt.get("className","sidebar width230","div",$vopt.content);
$vopt.leadForm.btmRail= document.getElementById("contactGroupLanding");
$vopt.lfSet='';
for(var n in $vopt.leadForm){
if($vopt.leadForm[n]!=null){
var tName="a";
var tags=$vopt.leadForm[n].getElementsByTagName(tName);
for(var i=0,len=tags.length;i<len;i++){
if(tags[i].innerHTML=="Have Us Call You"){
$opt.addEvent(tags[i],"click",function(aN){return function(){$vopt.lfSet=aN;}}(n))
}
}
}
}
$opt.addClickToAutoChatPopup=function(){
var ancs=document.getElementsByTagName("a");
for(var i=0,len=ancs.length;i<len;i++){
if(ancs[i].className=="lpInviteChatHrefAccept"){
if(ancs[i].getAttribute("opClkA")==null){
$opt.addEvent(ancs[i],"click",function(){$opt.cntr("AutoPopupChat")});
ancs[i].setAttribute("opClkA","true:AutoPopupChat");
}
}
}
}
window.setInterval($opt.addClickToAutoChatPopup,500);
$opt.tabsClicks=function(){
objX=document.getElementById("familyservice_listing");
if(objX){
var cn=objX.childNodes;
var tabs=null;
for(var i=cn.length-1;i>-1;i--){
if(cn[i].nodeType==1 &&cn[i].tagName.toLowerCase()=="ul")tabs=cn[i];
}
if(tabs){
var ancs=tabs.getElementsByTagName("a");
for(var i=0,len=ancs.length;i<len;i++){
var tmp=ancs[i].getAttribute("name");
if(tmp==null || tmp==""){
tmp=ancs[i].innerHTML.replace(/\W/g,"");
}
$opt.addEvent(ancs[i],"click",function(lnk){return function(){$opt.cntr(lnk);}}(tmp))
ancs[i].setAttribute("opClkA","true:"+tmp);
}
}
}
}
$opt.tabsClicks();
});

$opt=(typeof($opt)=="object"?$opt:{});
$vopt=(typeof($vopt)=="object"?$vopt:{});
$opt.creative='cr #157- wv #134- "All Visitors" persona-';
$vopt.QApersona=("All Visitors".toLowerCase().indexOf("qa")!=-1?true:false);
var _n=navigator.userAgent;
var _nl=_n.toLowerCase();
$vopt.isIE=((m=_nl.indexOf("msie"))!=-1?(_n.charAt(m+6)!="."?_n.substring(m+5,m+7):_n.substring(m+5,m+6)):-1);
$vopt.timesLoaded=0;
$opt.createStyleDoc=function(myDoc,styleText){
var head = myDoc.getElementsByTagName('head')[0],
style = myDoc.createElement('style'),
rules = myDoc.createTextNode(styleText);
style.type = 'text/css';
if(style.styleSheet)
style.styleSheet.cssText = rules.nodeValue;
else style.appendChild(rules);
head.appendChild(style);
}
$opt.findParentNode=function(obj, type,nestingLevel){
var newNode=obj;
if(newNode!=null){
var finished=false;
var nesting=0;
var num=0;
do{
if(newNode.parentNode==null) return null; //If no parent Node, outside top DOM element, done
newNode=newNode.parentNode; //Find our parent Node, set it as the new node
num++;
if(newNode.tagName==null) return null; //if no Tag Name, the document node, too high, exit
else if(newNode.tagName.toLowerCase()==type.toLowerCase()){//If we have a type match...
nesting++;
if(nesting==nestingLevel) finished=true; //and if we are at the right nesting level, FOUND
}
}while(newNode.tagName.toLowerCase()!=type.toLowerCase()||!finished);	//Wrong type and not Found, loop again
return(newNode);
}
else return null;
}
$opt.addEvent=function(el,evt,func,bubble){
if(!el || typeof(func) !="function"){return false;}
bubble = bubble || false;
var evtType=(window.attachEvent)?"attach":(window.addEventListener)? "add":"none";
if(evtType == "attach"){el.attachEvent("on"+evt,func);}
else if(evtType == "add"){el.addEventListener(evt,func,bubble);}
}
$opt.doEventDispatch=function (elm) { //alert('element is '+elm);
if(!$opt.beenHere && elm){
$opt.beenHere=true;
var evt = null;
if(document.createEvent) {
evt = document.createEvent('MouseEvents');
if(elm && elm.dispatchEvent && evt && evt.initMouseEvent) {
evt.initMouseEvent('click',true,true,document.defaultView,1, 0,
0,0,0,false,false,false,	false,0,null);
var tmp= elm.dispatchEvent(evt);
}
}
else{
elm.click();
}
}
}
var _n=navigator.userAgent;
var _nl=_n.toLowerCase();
$vopt.isIE=((m=_nl.indexOf("msie"))!=-1?(_n.charAt(m+6)!="."?_n.substring(m+5,m+7):_n.substring(m+5,m+6)):-1);
$opt.opCounters=new Array;
$opt.cntr = function(optype){
optype = (typeof(optype) != 'undefined') ? optype : "";
var randnum=Math.floor(Math.random()*1000);
var url="http://by.optimost.com/counter/1638/-/8/event.gif?opType="+optype+"&op1638enterpriseleadformliid=a01403q04d297cz0ka0f1e297hq04x42lfc7f&session=" + randnum;
$opt.opCounters[$opt.opCounters.length]=new Image();
$opt.opCounters[$opt.opCounters.length-1].src=url;
var date = new Date();
var ms=100;
var curDate = null;
do { curDate = new Date(); }
while(curDate-date < ms);
}
$opt.IEworkAround=function(){//document.title="AAA"+document.title;
if($vopt.isIE=="7" || $vopt.isIE=="8" || $vopt.isIE=="6") delayX= setTimeout($opt.loaded, 1000);
}
$opt.get = function(name, value, tagName, elemParent){var found = null;if(name && value && tagName && elemParent){var elems = elemParent.getElementsByTagName(tagName);for (var i = 0, len = elems.length; i < len; i ++ ){ var elem = elems[i];if(elem[name]&&elem[name].indexOf(value) > - 1){found = elem;   break; }}}return found;}
$opt.cleanNodeAddText = function(obj,innerVal){if(obj!=null){children = obj.childNodes;for(var i=children.length-1;i>-1;i--){obj.removeChild(children[i]);} newText=document.createTextNode(innerVal);obj.appendChild(newText);}}