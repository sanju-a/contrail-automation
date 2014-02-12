// ------------- START CONFIG -----------------
// Telstra scode Javascript File location should go here
var datClientCodebase = '//www.telstra.com.au/global/javascript/';
// scode, adserver and test and target version control
var debug = false;
var datScode        = 'scode-v25.js';
var datAcode        = 'adserver-v9.js';
var datTcode        = 'multivariate-testing-v4.js';
var datMcode        = 'mbox.js';
var datCookieDomain = 'telstra.com.au';
var datCookiePath   = '/';
var omnitureData	= omnitureData || new Object;
// ------------- END CONFIG -------------------

//----------- BASE FUNCTIONS ----------------------
function gqp(name){name=name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");var regexS="[\\?&]"+name+"=([^&#]*)";var regex=new RegExp(regexS);var results=regex.exec(window.location.href);if(results==null)return"";else return results[1];}
function setDatCookie(c_name,value,expiredays,domain,path,secure){
	if (domain==null) var domain=window.location.hostname;if(path==null)var path='/'; /* Defaults for domain and path */
	var exdate=new Date();exdate.setDate(exdate.getDate()+expiredays);var strCookie=c_name+"="+escape(value)+((expiredays==null)?"":"; expires="+exdate.toGMTString())+";";strCookie=strCookie+" path="+escape(path)+"; domain="+escape(domain)+";"+((secure==null)?"":" secure;");document.cookie=strCookie;
}
function getDatCookie(c_name){if(document.cookie.length>0){c_start=document.cookie.indexOf(c_name+"=");if(c_start!=-1){c_start=c_start+c_name.length+1;c_end=document.cookie.indexOf(";",c_start);if(c_end==-1)c_end=document.cookie.length;return unescape(document.cookie.substring(c_start,c_end));}}return"";}
if(typeof(console) === 'undefined'){try{var console={}; console.log=console.error=console.info=console.debug=console.warn=console.trace=console.dir=console.dirxml=console.group=console.groupEnd=console.time=console.timeEnd=console.assert=console.profile=function(){};}catch(e){};}
if(debug){console.warn('debug: '+debug);}
function include(url,async,callback,callback_param){
	var h,n;
	if(async) {h=document.getElementsByTagName('head');
	    if(h.length==0){h[0]=document.body.parentNode.appendChild(document.createElement('head'));}
	    n = document.createElement('script');n.type = 'text/javascript';n.src = url;
		if (callback) {
			if (n.addEventListener){n.addEventListener('load',function(){callback(callback_param);}, false);}
			else if (n.attachEvent){n.attachEvent('onreadystatechange',function(){if(n.readyState=='complete'||n.readyState == 'loaded')callback(callback_param);});}
		}
		h[0].appendChild(n);return true;
	}else{document.write(unescape("%3Cscript src='"+url+"' type='text/javascript'%3E%3C/script%3E"));}
}
//--- DEV & STAGING AUTO LOADING (Not using omnitureData.appenv/libloc -----
// In these environments, pull the scode files from the /globals/ folder

if((omnitureData) && /DEV|SQI|UAT|SVT/i.test(omnitureData.appenv) && (omnitureData.libloc)) {
	var debug = omnitureData.debug || true; /* Default to showing debug console log messages in dev env. */
	var datCodebase = omnitureData.libloc;
	var environment = omnitureData.appenv;
} else if(/wg.dir|uat|xmachine|boomshed|dev/.test(document.location.hostname)) {
	var datCodebase='//'+document.location.hostname+'/global/javascript/',
		environment='dev',debug=true;
// In UCM Contrib or Staging, load the files from www.staging.telstra.com.au
} else if(/ucm|staging/.test(document.location.hostname) && !(omnitureData.libloc)) {
	var datCodebase='//www.staging.telstra.com.au/global/javascript/',
		environment='staging',debug=true;
// If we are in any kind of dev/uat environment, load the files from libloc.
} else {
	var datCodebase = datClientCodebase;
	var environment = 'live';
}

// ------ Live/Local Testing ------------------
// To use, you must specify a host, and one or more of scode, adserver, and multivariate testing.
// For security the hostname will be prepended to 'telstra.com', or set to 'www.staging.telstra.com.au'
var livetest = {};
livetest.parts = ['host','path','scode','ads','mvt'];

// Stop livetesting.
if(gqp('livetest')=='clear')  {
	var debug = true;
	if(debug) console.log('Clear LiveTest cookies');
	setDatCookie('livetest', '', 0);
	for (var i = 0; i < livetest.parts.length ; i++ ) {
		var part = livetest.parts[i];
		setDatCookie('livetest_'+part, '' , 0);
		livetest[part] = null;
	};
}
// Start livetesting if we find a cookie, or ?livetest in the querystring
if(getDatCookie('livetest')!=''||(gqp('livetest')!='clear')&&(gqp('livetest')!='')) {
	var debug = true, environment = 'test';
	if(gqp('livetest')!='clear') setDatCookie('livetest', 'enabled' , 1);
	for (var i = 0; i < livetest.parts.length ; i++ ) {
		var part = livetest.parts[i];
		if(gqp(part)!='') setDatCookie('livetest_'+part, gqp(part) , 1);
		livetest[part] = getDatCookie(part);
	};
	if(!livetest.path) livetest.path = '/global/javascript/';
	if(livetest.host) {
		if(livetest.host == 'staging') {
			var datCodebase = '//www.staging.telstra.com.au'+livetest.path;
		} else if(livetest.host == 'prod') {
			var datCodebase = '//www.telstra.com.au/global/javascript/livetest/';
		} else if(livetest.host == 'datalicious') {
			var datCodebase = '//www.datalicious.com/clients/telstra/latestcode/js/';
		} else {
			var datCodebase = '//'+livetest.host+'.wg.dir.telstra.com'+livetest.path;
		}
	}
	if(livetest.scode) var datScode = livetest.scode;
	if(livetest.ads)   var datAcode = livetest.ads;
	if(livetest.mvt)   var datTcode = livetest.mvt;
}
if(debug)console.log('ENV:'+environment+';Omniture src:'+datCodebase);
include(datCodebase + datScode); /* Include SCode File - Main Omniture Code*/
include(datCodebase + datTcode); /* Include Multivariate Testing and Surveys Code */
include(datCodebase + datAcode); /* Include Adserver File. AdServer Tracking */

//---------------- PAGE EXECUTION --------------------
function DataliciousPageTop() { /* Stub */ }
function DataliciousPageMiddle() {/* Stub */}
function DataliciousPageBottom(){
	// Single function at the very bottom of the page
	if(typeof s === 'object' && typeof s.t === 'function') var s_code=s.t();
	if(s_code) document.write(s_code);
}
