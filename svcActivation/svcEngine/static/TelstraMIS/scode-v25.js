/*********************************************************************
See the Telstra wiki article for information on this file:
http://wiki.in.telstra.com.au/display/tls/TSO+and+Omniture
*********************************************************************/
var isUAT = isUAT || false, datTesting = datTesting || false;

/* First, if necessary, create the omnitureData object */
if(typeof(omnitureData)!="object") omnitureData={isUAT:isUAT}; /* If omnitureData isn't an object, create it */
if(typeof omnitureData.isUAT!='boolean') omnitureData.isUAT = isUAT; /* Define the omnitureData.isUAT variable */
if(debug && !(/*@cc_on!@*/0)) console.dir(omnitureData);
if(!omnitureData.app) omnitureData.app = omnitureData.application == true ? omnitureData['application'] : omnitureData.app = new Object();

function checkDevEnvironment(){
	if(/UAT|SQI|DEV/i.test(omnitureData.appenv)) omnitureData.isUAT = true;
	var lstDevEnvironments = /0.0.1|221.133.203.23|ae.sda.corp|club4|dev|local|in.telstra|nus[0-9]*|object|olb(dev|gen|pit|sit)|saturn|sie[0-9]*|ssproxy|stage|staging|uat|wg.dir|xmachine|ucm/;
	var returnValue= false;
	if(	datTesting === true || lstDevEnvironments.test(window.location.hostname) || (typeof window.livetest == "object" && window.livetest.host !== undefined) || (omnitureData.isUAT)) {
		returnValue = true;
	}
	return returnValue;
}
var s_account=checkDevEnvironment()?"telstraglobaldev,telstratdretaildev":"telstraglobalprd,telstratdretailprd";

/*Code to redirect traffic to a different report suite for newly created TB/TEG pages*/
isTBTEG=false;
isTBForm=false;
if((/business-enterprise/i.test(window.location.pathname)) || (/online-shop\/business/i.test(window.location.pathname))
|| (/tcaform/i.test(window.location.pathname))|| (/e\/f2/i.test(window.location.pathname))) {
	if(/tcaform/i.test(window.location.pathname)|| /e\/f2/i.test(window.location.pathname)){
		isTBForm=true;
	}
	isTBTEG = true;
	var s_account=checkDevEnvironment()?"telstraglobaldev,telstratbtegdev":"telstraglobalprd,telstratbtegprd";
}
/* Some legacy apps need to continues reporting to telstrabusprd */
isTB=false;
if(/business-enterprise\/office365-selector-tool/i.test(window.location.pathname)){
	isTB=true;
	var s_account=checkDevEnvironment()?"telstraglobaldev,telstrabusdev":"telstraglobalprd,telstrabusprd";
}

/*New MPPO*/
isMPPO=false;
if(/telstraprepaid\/myprepaid/i.test(window.location.pathname)){
	isMPPO = true;
}

/*Code to redirect traffic to a different report suite for Facebook App pages*/
isFacebookApp=false;
var lstFacebookEnvironments = /fb.telstra.com|apps.facebook.com|facebookapp.app.telstra.com.au/;
if((lstFacebookEnvironments.test(window.location.hostname) ) || (/facebook.com\/Telstra24x7/.test(window.location.href))){
	isFacebookApp = true;
	var s_account="telstraglobalprd,telstratdmobileappsfbprd";
}else if(/dellm1530.wg.dir.telstra.com/.test(window.location.hostname)){
	isFacebookApp = true;
	var s_account="telstraglobaldev,telstratdmobileappsdev";
}

/*Code to check if it is webform*/
isWebform=false;
if(/telstra.com.au\/webforms/.test(window.location.hostname) && /webforms/i.test(window.location.pathname)) {
	isWebform = true;
}

/* Prepaid Activation*/
isPPA = false;
isAuthPPA = false;
if(/(www.my.telstra.com.au)/i.test(window.location.hostname) && /(^\/activate|\/auth_activate)/i.test(window.location.pathname)){
	if(/^\/myaccount\/auth_activate$/i.test(window.location.pathname)){
		isAuthPPA=true;
	}
	isPPA = true;
}
isBoost=false;
if(/boost.com.au/i.test(window.location.hostname)){
	isBoost=true;
	var s_account=checkDevEnvironment()?"telstraglobaldev,telstratdboostdev":"telstraglobalprd,telstratdboostprd";
	if(/^\/activate/i.test(window.location.pathname)){isPPA = true;}
}

isMyAccount=false; isOrderTrk=false;
if(/my.telstra.com.au|p[d,s]i[0-9]webf0[0-9]/i.test(window.location.hostname) && /^$|6800|80^/.test(window.location.port)) {
	if(!isPPA){
		if(/\/myaccount\/track-my-order/i.test(window.location.pathname)) isOrderTrk = true; /* Is it an order tracking request?*/
		else isMyAccount = true;
	}
}
isLiveChat=false;
if(/livechat.telstra.com|p[d,s]i[0-9]webf0[0-9]/i.test(window.location.hostname) && /^$|6700|80^/.test(window.location.port)) {
	isLiveChat = true;
}
isOLB=false;
if(/telstra.com.au/i.test(window.location.href) && /^\/billing/i.test(window.location.pathname)) {isOLB = true;}

isLithium=false;
if(typeof window.LITHIUM  == "object") {/* Lithium Social CRM */ isLithium = true;}

isBlender=false;
if(/theblender.com.au/i.test(window.location.hostname)) {isBlender = true;}

isMobilityPartner=false;
if(/mobilitypartner.telstra.com/i.test(window.location.hostname)) {isMobilityPartner = true;}

isStoreLocator=false;

if(/^\/store-locator/i.test(window.location.pathname)) {isStoreLocator = true;}

isCorporate=false;
if((/(www\.telstra|staging\.telstra|^telstra)/i.test(window.location.hostname)) && (window.location.pathname=="/")) {
	isCorporate= true; /* Corporate Homepage*/
}
isMedallia=false;
if(/feedback.telstra.com/i.test(window.location.hostname)) {isMedallia = true;}

isTMW=false;
if(/\/misc\/mobile-site/i.test(window.location.pathname)) {isTMW=true;}

/*Online Shops*/
isPostPaidShop = false;
if(/postpaid/i.test(omnitureData.appname) || /onlineshop.telstra.com.au|p[d,s]i[0-9]webf0[0-9]/i.test(window.location.hostname) && /^$|9700|80^/.test(window.location.port)){
	isPostPaidShop = true;
}
isDealerShop=false;
if(isPostPaidShop && /dealer/i.test(window.location.pathname)){
	isDealerShop=true;
}
isPrePaidShop = false;
if(/prepaid/i.test(omnitureData.appname) || /onlineshop.telstra.com.au|p[d,s]i[0-9]webf0[0-9]/i.test(window.location.hostname) && /^$|9700|80^/.test(window.location.port) && /prepaid-mobile/i.test(window.location.pathname)){
	isPrePaidShop = true;isPostPaidShop=false;
}
if(/connectedhome/i.test(omnitureData.appname)){
	var isConnectedHome = true,isPostPaidShop=false,isPrePaidShop=false;isMovers=false;
}
if(/moving-home/i.test(omnitureData.appname)){
	var isMovers = true,isPostPaidShop=false,isPrePaidShop=false;isConnectedHome=false;
}

isTacticalShop = false;
if(/(telstra.com.au|xmachine)\/online-shop\/(prepaid|order|tablet|homephone|home-phones|home-broadband|mobile-broadband|payment|order-complete)/i.test(window.location.href) && !(/onlineshop/i.test(window.location.hostname))){
	isTacticalShop = true;
	window.onload = function(){if(window.tforms.pager)s.trackPageChanged(s);};
}

/*Business Shop*/
isBusinessShop = false;
if(/(telstra.com.au|xmachine)\/online-shop\/business/i.test(window.location.href)){
	isBusinessShop = true;
}

/*Ipad Shop*/
isIpadShop = false;
if(/\/ipad-shop/i.test(window.location.pathname)){
	isIpadShop = true;
	window.onload= function() {if(!/\/confirmation/i.test(window.location.pathname)){s.trackPopupShopPageChanged(s);}};
}

/*TB Biz Essential Form*/
isBizEssen = false;
if(/\/biz-essentials/i.test(window.location.pathname)){
	isBizEssen = true;
	window.onload= function() {if(!/\/confirmation/i.test(window.location.pathname)){s.trackBizEssenForm(s);}};
}

isBusinessBundleShop = false;
if((omnitureData.shoptype && /BusinessDB/i.test(omnitureData.shoptype)||/business-digital-business/i.test(location.pathname))){
	isBusinessBundleShop = true;
}
/*Foxtel Initial Page*/
isFoxtel=false;
if(/\/foxtel\/get/i.test(window.location.pathname)){
isFoxtel=true;
}


/*Foxtel Confirmation Page to track orders*/
isFoxtelCompletion=false;
if(/\/foxtel\/request-complete/i.test(window.location.pathname)){
isFoxtelCompletion=true;
}


/* Coverage Feedback Form*/
isCoverageFeedbackForm = false;
if(/\/webforms\/coverage-feedback\/thanks/i.test(window.location.href)){
	isCoverageFeedbackForm = true;
}

/*Help & Support Page*/
isHelpSupport=false;
if(/\/go.telstra.com.au\/helpandsupport/i.test(window.location.href)){
isHelpSupport=true;
}

/*Service Status Page*/
isServiceStatus=false;
if(/servicestatus.telstra.com/i.test(location.hostname)){
	isServiceStatus=true;
}

/* Don't execute omniture if we've reloaded the Bigpond Iterative Logout as it inflates the stats */
if((/smraalo/i.test(document.location.pathname)) && (/smraalo/i.test(document.referrer))) {
	if(debug) console.warn("Abort Execution of SCode");
	throw new Error("Abort Execution of SCode");
}

if(/livehelp/i.test(omnitureData.appname)){
	var isLiveHelp = true;
}

var s=s_gi(s_account);

/* EVENTS MAP: Define a function to make event addition friendly and allow easy global event number changes */
function scAddEvent(type,returnList) {
	var eventId,lstEvents;
	switch (type.toLowerCase()) {
		case "interaction":		eventId='event1';	break;
		case "formabandon":		eventId='event2';	break;
		case "formsuccess":		eventId='event3';	break;
		case "formerror":		eventId='event4';	break;
		case "sale":			eventId='event5';	break;
		case "registration":	eventId='event7';	break;
		case "login":			eventId='event8';	break;
		case "subscription":	eventId='event9';	break;
		case "internalsearch":	eventId='event11';	break;
		case "selfservice":		eventId='event12';	break;
		case "storelocator":	eventId='event14';	break;
		case "livechat":		eventId='event16';	break;
		case "clicks":			eventId='event22';	break;
		case "formstart":		eventId='event23';	break;
		case "formfinish":		eventId='event24';	break;
		case "formstep":		eventId='event28';	break;
		case "pageview":		eventId='event27';	break;
		case "prepaidactivation":eventId='event64';	break;
		case "prepaidrecharge": eventId='event65';	break;
		case "billpayment":		eventId='event66';	break;
		case "directdebit":		eventId='event67';	break;
		case "emailbill":		eventId='event68';	break;
		case "eoi":				eventId='event69';	break;
		case "competition":		eventId='event70';	break;
		case "webregistration":	eventId='event47';	break;
		case "weblogin":		eventId='event48';	break;
		case "datapackadded":	eventId='event76';	break;
		case "roamingactivated":eventId='event77';	break;
		default : eventId=type;	break;
	}
	lstEvents = s.apl(s.events,eventId,',',1);
	if(/event22/i.test(lstEvents)) lstEvents = lstEvents.replace(/event27,?|,?event27/i,'');

	if(debug)console.log('scAddEvent('+type+','+returnList+'): ',lstEvents);

	if(returnList)	{ return lstEvents;  }
	else 			{ s.events=lstEvents;}
}
/* START: Shop customisations */
/************************** Set up omnitureData[] **************************/
function initialiseOmnitureData() {
	/* Set up the vars */
	var
		/* Default values */
		defaultData = {
			/* Strings */
			pageName:null, shoppingCartID:null, segment:null, state:null, postcode:null, events:null, storeId:null,
			/* Arrays */
			productIDs:[], packageIDs:[], quantities:[], productIDsAddedToCart:[], availableFilterParameters:[], selectedFilterParameters:[],
			/* Booleans */
			itemsInCartPriorToAddition:true, anyErrors:false
		},
		/* Key names used in the omnitureData object (converted into an array in the initial declaration) */
		keyNames = "pageName,shoppingCartID,segment,state,postcode,events,storeId,productIDs,packageIDs,quantities,availableFilterParameters,selectedFilterParameters,errorCodes,errorCode,anyErrors".split(","),
		/* Number of elements in the keyNames list */
		keyLength = keyNames.length,
		/* Name of the associative array key */
		key = '',
		/* Counter */
		i = 0;
	/* Loop over; any values that are not defined get set to the default values */
	for(i;i<keyLength;i++) {
		key = keyNames[i];
		if(typeof omnitureData[key] == "undefined") omnitureData[key] = defaultData[key];
	}
}
function compileOmnitureData() {
	var i = 0; /* Counter */
	var errorListDelimiter = ","; /* Delimiter for the error list */

	/* Some values are a 1-to-1 correlation */
	if(omnitureData.pageName) s.pageName = omnitureData.pageName;	/* Page name */

	if(omnitureData.state) s.state = omnitureData.state;
	if(omnitureData.postcode) s.zip = omnitureData.postcode;
	if(omnitureData.events) s.events = omnitureData.events;
	/* Store ID */
	if(omnitureData.storeId) {
		/* Either "ONLINE" or the 5-character store code */
		s.prop31=omnitureData.storeId;
		s.eVar28=s.prop31;
	}
	if(omnitureData.justLoggedIn) s.loggedInStatus = omnitureData.justLoggedIn;

	/* The productIDs array gets converted into the s.products variable */
	for(i=0; i<omnitureData.productIDs.length; i++) {
		if(typeof s.products=='undefined') {s.products="";} /* If s.products doesn't exist yet, create it */
		/* Format: category;product;quantity;totalPrice */
		if(omnitureData.productIDs[i] != ""){
			if(i) {s.products+=",";}	/* For subsequent products, add a comma to separate the list */
			s.products+=";" + omnitureData.productIDs[i];	/* Ignore the category, but add the product ID */
			s.products+=";";	/* Leave the total price blank */
		}
	}
	/* Error codes for MPPO. App will populate a javascript variable named errorCodesString */
	if(typeof errorCodesString !== 'undefined' ) s.prop28=s.eVar28=errorCodesString;
}
/**************************** End omnitureData[] functions ***************************/
String.prototype.trim=function(){var a=this.replace(/^\s+/,'');return a.replace(/\s+$/,'');};
Object.size=function(obj){var size=0,key;for(key in obj){if(obj.hasOwnProperty(key))size++;}return size;};

/* Mobile Device visits are redirected using Javascript. Attempt to capture the referrer via a cookie that the redirector sets */
if(isTMW==true && getDatCookie('scReferrer').length > 1) {
	s.referrer = getDatCookie('scReferrer').toString();
	setDatCookie("scReferrer","",-1);
}

/* SiteCatalyst code version: H.21.
Copyright 1996-2010 Adobe, Inc. All Rights Reserved
More info available at http://www.omniture.com */
/************************ ADDITIONAL FEATURES *************************/
/* Force Site Sections */
if(isBlender) s.channel = "blender";
if(isMobilityPartner) s.channel = "mpp";
if(isStoreLocator) s.channel = "telstra-store";
if(isCorporate) s.channel = "corporate";
if(isTMW) s.channel = "tmw";
if(isPostPaidShop) s.channel = "postpaidshop";
if(isPrePaidShop) s.channel = "prepaidshop";
if(isBusinessShop) s.channel = "onlinebizshop";
if(isConnectedHome) s.channel = omnitureData.app.name;
if(isDealerShop) s.channel = omnitureData.appname|"postpaid-dealer";
if(isMovers) s.channel = omnitureData.app.name;
if(isTBForm) s.channel = "cleveraustralianform";
/************************** CONFIG SECTION **************************/
/* You may add or alter any code config here. */
/* Conversion Config */
s.currencyCode="AUD";
s.cookieDomainPeriods='2';
s.fpCookieDomainPeriods=window.location.hostname.indexOf('.au')>-1?"3":"2";

/* Link Tracking Config */
s.trackDownloadLinks=true;
s.trackExternalLinks=true;
s.trackInlineStats=true;
s.linkDownloadFileTypes="apk,avi,dmg,doc,docx,exe,ipa,mov,mp3,mpg,pdf,ppt,pptx,rtf,rtfd,wav,wmv,xls,xlsx,zip";
s.linkInternalFilters=  "javascript:,conferencing.telstra.com,configure.telstra.com.au,crowdsupport.telstra.com.au,"
						+"feedback.telstra.com.au,help.telstra.com,id.telstra.com.au,onlineshop.telstra.com.au,"
						+"say.telstra.com.au,service.telstra.com.au,shop.telstra.com,telstra.com,telstra.com.au,"
						+"telstra.custhelp.com,telstrabusiness.com,telstrabusiness.com.au,telstraenterprise.com,"
						+"telstragovernment.com,telstragovernment.com.au,telstrasearch.com,telstrashop.telstra.com,"
						+"webedge.telstra.com,webedge2.telstra.com,xmachine,"
						+window.location.hostname.replace(/^(?!telstra|boost)[^.]*/,'');
s.linkLeaveQueryString=false;
s.linkTrackVars="prop61,eVar73";
s.linkTrackEvents="None";

/* Page Name Plugin Config */
s.siteID="";
s.defaultPage="";
s.queryVarsList="";
s.pathExcludeDelim=";";
s.pathConcatDelim=":";
s.pathExcludeList="";
s.currentYear=(new Date).getFullYear();

/************************** PLUGIN SECTION **************************/
s.usePlugins=true;
var doPluginsCounter = 0;
/* Add calls to plugins here */
function s_doPlugins(s) {
	if(omnitureData.application) omnitureData.app = omnitureData['application'];
	/* T&T addition - 11-Mar-2010 */
	s.tnt = s.trackTNT();

	/* Custom Page View Event Sets Page Views Success event*/
	s.events=s.apl(s.events,'event27',',',1);

	/* Site Specific Variables */
	s.server=window.location.host;
	if(!s.prop1) s.prop1="TD";
	if(!s.prop2) s.prop2="TR";
	if(!s.prop3){
		if(isTBTEG) {s.prop2=s.prop3="TBE";}
		else if(isFacebookApp){s.prop3="FB";}
		else if(isBoost){s.prop3="BST";}
		else{s.prop3="TR";}
	}

	/* Page and Section Code */
	if(!s.pageType && !s.pageName) {
		s.pageName=s.prop1+":"+s.prop2+":"+s.prop3+":"+s.getPageName().toLowerCase();

		var valueArray = s.pageName.split(":");

		if (s.pageName.indexOf(".htm")!=-1) {
			valueArray.pop();
		}

		if(isTBTEG){
			s.pageName=valueArray[0]+":"+s.prop3;
		}else if(isFacebookApp){
			s.pageName=valueArray[0]+":"+valueArray[1]+":"+s.prop3;
		}else{
			s.pageName=valueArray[0]+":"+valueArray[1]+":"+valueArray[2];
		}
		s.hier1=s.pageName.replace(new RegExp(/:/g),"|");
		// Some pages/sites have their site section set manually.
		if(isBlender||isMobilityPartner||isStoreLocator && s.channel){
				s.pageName=s.pageName+":"+s.channel.toLowerCase();
				s.hier1=s.hier1+":"+s.channel;
		}else if(isConnectedHome){
			s.trackConnectedHome('load',omnitureData);
		}else if(isMovers){
			s.trackMovingHome('load',omnitureData);
		}else if(isPostPaidShop){
			if(isDealerShop){s.channel="postpaid-dealer";} // TODO: Remove after R9.1
			if(s.channel) {
				s.pageName=s.pageName+":"+s.channel.toLowerCase();
				s.hier1=s.hier1+":"+s.channel;
			}
			/* Abort Online Shop Confirmation Page */
			if(/mobileshop\/orderconfirmation/i.test(document.location.pathname)){
				throw new Error("Waiting for page to fully load before triggering Omniture tracking request");
			}
		}else if(isBusinessShop){
			if(omnitureData.category) s.channel = omnitureData.category;
			if(s.channel) {
				s.pageName=s.pageName+":"+s.channel.toLowerCase();
				s.hier1=s.hier1+":"+s.channel;
			}
		}else if(isFacebookApp){
				if(omnitureData.channel){
					s.channel=omnitureData.channel;
				}
		}else if(isAuthPPA){
					s.channel=valueArray[4];
					s.pageName=s.pageName+":"+s.channel.toLowerCase();
		}else{
			if(valueArray[3]!=undefined){
				 if((isWebform) && (valueArray[4])){
					s.channel=valueArray[4];

				}else{
					s.pageName=s.pageName+":"+valueArray[3];
					if(!s.channel) s.channel=valueArray[3];
					s.hier1=s.hier1+":"+valueArray[3];
				}
			}else{
				s.channel="home";
			}
		}

		// Sub Section
		if(!s.prop4 && valueArray[4]!=undefined) {
			s.prop4=valueArray[4];
			s.hier1=s.hier1+":"+valueArray[4];
		}

		// Section:Sub Section (Was Sub Sub Section)
		if(s.channel && s.prop4 && typeof s.prop5 === 'undefined'){
			s.prop5 = s.eVar72 = s.channel + ":" + s.prop4;
		}else if(s.channel && typeof s.prop4 === 'undefined' && typeof s.prop5 === 'undefined') {
			s.prop5 = s.eVar72 = s.channel;
		}
		/*Help and Support - Adding sub section to page name*/
		if((isHelpSupport)&&(valueArray[4])){
			s.pageName=s.pageName+":"+valueArray[4];
		}

		if((isFacebookApp) || (isMPPO)){
			if(typeof omnitureData.pageName != "undefined"){
				s.pageName=s.pageName+":"+omnitureData.pageName;
			}else{
				s.pageName=s.pageName+":"+s.getMetaPageName().toLowerCase();
			}
		}else if(typeof s.getMetaPageName === 'function'){
			s.pageName=s.pageName+":"+s.getMetaPageName().toLowerCase();
		}
	}

	// Page Name Clean Up Code
	s.cleanPageName = function(pageName) {
		pageName=pageName.replace(/\u2013|\u2014|\u2015|\u2212/g,"-");	// Replace fancy dashes
		pageName=pageName.replace(/webapp:/g,"");	// shop.telstra.com URLs
		pageName=pageName.replace(/tcoma/g,"myaccount");	// My Account
		pageName=pageName.replace(/:web:|:group:/g,":myaccount:");	// My Account misdirections
		pageName=pageName.replace(/- telstra online services/ig,"");
		pageName=pageName.replace(/- telstra mobile/ig,"");
		pageName=pageName.replace(/- telstra.com.au/ig,"");
		pageName=pageName.replace(/- telstra/ig,"");
		pageName=pageName.replace(/:telstra - /ig,":");	// Tidying up ' strings
		pageName=pageName.replace(/:tr:mobile-phones:/i,":TR:mobile:");	// Tidying up terminal strings
		pageName=pageName.replace(/\u00a9|\u2122|\u00ae/g,"");	// Remove Trademarks, Copyright etc
		pageName=pageName.replace(/(<([^>]+)>)/ig,"") // Remove any HTML tags
		pageName=pageName.trim();
		s.pageName = pageName;
		return pageName;
	}
	s.cleanPageName(s.pageName);
	/* Campaigns */

	/*New MPPO*/
	if(isMPPO){
		if(/TD:TR:TR:telstraprepaid:Voucher recharge successful/i.test(s.pageName)){
			s.eVar69 = "Voucher Recharge";
			scAddEvent('PrepaidRecharge');
			scAddEvent('SelfService');
		}else if(/TD:TR:TR:telstraprepaid:Recharge committed/i.test(s.pageName)){
			s.eVar69 = "Credit Card";
			scAddEvent('PrepaidRecharge');
			scAddEvent('SelfService');
		}
	}

	/*Foxtel*/
	if(isFoxtel){
		s.products=";foxtel;1;";
		s.events=s.apl(s.events,'prodView,scOpen,scAdd,scView,scCheckout',',',1);
	}

	/*Foxtel Order Tracking*/
	if(isFoxtelCompletion){
		s.products=";foxtel;1;";
		s.events=s.apl(s.events,'purchase',',',1);
	}

	/* PPA- Updated pagename for each step in the flow - Start"*/
	s.checkAgeRange=function(custAge){
		if(custAge < 18){return "Less Than 18yo";}
		else if((custAge >=18) && (custAge <25)){return "18-25";}
		else if((custAge >=25) && (custAge <35)){return "25-35";}
		else if((custAge >=35) && (custAge <45)){return "35-45";}
		else if((custAge >=45) && (custAge <55)){return "45-55";}
		else if((custAge >=55) && (custAge <65)){return "55-65";}
		else{return "More Than 60yo";}
	}

	if(isPPA && typeof ppa_omniture==='object'){
		try{
			if(ppa_omniture.step){
				s.pageName=s.pageName+":"+ppa_omniture.step;
				s.prop54="";
				switch(ppa_omniture.step) {
					case 'packageDetails':{
						break;
					}
					case 'yourDetails':{
						if(debug)console.log(ppa_omniture);
						if(ppa_omniture.simNumberType){s.prop54=s.prop54+ppa_omniture.simNumberType;}
						if(ppa_omniture.custType){s.prop54=s.prop54+":"+ppa_omniture.custType;}
						if(ppa_omniture.accountType){s.prop54=s.prop54+":"+ppa_omniture.accountType;}
						ppa_omniture.step=null;
						break;
					}
					case 'identification':{
						if(ppa_omniture.custStatus){s.prop54=s.prop54+ppa_omniture.custStatus;}
						if(ppa_omniture.custAge){s.prop54=s.prop54+":"+s.checkAgeRange(ppa_omniture.custAge);}
						ppa_omniture.step=null;
						break;
					}
					case 'offerDetails':{
						if(ppa_omniture.custStatus){s.prop54=s.prop54+ppa_omniture.custStatus;}
						if(ppa_omniture.custAge){s.prop54=s.prop54+":"+s.checkAgeRange(ppa_omniture.custAge);}
						if(ppa_omniture.idType){s.prop54=s.prop54+ppa_omniture.idType;}
						if(ppa_omniture.addrNotListedSelected){s.prop54=s.prop54+":"+ppa_omniture.addrNotListedSelected;}
						ppa_omniture.step=null;
						break;
					}
					case 'confirmation_not_authenticated':{
						ppa_omniture.step=null;
						break;
					}
					case 'success':{
						s.events= s.apl(s.events,'event64',',',1);
						if(ppa_omniture.offer != null){s.prop54=ppa_omniture.offer;}
						ppa_omniture.step=null;
						break;
					}
					s.eVar54=s.prop54;
				}
			}
		}catch(e){
			/* Track intermittent errors reported by Keynote */
			s.track('page',{pagename:'TD:TR:TR:activate:ppa_omniture variable error',errorCodes: e.toString()});
		}
	}

	/* PPA- Updated pagename for each step in the flow - End"*/

	/* Coverage Feedback Form*/
	if(isCoverageFeedbackForm){
		s.prop54=s.getQueryParam('t')+":"+s.getQueryParam('n')
	}

	// External Campaign
   	s.campaign=s.getValOnce(s.getQueryParam('tc'),'tc_cookie',30);
	s.campaignClickThruQuality('tc','event25','event26');

	/* Campaign for SEO*/
	s.eVar52 = s.getQueryParam('gs');

	// Marin tracking eVar
	s.eVar70=s.getValOnce(s.getQueryParam('mqp'),'mqp_cookie',30);

	//---------------------------- Datalicious start -------------------------------------
	/************************ CUSTOM FUNCTIONS **************************/
	function replaceAll(input, stringToFind, stringToReplaceWith) {
		myRegExp = new RegExp(stringToFind, 'g');
		return input.replace(myRegExp, stringToReplaceWith);
	}
	function parentDIR() {
		marray = location.pathname.split('/');
		return marray[1];
	}
	function sc_getHostName(url){url=url.substring(url.indexOf('://')+3,url.length);url=url.substring(0,url.indexOf("/"));return url;}
	/************************ CUSTOM FUNCTIONS **************************/

	// ---------- Campaign Code Pre-processing ---------- //
	/* PurchasePath v6 */
	purchasePath.scExec();

	//---------------------------- Datalicious end ---------------------------------------
	if(typeof(s.eVar6)=='undefined')s.eVar6=s.getQueryParam('ti'); // Internal Campaign
	s.eVar13=s.getQueryParam('ref'); // Intra Site Campaign
	s.eVar49=s.getQueryParam('tcv'); // Tracking Code (holds for session only)

	// GSA Internal Search Terms
	s.gsaSearch = function(){
		if(typeof gsaCounter === 'undefined'){gsaCounter = 1}else{gsaCounter++}
		if(debug)console.log('gsaCounter',gsaCounter);
		s.events=scAddEvent('internalsearch',true);
		//if(debug)console.log('gsaSearch',s.events);
		s.prop21=s.eVar33=$("#q").val();
		s.prop22=$("#omniture-num-of-res").val();
		/* Transform the number of results into a range if greater than 50 */
		var segmentDetails = $('#siteId').val();
		s.prop67 ="Successful:"+segmentDetails;
		s.prop54 = $('#suggestionsValue').text() ? ("GSA:Search Suggestion for "+s.prop21+" > "+$('#suggestionsValue').text().trim()) : null;
		if(!s.prop22) {s.prop22="zero";s.prop67=s.eVar67="Unsuccessful:"+segmentDetails;} // Omniture can't handle 0 as a value, so use text
		else if(s.prop22<=50) {s.prop22=s.prop22;} // Small number - supply straight to Omniture
		else if(s.prop22<=500) { // 50-500, so give the range of results in lots of 50
		s.prop22=Math.floor(s.prop22/50)*50; // Bottom of range (e.g., 50, 100, 150...)
		s.prop22=s.prop22+ "-" + (s.prop22 + 50); // Establish the range
		}
		else { // GT 500, so give the range of results in lots of 100
			s.prop22=Math.floor(s.prop22/100)*100; // Bottom of range (e.g., 600, 700, 800...)
			s.prop22=s.prop22+ "-" + (s.prop22 + 100); // Establish the range
		}
		s.pageName=s.gsaPageName(document.title,"results:"+segmentDetails);
		/* the gsaSearch() function is called by the custom GSA javascript twice, but we only want to track the second time as the first is on init. */
		if(gsaCounter>=1){s.t();}
		$("#suggestions a").bind("click",function(){s.track('GSAresult',{
			'events':		s.events,
			'pageName':		s.pageName,
			'query':		s.prop21,
			'resultsCount':	s.prop22,
			'suggestion':	s.prop54,
			'searchSegment':s.prop67,
			'linkName':		'Featured:'+$(this).attr("href")
		})});
		$("ol#displays a").bind("click",function(){s.track('GSAresult',{
			'events':		s.events,
			'pageName':		s.pageName,
			'query':		s.prop21,
			'resultsCount':	s.prop22,
			'suggestion':	s.prop54,
			'searchSegment':s.prop67,
			'linkName':		'GSA Rank '+$(this).parents('li').attr('value')+':'+$(this).attr('href')
		})});
		$("#right-col-1 a").bind("click",function(){s.track('GSAresult',{
			'events':		s.events,
			'pageName':		s.pageName,
			'query':		s.prop21,
			'resultsCount': s.prop22,
			'suggestion':	s.prop54,
			'searchSegment':s.prop67,
			'linkName':		'CrowdSupport:'+$(this).attr("href")
		})});
		$("#right-col-2 a").bind("click",function(){s.track('GSAresult',{
			'events':		s.events,
			'pageName':		s.pageName,
			'query':		s.prop21,
			'resultsCount':	s.prop22,
			'suggestion':	s.prop54,
			'searchSegment':s.prop67,
			'linkName':		'FAQ:'+$(this).attr("href")
		})});
	}
	s.gsaPageName = function(commonPageName,suffix){
	var pageName = "TD:TR:TR:"+s.channel+":"+commonPageName+":"+suffix;
	pageName = s.cleanPageName(pageName);
	if(debug)console.log('s.gsaPageName(commonPageName,suffix) returns: ', pageName);
	return pageName.trim();
	}

	/* Managing SearchCenter Unclassified */
	s.keywordClickThruQuality('s_kwcid','event45','event46'); // Paid Search Clickthrough Quality
	if (s.getQueryParam('s_kwcid') && !s.getQueryParam('tc')) {
		// Copy through to campaign variable for campaign stacking, unless there is already a campaign value from the 'tc' param
		s.campaign=s.getValOnce(s.getQueryParam('s_kwcid'),'pmp_cookie',1);
	}

	/* Time Parting */
	s.tzOffset = s.checkForDayLightSavingsTime() ? 10:9;
	s.eVar41=s.prop41=s.getTimeParting('h',s.tzOffset); // Set hour
	s.eVar42=s.prop42=s.getTimeParting('d',s.tzOffset); // Set day
	s.eVar43=s.prop43=s.getTimeParting('w',s.tzOffset); // Set weekday

	/* Search Page */
	s.prop23=s.getPreviousValue(s.pageName,'gpv_p23','event11');

	/* Previous domain information */
	var browserDomainInfo = window.location.protocol + "//" + window.location.host;
	s.prop70 = s.getPreviousValue(browserDomainInfo,'gpv_p70');
	s.prop74= s.eVar74="D=fid";

	s.getZMSegment = function(){
		var s_c20 = getDatCookie('s_c20');
		var scPrevSection=s.getPreviousValue(s.channel,'scPrevious','');
		//if(debug)console.log('getZMSegment()',scPrevSection,s_c20);
		/* To work around timing issues, retrieve getZMsegment into a cookie, then read it on the next page. */
		if(s_c20 !=='' && typeof extraAdCallInfo==='undefined') {
			//if(debug)console.log('found cookie, but no extraAdCallInfo');
			s.eVar20 = s.prop20 = s_c20;
			if(/;st=(.{4});/i.test(s.eVar20)) {s.zip=s.eVar20.match(/;st=(.{4});/i,';').pop();}
			setDatCookie('s_c20','-',-1,'.telstra.com.au','/');
		}
		if(s_c20==='' && typeof extraAdCallInfo !=='undefined'){
			//if(debug)console.log('found extraAdCallInfo but no cookie');
			s.eVar20=s.prop20=s.getAndPersistValue(extraAdCallInfo,'s_c20',0);
		}
		if(omnitureData.username && omnitureData.justLoggedIn && adserver.getZMSsetId){
			//if(debug)console.log('user just logged in, so run getZMSsetId');
			adserver.getZMSsetId(omnitureData.username);
		}
		if((scPrevSection==='My Account' && scPrevSection !== s.channel)||/myaccount\/(logout|log-out)/i.test(location.pathname)){
			//if(debug)console.log('user left myaccount');
			if(s_c20 !==''){s.eVar20 = s.prop20 = s_c20};
			setDatCookie('s_c20','-',-1,'.telstra.com.au','/');
		}
	}

	/* !My Account! */
	if(isMyAccount) {
		s.channel = omnitureData.channel = "My Account";
		if(/myaccount:overview - my account$/i.test(s.pageName) && (/\/myaccount\/(home|logout|log-out|error|bigpond)/i.test(document.referrer)||document.referrer.length===0)) {
			omnitureData.justLoggedIn = true;
		}
		if(/myaccount\/(home|logout)/i.test(location.pathname) && (doPluginsCounter === 0) && ($) ){
			$(document).ready(function(){
				$('#loginForm').on('submit',function(){
					s.prop45 = s.eVar45 = s.sha1Hash($('#loginForm #username').val().replace(/@(telstra|bigpond).com/i,'').toLowerCase());
					/* Don't track. Just set the cookie. It will be picked up on the next page. */
					setDatCookie('s_c45',s.prop45,365,datCookieDomain,datCookiePath);
				})
			})
		}
		/* My Account Quickfixes [3/9/2012] Capture login and username */
		if(/myaccount\/logout/i.test(location.pathname)){
			omnitureData.justLoggedOut = true;
		}
		if(omnitureData.justLoggedIn == true && (/splash|add-an-account/i.test(s.pageName)===false)){
			scAddEvent("Login");
			scAddEvent("PageView");
			omnitureData.loggedInUsing = omnitureData.loggedInUsing || (gqp("fdp")==="FB"?"Facebook":"Telstra");
			s.prop71 = s.eVar71 = omnitureData.loggedInUsing;
			s.loggedIn="logged in";
			setDatCookie('s_loggedin',s.loggedIn,0,datCookieDomain,datCookiePath);
		}
		if(omnitureData.justLoggedOut == true){
			s.loggedIn="logged out";
			setDatCookie('s_loggedin',s.loggedIn,0,datCookieDomain,datCookiePath);
		}
		if(omnitureData.errorCodes||omnitureData.errorCode) s.prop28 = s.eVar28 = omnitureData.errorCode || omnitureData.errorCodes;
		if(omnitureData.errorCodes) s.prop28 = s.eVar28 = omnitureData.errorCodes;
		s.loggedInStatus=s.getAndPersistValue(s.loggedIn,'s_loggedin',0);
		if(!s.loggedIn && !s.loggedInStatus) {s.loggedIn="not logged in";}
		s.loggedInStatus=s.getAndPersistValue(s.loggedIn,'s_loggedin',0);
		if(s.loggedInStatus=="") {s.loggedInStatus="not logged in";}
		s.prop44=s.loggedInStatus+":"+s.pageName;
		s.eVar44=s.loggedInStatus;
		s.getZMSegment();
	} else {
		s.loggedInStatus=s.getAndPersistValue(s.loggedIn,'s_loggedin',0);
		if(!s.loggedIn && !s.loggedInStatus) {s.loggedIn="not logged in";}
		s.loggedInStatus=s.getAndPersistValue(s.loggedIn,'s_loggedin',0);
		if(s.loggedInStatus=="") {s.loggedInStatus="not logged in";}
		s.prop44=s.loggedInStatus+":"+s.pageName;
		s.eVar44=s.loggedInStatus;
	}

	// Online billing
	if(isOLB) {
		s.channel = "billing";
		//AJD - Need to include the Telstra standard page name prefix
		if(omnitureData.pageName) {
			s.pageName = setCustomPageName({'pageName' : omnitureData.pageName, 'channel' : 'billing'});
		}
		if(omnitureData.formOptions) s.prop24 = omnitureData.formOptions;
		if(omnitureData.formState) {

		s.prop25 = omnitureData.formState; scAddEvent(omnitureData.formState);}
		if(omnitureData.formChannel)s.prop26 = omnitureData.formChannel;
		if(omnitureData.formPage)	s.prop27 = omnitureData.formPage;
		if(omnitureData.errorCodes)	s.prop28 = s.eVar28 = omnitureData.errorCodes;
		if(omnitureData.portlet)	s.prop30 = omnitureData.portlet;
		if(/register.telstra.com.au\/login\/TocTraLogin.html/i.test(document.referrer)) scAddEvent("Login");
	}

	if(isOrderTrk) {
		if(omnitureData.ot_pageName) {
			s.pageName = setCustomPageName({'pageName' : omnitureData.ot_pageName, 'channel' : 'myaccount'});
		}
		if(omnitureData && omnitureData.ot_errorCodes) { s.prop28 = omnitureData.ot_errorCodes; }
		if(omnitureData && omnitureData.ot_portlet) { s.prop30 = omnitureData.ot_portlet; }
		if(omnitureData && omnitureData.ot_orderId) { s.eVar51 = s.prop51 = omnitureData.ot_orderId; }
		if(omnitureData && omnitureData.ot_serviceType) { s.evar31 = omnitureData.ot_serviceType; }
		if(omnitureData && omnitureData.ot_responseMsg) { s.prop52 = omnitureData.ot_responseMsg; }
		if(omnitureData && omnitureData.ot_requestStatus == 'success') {
			scAddEvent("SelfService");
			scAddEvent("FormFinish");
		}
	}

	if(isTacticalShop)	s.trackTacticalShop(); /* Tactical Shop Tracking*/
	if(isBusinessShop)	s.trackBusinessShop();	/* Business Shop Tracking*/

	/* Set Customised s.pageName - Used when the page name is set through the omnitureData object */
	function setCustomPageName(data) {
		var customPageName = '';
		s.prop1 = data.prop1|| s.prop1;
		s.prop2 = data.prop2|| s.prop2;
		s.prop3 = data.prop3|| s.prop3;
		if(data && data.pageName) {
		if(data.channel) {
			if(debug)console.log(data);
			customPageName = s.prop1+":"+s.prop2+":"+s.prop3+":"+data.channel+":"+data.pageName.toLowerCase();
			} else {
				customPageName = s.prop1+":"+s.prop2+":"+s.prop3+":"+s.getPageName()+":"+data.pageName.toLowerCase();
			}
		}

		return customPageName;
	}
	s.setCustomPageName = setCustomPageName;

	// !Custom Channel Setting
	if (s.channel === "moving-home") { s.channel = "movinghome"; }
	if (s.channel === "internet") { s.channel = "bigpond-internet"; }
	if (s.channel === "mobile-phones") {
		if(s.prop4 == "prepaid-mobiles"){
			s.channel = "prepaid-mobiles";
		}else{
			s.channel = "mobile";
		}
	}

	/* Copy props to eVars */
	if(s.prop1&&!s.eVar1) s.eVar1=s.prop1;
	if(s.prop2&&!s.eVar2) s.eVar2=s.prop2;
	if(s.prop3&&!s.eVar3) s.eVar3=s.prop3;
	if(s.channel&&!s.eVar4) s.eVar4=s.channel;
	if(s.prop4&&!s.eVar5) s.eVar5=s.prop4;
	if(s.prop21&&!s.eVar33) s.eVar33=s.prop21;
	if(s.prop37&&!s.eVar37) s.eVar37=s.prop37;
	if(s.prop38&&!s.eVar38) s.eVar38=s.prop38;
	if(s.prop39&&!s.eVar39) s.eVar39=s.prop39;
	if(s.prop44&&!s.eVar44) s.eVar44=s.prop44;
	if(s.prop45&&!s.eVar45) s.eVar45=s.prop45;
	if(s.prop47&&!s.eVar47) s.eVar47=s.prop47;

	/* Plugin getNewRepeat 1.0 */
	s.prop24=s.getNewRepeat();
	s.eVar22=s.getNewRepeat();

	/* !Lithium Integration */
	if(isLithium) {
		var breadcrumbArray = LITHIUM.CommunityJsonObject.WebTracking.path.split('/');
		var pathnameArray = window.location.pathname.split('/'); /* Used for MessageID */
		var newBreadcrumbArray = new Array();
		for(var i in breadcrumbArray){
			if(breadcrumbArray.hasOwnProperty(i)) {
				var crumb = breadcrumbArray[i];
				var idx = crumb.indexOf(':') + 1;
				newBreadcrumbArray[i] = crumb.substring(idx);
			}
		}
		leafCrumb = breadcrumbArray[breadcrumbArray.length - 1];

		var lithiumEvent = LITHIUM.CommunityJsonObject.WebTracking.Activities.UserMessageEvent;
		var lithiumEventId = LITHIUM.CommunityJsonObject.WebTracking.Activities.UserMessageEventId;

		omnitureData = {
			'channel': isBoost ? 'Community':'CrowdSupport',
			'newBreadcrumbArray':newBreadcrumbArray,
			'namedContentHeirarchy':newBreadcrumbArray.join(' / '),
			'namedContentDetail':leafCrumb,
			'sumRatingValue':null,
			'readMessage':/message/i.test(leafCrumb),
			'forumTopicPage':null,
			'boardSearch':/searchpage/i.test(window.location.pathname),
			'sumLifespan':null,
			'visitorId':LITHIUM.CommunityJsonObject.User.login,
			'userActivity':LITHIUM.CommunityJsonObject.Activity,
			'messageId':pathnameArray[pathnameArray.length - 1],
			'pageNameSuffix': isBoost ? / - Boost Community/i : / - CrowdSupport Telstra Community Forum/i,
			'pageTitleSuffix': isBoost ? /Boost Community/i : /Telstra CrowdSupport/i
		};
		omnitureData.getLithiumPageName = function() {
			var leafCrumb, returnvalue;
			if(newBreadcrumbArray.length < 2) { // Set page name when not looking at a forum pages on CS. ie; help, registration, about.
				leafCrumb = omnitureData.channel +':'+ document.title.toLowerCase().replace(omnitureData.pageNameSuffix,'') + ':'+omnitureData.messageId;
				leafCrumb = leafCrumb.replace(/:$/,''); // Trim trailing colons.
			} else { // Set page based on board heirarchy.
				leafCrumb = omnitureData.newBreadcrumbArray.join(':').toLowerCase();
			}
			returnvalue = s.cleanPageName(s.prop1+':'+s.prop2+':'+s.prop3+':'+leafCrumb);
			return returnvalue;
		};
		if(omnitureData.channel)s.channel=s.eVar4=omnitureData.channel;
		if(omnitureData.namedContentHeirarchy)s.prop55=s.eVar58=omnitureData.namedContentHeirarchy;
		if(omnitureData.namedContentDetail)s.prop56=omnitureData.namedContentDetail;
		if(omnitureData.sumRatingValue)s.events=s.apl(s.events,'event52',',',1);
		if(omnitureData.readMessage)   {
			// Check that this is not the reply page
			if (typeof pathnameArray[3] == 'undefined' || pathnameArray[3] != 'replypage') {
				var pageTitleArray = document.title.split('-'); /* Used for MessageID */
				// If available - get the parent message id from the title
				for(var i in pageTitleArray){
					if(omnitureData.pageTitleSuffix.test(pageTitleArray[i].trim())) {
						var nextArrayIndex =  parseFloat(i)+1;
						if (typeof pageTitleArray[nextArrayIndex] != 'undefined') {omnitureData.messageId = pageTitleArray[nextArrayIndex].trim();}
						break;
					}
				}
			s.events=s.apl(s.events,'event53',',',1);
			s.events=s.apl(s.events,'event59:'+omnitureData.messageId,',',1);
			// Check if the message is solved
			var checkSolvedMarker = "";
			if(typeof($) == 'function') checkSolvedMarker = $('div.lia-message-subject span.solved img').attr("alt");
			if (checkSolvedMarker == "Accepted Solution") {
				s.events=s.apl(s.events,'event60',',',1);
				s.events=s.apl(s.events,'event58:'+omnitureData.messageId,',',1);
			}
		}
		}
		if(omnitureData.forumTopicPage) { /* TODO: Confirm the correct value for this key */
			s.events = s.apl(s.events,'??',',',1);
		}
		if(omnitureData.boardSearch) {
			s.prop57 = s.eVar55 = unescape(gqp("q").replace(/\+/g," "));
			s.events = s.apl(s.events,'event57',',',1);
		}
		if(omnitureData.sumLifespan)s.events=s.apl(s.events,'event58',',',1); /* TODO: Confirm how to capture */
		if(omnitureData.visitorId) s.prop58=s.eVar57=omnitureData.visitorId;
		if(omnitureData.visitorId) s.prop59=s.eVar56=omnitureData.messageId; /* TODO: Confirm correct value */

		// New detection of post/reply/edit events
		if (lithiumEvent && lithiumEvent == "tracking.message.new") {
			s.events=s.apl(s.events,'event54',',',1);
		}
		else if (lithiumEvent && lithiumEvent == "tracking.message.edit") {
			s.events=s.apl(s.events,'event55',',',1);
			if (lithiumEventId)  s.prop59=s.eVar56=lithiumEventId;
		}
		else if (lithiumEvent && lithiumEvent == "tracking.message.reply") {
			s.events=s.apl(s.events,'event56',',',1);
			if (lithiumEventId)  s.prop59=s.eVar56=lithiumEventId;
		}

		/* Capture login & registration event */
		if(omnitureData.userActivity.Results.length > 0) {
			for (var i in omnitureData.userActivity.Results) {
				for (var j in omnitureData.userActivity.Results[i]) {
					if(omnitureData.userActivity.Results[i][j] ==='UserRegistered')omnitureData.events = scAddEvent('webregistration');
					if(omnitureData.userActivity.Results[i][j] ==='UserSignedOn') omnitureData.events = scAddEvent('weblogin');
				}
			}
		}
		s.pageName = omnitureData.pageName = omnitureData.getLithiumPageName();
		if(debug && !(/*@cc_on!@*/0))console.dir(omnitureData);
	}

	/* Customer ID - Persist prop45 for 365 days */
	s.eVar45=s.prop45=s.getAndPersistValue(s.prop45,'s_c45',365);

	//---------------------- Datalicious start -------------------------------

	// Use Dynamic variables to capture URL. Remove jsession, cftoken, and cfid querystring params.
	if(/jsessionid|docid|cfid|cftoken|realmoid|smagentname|token/i.test(document.location.href)) {
		s.prop8=document.location.href.replace(/(jsessionid|docid|cftoken|cfid|realmoid|smagentname|token)=([^&#]*)/ig,'$1');
	} else { s.prop8="D=g";}
	// Code version
	s.prop9 = datCodebase+datScode || "incorrect old code";

	// Test the product string
	if (s.products != '') {
		s.prop6 = s.products;
	}
	// Get previous site section
	scPrevSection=s.getPreviousValue(s.channel,'scPrevious','');
	// Look for special links indicating leads, chats, or feedback.
	scUrl=s.linkHandler("bigpond.com/internet/plans|livechat.telstra");
	if (scUrl != '') {
		if (scUrl.indexOf('internet/plans') != -1) {
			s.linkTrackVars = "eVar21,eVar26,eVar36,prop26,events";
			s.linkTrackEvents = "event1,event6";
			s.eVar21 = s.eVar36 = 'lead:bigpond-internet';
			s.events = 'event1,event6';
		}
		if (scUrl.indexOf('livechat') != -1) {
			s.linkTrackVars = "eVar21,eVar26,eVar36,prop26,prop61,eVar73,events";
			s.linkTrackEvents = "event1,event6,event16";
			s.eVar21 = s.eVar36 = 'lead:live-chat';
			s.prop61 = s.eVar73 = s.pageName;
			s.events = 'event1,event6,event16';
		}
	}

	// Define Reg Expressions used multiple times
	var thankYou=new RegExp("thank you");
	var formError=/error|problem/i;
	var formComplete=/thank you|confirmation|complete|confirmed|submitted|receipt|success/i;

	/* !Forms Tracking! */
	// Remove All hard-coded form events so we can populate on the correct pages
	/*
	s.eVar25=s.prop25="";
	s.eVar26=s.prop26="";
	s.eVar27=s.prop27="";
	*/

	// Put the top level DIR as the default section
	var scSectionTemp ='';
	if ('undefined' != typeof s.channel) {
		if (s.channel.indexOf('mobile')   !=-1) {scSectionTemp='MobilePhone';}
		if (s.channel.indexOf('homephone')!=-1) {scSectionTemp='HomePhone';}
		if (s.channel.indexOf('home-phone')!=-1){scSectionTemp='Home-Phone';}
		if (s.channel.indexOf('bigpond')  !=-1) {scSectionTemp='Bigpond';}
		if ((s.channel.indexOf('foxtel')  !=-1)||(s.channel.indexOf('tv')!=-1)){scSectionTemp = 'Foxtel';}
		if (scSectionTemp !='') {
			s.prop26=s.eVar26=scSectionTemp;
			s.getAndPersistValue(scSectionTemp,'scOrigin',0);
		}
	}
	// MOBILE PHONES
	// All events occur on the store or by phone. There are no forms. Purchases and
	// sales are tracked by this update, but subscriptions are not, as they cannot
	// be differentiated as yet

	// INTERNET
	// Look for a Bigpond new connection
	var joinBigpondStart=/bp.com:signup:rebuild servicequal/i;
	if ((joinBigpondStart.test(s.pageName)) && !(thankYou.test(s.pageName))) {
		scAddEvent("FormStart");
		s.setFormsTracking('FormStart','Start','BigPond','JoinBigPond');
	}
	// Look for iPhone Unlock
	if (/iphoneunlock/i.test(s.channel)){
		// iPhone Unlock pages have a <TITLE> tag as well as a meta title tag, but only the meta has the correct page name :(
		s.getUnlockPageName = function(){
			var metaItems=document.getElementsByTagName('meta'), pagename='';
			for(var j=0;j<metaItems.length;j++){
				if(metaItems[j].name.match(/^title/i)&&metaItems[j].content.length>0){pagename = metaItems[j].content;}
			}
			return s.prop1+':'+ s.prop2+':'+ s.prop3+':'+ s.channel+':'+pagename.replace('Telstra - ','').toLowerCase();
		}
		s.pageName= s.getUnlockPageName();
		if(formComplete.test(s.pageName)===false) {
			s.setFormsTracking('FormStart','Start', s.channel, s.prop4);
			if(document.getElementById('imei-details')) s.prop54="Unlock IMEI:"+document.getElementById('imei-details').value;
			s.eVar54=s.prop54=s.getAndPersistValue(s.prop54,'s_c54',0);

		}else if(formComplete.test(s.pageName)===true) {
			s.setFormsTracking('FormFinish','Finish',s.channel, s.prop4);
			s.eVar54=s.prop54='Confirmed '+s.getAndPersistValue(s.prop54,'s_c54',0);
			setDatCookie('s_c54','',-1,'telstra.com');
		}
		if(typeof $==='function' && $('.global-form-error').length) {
			s.prop28=s.channel+':'+$('.global-form-error').text().trim();
			s.events="event27";
			s.eVar54=s.prop54='Error '+s.getAndPersistValue(s.prop54,'s_c54',0);
			s.setFormsTracking('FormError','Error',s.channel, s.prop4);
			if(/^TD:TR:TR:iphoneunlock:$/i.test(s.pageName)){s.pageName=s.pageName+'generic error';}
		}
	}
	// Look for a ADSL2+ Top Hat Enquiry
	var topHatEnquiry=/TD:TR:TR:misc:adsl2\+ rollout update - top hat/i;
	if (topHatEnquiry.test(s.pageName) && !(formComplete.test(s.pageName))) {
		scAddEvent("FormStart");
		s.setFormsTracking('FormStart','Start','Bigpond','TopHat');
	}
	if (topHatEnquiry.test(s.pageName) && formComplete.test(s.pageName)) {
		scAddEvent("FormFinish");
		s.setFormsTracking('FormFinish','Finish','Bigpond','TopHat');
		try{s.prop54 = document.forms['frm_availCheck'].tophatresult.value;}catch(e){};
	}
	// FOXTEL
	// Look for Foxtel switch START event
	var switchFoxtelStart=/shop - foxtel from telstra/i;
	if ((switchFoxtelStart.test(s.pageName)) && !(formComplete.test(s.pageName))) {
		s.setFormsTracking('FormStart','Start','Foxtel','SwitchToFoxtel');
	}
	// Look for a successful switch to foxtel FINISH event
	var switchFoxtel=/switch to foxtel pay tv from telstra - thank you/i;
	if ((switchFoxtelStart.test(s.pageName)) && (formComplete.test(s.pageName))) {
		scAddEvent("Sale");
		scAddEvent("Subscription");
		s.setFormsTracking('FormStart','Finish','Foxtel','SwitchToFoxtel');
	}
	// Track Livechats
	if(isLiveChat) {
		omnitureData.channel = s.channel = 'livechat';
		/* Set a default for page name */
		omnitureData.pageName=document.location.pathname == "/" ? 'default queue' : document.location.pathname.replace('/','');
		/* Capture error page */
		if(/chatenquiry/i.test(document.location.pathname) && /unavailable/i.test(getElementsUsingClassName('heading')[0].innerHTML)){
			omnitureData.pageName = 'live chat unavailable';
			omnitureData.errorCodes = s.prop28 = 'livechat:unavailable';
		/* Set the appropriate events, and attempt to capture the connection/wait screen */
		} else if(/chatsession/i.test(document.location.pathname)) {
			scAddEvent("SelfService");
			s.setFormsTracking('FormStart','Start','livechat','LivechatSession');
			if(/connecting/i.test(getElementsUsingClassName('heading')[0].innerHTML)) {
				omnitureData.pageName = 'live chat connecting';
			}
		} else if(/chatsurvey/i.test(document.location.pathname)) {
			if(document.location.href == document.referrer) { /* SURVEY POST BACK */
				omnitureData.pageName = omnitureData.pageName + ' completed';
			} else {
				s.setFormsTracking('FormFinish','Finish','livechat','LivechatSession');
			}
		}
		s.pageName = setCustomPageName({'pageName' : omnitureData.pageName, 'channel' : 'livechat'});
	}
	// EOI Forms
	if (/TD:TR:TR:eoi/i.test(s.pageName)) {
		s.formSubSection = s.pageName.split(":")[s.pageName.split(":").length-1];
		s.formSubSection = s.formSubSection.replace(/expression of interest| -/gi,'');
		if (formComplete.test(s.formSubSection))	{ /* Signal complete if keyword found in s.pageName */
			s.setFormsTracking('FormFinish','Finish','Expression of Interest',s.getQueryParam('FormID')+':'+s.formSubSection.replace(formComplete,''));
			scAddEvent('EOI');
		} else if (formError.test(s.formSubSection))	{ /* Signal error keyword found in s.pageName */
			s.setFormsTracking('FormStart','Error','Expression of Interest',s.getQueryParam('FormID')+':'+s.formSubSection.replace(formError,''));
		} else { /* Default to form start */
			s.setFormsTracking('FormStart','Start','Expression of Interest',s.getQueryParam('FormID')+':'+s.formSubSection);
		}
	}
	// PVCS Forms on say.telstra.com.au
	if(/say.telstra.com.au/i.test(window.location.hostname)&&/customer\/general\/forms/i.test(window.location.pathname)) {
		s.formSection = s.getPageName().split(':').pop() || window.location.pathname.split('/').pop();
		if(debug)console.log('formSection:', s.formSection);
		if(/completed$/i.test(s.pageName)===false){
			s.setFormsTracking('FormStart','Start', s.formSection);
		}else if(/completed$/i.test(s.pageName)===false){
			s.setFormsTracking('FormStart','Error', s.formSection);
		}else {
			s.setFormsTracking('FormFinish','Finish', s.formSection);
			scAddEvent('SelfService');
		}
	}
	// Email Complaint Form on service.telstra.com.au
	if(/service.telstra.com.au/i.test(window.location.hostname)&&/general\/email-complaint/i.test(window.location.pathname)) {
		s.pageNameOnLoad = s.pageNameOnLoad||s.pageName;
		if(/jsession/i.test(window.location.pathname)===false){
			s.pageName= s.pageNameOnLoad+ s.prop4;
			s.setFormsTracking('FormStart','Start', s.prop4);
		}else if(/jsession/i.test(window.location.pathname)===true){
			s.pageName= s.pageNameOnLoad+ s.prop4+':submitted';
			s.setFormsTracking('FormFinish','Finish', s.prop4);
			scAddEvent('SelfService');
			s.prop54= s.eVar54='EmailComplaintRef:'+$('#form').text().trim().match(/(#[0-9]*-[0-9]*)/).pop();
		}
	}

	if (/^TD:TR:TR:webforms:consumer survey$/i.test(s.pageName)) {
		if(doPluginsCounter===0){
			if(debug)console.log('webExplore');
			$(document).ready(function(){
				if(debug)console.log('webExploreBind');
				var oForm = document.getElementById('survey');
				var oFormSubmit = oForm.getAttribute('onsubmit');
				oForm.setAttribute("onsubmit",'s.webExplore();'+oFormSubmit);
			});
		}
		s.webExplore = function(){
			if(debug)console.log('s.webExplore()');
			s.webExplore.resolution = $('input:radio[name="survey-performTask"]:checked').val();
			s.webExplore.rating = $('input:radio[name="survey-recommendToFriend"]:checked').val()-1;
			s.webExplore.verbatim = $('textarea[name="survey-comments"]').val();
			s.prop60=s.webExplore.resolution+'|'+s.webExplore.rating+'|'+s.webExplore.verbatim.substr(0,95);
			s.setFormsTracking('FormStart','Start','WebExploreSurvey','WebExploreSurvey:Start');
			s.t();
		}
	}
	if (/^TD:TR:TR:webforms:consumer survey - thank-you$/i.test(s.pageName)) {
		s.prop37 = s.eVar37 = "WebExplore";
		scAddEvent('formsuccess');
		s.setFormsTracking('FormFinish','Finish','WebExploreSurvey','WebExploreSurvey:Finish');
	}

	// MYACCOUNT: Login and Registration
	// Registration
	var myaccountRegistration=/myaccount:register|telstra registration complete|welcome to my account|telstra business - myaccount registration|myaccount:register - my account successful|register - myaccount - success/i;
	if (myaccountRegistration.test(s.pageName) && !formComplete.test(s.pageName)) {
		s.setFormsTracking('FormStart','Start','MyAccount','NewAccount');
	}
	if ((myaccountRegistration.test(s.pageName)) && (formError.test(s.pageName))) {
		s.setFormsTracking('FormStart','Error','MyAccount','NewAccount');
	}
	if ((myaccountRegistration.test(s.pageName)) && (formComplete.test(s.pageName))) {
		s.setFormsTracking('FormFinish','Finish','MyAccount','NewAccount');
		scAddEvent("Registration");
		s.prop44=s.eVar44="Logged in";
	}

	// MAP: Login
	if (/myaccount:login - my account/i.test(s.pageName)) {
		s.setFormsTracking('FormStart','Start','MyAccount','LoginAccount');
	};
	if (/myaccount:overview - my account$/i.test(s.pageName)) {
			s.setFormsTracking('FormFinish','Finish','MyAccount','LoginAccount');
	};
	if (/myaccount:loyalty/i.test(s.pageName) && /error/i.test(s.pageName)) {
		// Try to capture errors in the My Account loyalty form
		s.prop28 = "MyAcctV2-Loyalty-"+s.pageName.split(' - ').pop().toLowerCase();
	}
	var paperlessBill=/myaccount:paperless bill - my account/i;
	if (paperlessBill.test(s.pageName) && thankYou.test(s.pageName)===false) {
		s.setFormsTracking('FormStart','Start','MyAccount','PaperlessBilling');
	}
	if (paperlessBill.test(s.pageName) && thankYou.test(s.pageName)===true) {
		s.setFormsTracking('FormFinish','Finish','MyAccount','PaperlessBilling');
	}
	var PayABill=/(myaccount:.*pay (a|my) bill)|(billing:consumer(unreg|reg).*payments)/i;
	if (PayABill.test(s.pageName)){
		s.setFormsTracking('FormStart','Start','MyAccount','PayABill');
	}
	if ((PayABill.test(s.pageName)) && (/receipt/i.test(s.pageName))){
		s.setFormsTracking('FormFinish','Finish','MyAccount','PayABill');
		scAddEvent('BillPayment');
		scAddEvent('SelfService');
	}
	if ((PayABill.test(s.pageName)) && (/error/i.test(s.pageName))){
		s.setFormsTracking('FormError','Error','MyAccount','PayABill');
		/* s.prop28="MyAcctV2-PayABill-"+s.pageName.split(' - ').pop() // Don't track errorcodes, as this is handled by MAPC */
	}
	/* Set a better pagename when you see a 404 error page after attempting to pay with paypal */
	if(/TD:TR:TR:myaccount:404/i.test(s.pageName) && /paybill-receipt-paypal/i.test(s.prop4)){
		s.pageName = "TD:TR:TR:myaccount:404 Page Not Found:paybill-receipt-paypal";
		s.prop28 = "MyAcctV2:404 Page Not Found:paybill-receipt-paypal";
	}
	// Direct Debits can be setup in Payments, OLB, and MPPO.
	var DDSinPayments= "TD:TR:TR:myaccount:pay my bill - my account - bank - method saved",
		DDSinOLB     = "TD:TR:TR:billing:consumerreg:payments:direct debit registration:receipt",
		DDSinMPPO    = "TD:TR:TR:telstraprepaid:Direct debit recharge registration successful";
	var DDSConfirmationPages = new RegExp(DDSinPayments+"|"+DDSinOLB+"|"+DDSinMPPO,"i");
	if(DDSConfirmationPages.test(s.pageName)){
		scAddEvent('DirectDebit');
		scAddEvent('SelfService');
	}

	// MPPO Prepaid Plus Activation START
	var prepaidPlus=/TD:TR:TR:telstraprepaidplus/i;
	if ((prepaidPlus.test(s.pageName)) && (/activate/i.test(s.pageName))) {
		s.setFormsTracking('FormStart','Start','PrepaidPlus','Activation');
	}
	// MPPO Prepaid Plus Activation FINISH
	if ((prepaidPlus.test(s.pageName)) && (/congratulations/i.test(s.pageName))) {
		s.setFormsTracking('FormFinish','Finish','PrepaidPlus','Activation');
		s.events=s.apl(s.events,'event19',',',1);
		scAddEvent('PrepaidActivation');
		scAddEvent('SelfService');
	}
	// Unauthenticated Prepaid Recharge
	if(/prepaidrecharge/i.test(window.location.pathname)) {
		/* Prevent old PrepaidRecharge site from firing twice. It also incorrectly sets eVar48 on page,
		so test that, set it to undefined, and abort execution. doDataliciousBottom() will run a second time */
		if(typeof(s.eVar48)!='undefined'){
			s.eVar48 = undefined;
			throw new Error('Aborting execution of old Omniture s_code');
		}
		var prepaidRecharge=/:prepaidrecharge:/i,
			prepaidStep = gqp('execution')
		if((prepaidStep==='e1s1'||prepaidStep==='e2s1') && /enter recharge details/i.test(s.pageName)) {
			s.setFormsTracking('FormStart','Start','PrepaidRecharge','Recharge');
			s.pageName += ":check number";
		}
		if (prepaidRecharge.test(s.pageName) && /prepaidrecharge:congratulations/i.test(s.pageName)) {
			s.setFormsTracking('FormFinish','Finish','PrepaidRecharge','Recharge');
			scAddEvent('PrepaidRecharge');
			scAddEvent('SelfService');
		}
	}
	// !International Roaming Forms
	if(/webforms:international-roaming/i.test(s.prop5)) {
		// Set a custom channel.
		s.channel=s.eVar4='InternationalRoaming';
		s.onload= function() {if(window.tforms||window.pager) s.trackPageChanged(s);};
		// Activation + Data Pack Purchase Form
		if(/activate-roaming-data-pack/i.test(location.pathname)) {
			s.formSubSection = 'Activate Roaming and Data Pack'
			// first page of the form
			if(/webforms:apply to activate international roaming/i.test(s.pageName)) {
				s.setFormsTracking('FormStart','Start',s.channel,s.formSubSection);
			}
			// Do the following for both types of confirmation pages
			if(/thankyou.cfm/i.test(location.pathname)){
				scAddEvent("selfservice");
				scAddEvent("roamingactivated");
				s.setFormsTracking('FormFinish','Finish',s.channel,s.formSubSection);
			}
			// Only for Roaming Activation Only Confirmation page
			if(/activate-buynodata-thankyou.cfm/i.test(location.pathname)) {
				// No actions?
			}
			// Only for Roaming Activation + Data Pack Purchase Confirmation page
			if(/activate-buydata-thankyou.cfm/i.test(location.pathname)) {
				scAddEvent("Sale");
				scAddEvent("datapackadded");
				s.events=s.apl(s.events,'purchase',',',1);
				s.products = omnitureData.products ? omnitureData.products : ";Data Pack;1;,;";
				if(debug)console.log('ha');
				s.purchaseID = 'IR:'+Math.floor(Math.random() * 100000000 + 1);
			}
		} else if(/\/data-pack/i.test(location.pathname)) {// Data Pack Purchase Only Form
			s.formSubSection = 'Data Pack Only'
			if(/webforms:buy an international roaming data pack/i.test(s.pageName)) {
				s.setFormsTracking('FormStart','Start',s.channel,s.formSubSection);
			}
			if(/thankyou.cfm/i.test(location.pathname)){
				s.setFormsTracking('FormFinish','Finish',s.channel,s.formSubSection);
				scAddEvent("Sale");
				scAddEvent("selfservice");
				scAddEvent("datapackadded");
				s.events=s.apl(s.events,'purchase',',',1);
				s.products = omnitureData.products ? omnitureData.products : ";Data Pack;1;,;";
				s.purchaseID = 'IR:'+Math.floor(Math.random() * 100000000 + 1);
			}
		}
		// Capture any errors (All pages)
		if(omnitureData.errorCodes) {
			delete s.events; delete s.products;
			s.events=s.apl(s.events,'event27',',',1);
			s.setFormsTracking('FormStart','Error',s.channel,s.prop5);
			s.prop28 = omnitureData.errorCodes;
			s.pageName = setCustomPageName({'pageName' : 'validation error', 'channel' : s.channel});
		}
	}
	// !Mobile Optimised International Roaming Form
	if(/^\/misc\/mobile-site\/international-roaming.cfm$/i.test(window.location.pathname)) {
		if(doPluginsCounter===0){
		if(debug)console.log('Mobile Optimised International Roaming Form');
		$(document).ready(function(){
			$('form#internationalroaming input[type=radio]').on('click', function(){
				var formName = $(this).parents('section').children('h2,h3').text();
				s.track('input',{formName:'TMW:Roaming:'+formName,inputType:'radio',inputName:$(this).val()})
			});
			$('form#internationalroaming a.action-button').on('click', function(){
				var formName = $(this).parents('section').children('h2,h3').text();
				s.track('input',{formName:'TMW:Roaming:'+formName,inputType:'button',inputName:'Next Button'})
			})
		})
		}
	}
	// Look for a My Account Email Bill Form
	if (/TD:TR:TR:myaccount:update email - my account/i.test(s.pageName)){
		if(typeof $==='function'){ // Only track if jquery is present
			if(debug)console.log('emailbill');
			if(formComplete.test(s.pageName)===false && $('#error-div').length===0){
				s.setFormsTracking('FormStart','Start','Email Bill');
			}else if(formComplete.test(s.pageName)===false && $('#error-div').length>0){
				s.setFormsTracking('FormStart','Error','Email Bill');
				s.prop28 = 'EmailBill:'+($('#error-div').text().trim().split('.').shift() || 'Undetermined Error');
			}else {
				s.setFormsTracking('FormFinish','Finish','Email Bill');
				scAddEvent('EmailBill');
				scAddEvent('SelfService');
			}
		}
		if(/^TD:TR:TR:myaccount:update email - my account$/i.test(s.pageName)){
			delete s.pageName; /* Try to prevent double tracking */
		}
	}
	// Look for a Business & Enterprise Request Email Bill form
	if (/TD:TBE:webforms:email bill/i.test(s.pageName) && !(formComplete.test(s.pageName))) {
		s.setFormsTracking('FormStart','Start',s.channel,s.prop4); //s.channel='app',s.prop4=email_bill_request
	}
	if (/TD:TBE:webforms:email bill/i.test(s.pageName) && formComplete.test(s.pageName)) {
		s.setFormsTracking('FormFinish','Finish',s.channel,s.prop4);
		scAddEvent('EmailBill');
		scAddEvent('SelfService');
	}
	// Look for a Premium SMS Barring Form
	if (/TD:TR:TR:general:premium sms barring/i.test(s.pageName)){
		if (/Barring Request Submitted/i.test(document.getElementById('form').innerHTML)){
			s.setFormsTracking('FormFinish','Finish',s.channel,s.prop4);
			scAddEvent('SelfService');
			if(debug)console.log('Barring Request Submitted');
		}else{
			s.setFormsTracking('FormStart','Start',s.channel,s.prop4);
			if(debug)console.log('Barring Request Start');
		}
	}
	/* !STORE LOCATORS! */
	if(isStoreLocator){
		s.pageNameOnLoad = s.pageNameOnLoad||s.pageName;
		if(doPluginsCounter==1){
			$('.tracklink').live('click',function(){
				var trackData = {};
				trackData.query = $('#storePostcode1').val();
				trackData.zip = trackData.query.match(/[0-9]{4}/).pop()
				trackData.state = trackData.query.match(/ACT|NSW|NT|QLD|SA|TAS|VIC|WA/ig).pop().toLowerCase()
				trackData.pageNameOnLoad = s.pageNameOnLoad;
				trackData.linkText = $(this).text().trim().toLowerCase();
				trackData.cleanPageName = trackData.linkText.replace(/tab| tracklink/ig,'');
				trackData.pageName =  trackData.pageNameOnLoad+':'+trackData.cleanPageName;
				trackData.events="event14"; // Should add check for search performed.
				s.zip=s.prop38=s.eVar38=trackData.zip;
				s.state=s.prop39=s.eVar39=trackData.state;
				s.eVar21='lead:find-shop';
				s.track('page',trackData);
			})
		}
	}
	if (isTMW == true && /find a store/i.test(s.pageName) && window.location.hash=="#top") { /* Mobile Store Locator */
		scAddEvent("StoreLocator"); // Should add check for search performed.
		s.eVar21='lead:find-shop';
	}
	if (/:misc:nbn/i.test(s.pageName)) { /* NBN Availability Checker */
		s.zip = document.getElementById('postcode').value; /* Grab the post code */
	}
	// PURCHASE EVENTS
	// Look for an existing purchase event and duplicate it to the sale event (event5)
	// Use the originating site section prior to landing on the store
	if (/purchase/i.test(s.events)) {
		scAddEvent("Sale");
		scAddEvent("FormFinish");
		s.eVar25=s.prop25="Finish";
		s.eVar26=s.prop26=s.getAndPersistValue(s.eVar26,'scOrigin',0);
		if(typeof(s.eVar26) == "undefined") {s.eVar26="";}
		s.eVar27=s.prop27="ShopOnline";
		s.setFormsTracking('FormFinish',s.eVar25,s.eVar26,s.eVar27);
	}
	// ASSISTED SALES TRACKING
	if ((s.transactionID == ('')||(typeof s.transactionID == 'undefined'))) {
		var scOffTrans = s.getQueryParam('on').replace(/[^0-9]/g, '');
		var scPR = s.getQueryParam('pr');
		if (scOffTrans != '') {
			s.transactionID = scOffTrans;
			// Online transactions are identified by the following codes
			if (!(/^AVPC|AVPD|AVPE|ATAN|AM4H|3RLB$/.test(scPR))) {
				s.events=s.apl(s.events,'event10:'+s.transactionID,',',1); // Assisted Sale, serialized by TransID
			}
		}
	};

	if (s.eVar6 == '') {s.eVar6=s.getQueryParam('cc');}
	// Capture the full Useragent into prop35/eVar24. Previously used to record flash player plugin
	s.prop35=s.eVar24="D=User-Agent"
	// REDIRECT CAPTURING
	if (s.getQueryParam('red')) {s.prop36=s.getQueryParam('red');s.eVar54='Redirect:'+s.prop36;}

	/* !Capture form field errors - set in omnitureData.fieldErrorCodes! /*
	if(omnitureData.formFieldErrors) {
		s.eVar53 = s.prop53 = omnitureData.formFieldErrors;
	}
	/* !Bigpond Hashed Username Sharing! Rename cookie to tdbpxfer on Sept 5 */
	if(s.eVar45 && !getDatCookie('scUidHashed') && doPluginsCounter === 0 ){
		var bigpond_img = new Image(),
			bipond_url = ('https:' == document.location.protocol ? 'https://infos' : 'http://info') + '.telstra.com/b/ss/telstrabpbigpondprd/1/H.22.1/s',
			bigpond_qs = (new Date().getTime()) + '?AQB=1&ndh=1&ns=bigpond&cdp=2&v24=' + s.eVar45 + '&v25=Telstra.com%20login&pageName=D=v25&events=event43&pe=lnk_o&pev2=D=v25&AQE=1';
		bigpond_img.src =  bipond_url+bigpond_qs;
		setDatCookie('scUidHashed','tdbpxfer',90,datCookieDomain,datCookiePath);
	}
	/* !Code copied from help-centre.js! */
	if(window.location.toString().indexOf("help.telstra.com") > -1){
		if(typeof omnitureEvents     !="undefined") {s.events     = omnitureEvents;    }
		if(typeof omnitureProducts   !="undefined") {s.products   = omnitureProducts;  }
		if(typeof omniturePurchaseID !="undefined") {s.purchaseID = omniturePurchaseID;}
		if(typeof omnitureStateName  !="undefined") {s.state      = omnitureStateName; }
		if(typeof omnitureZipCode    !="undefined") {s.zip        = omnitureZipCode;   }
	}
    /* !LSP Tracking! */
	if(isLiveHelp) {
		omnitureData.query = s.prop33 = unescape(gqp("query").replace(/\+/g," "));
		omnitureData.lc_omniture = window['lc_omniture'];
		omnitureData.filter = '';
		if(omnitureData.query)omnitureData.events = s.events = s.apl(s.events,'event74',',',1);
		omnitureData.resultsCount = s.prop34 = $('.lsp-result-count').first().text().trim()

		// If a user initiates a chat from the homepage, and it returns zero results, then don't count that.
		if(gqp('_lsplivechatportlet_WAR_gsasearchportlet_triggerLiveChat')=='true' && omnitureData.resultsCount=='0 of 0 results'){
			delete omnitureData.resultsCount;
		}else{
			omnitureData.resultsCount.replace(' | Remove filter','');
		}
		omnitureData.pageNameOnLoad = omnitureData.pageNameOnLoad ? omnitureData.pageNameOnLoad : s.pageName;
		if(s.prop4) s.pageName = omnitureData.pageNameOnLoad+" "+(omnitureData.subsection=s.prop4);

		/* Track the 'More' button that loads additional search results
			TODO: Only captures first click. Doesn't wait till text is updated. Captured 'remove' link
		*/
		$(document).ready(function(){
			$('.rounded-corners .ajax-loader-link').on('click', function() {
				omnitureData.resultsCount = s.prop34 = $('.lsp-result-count').first().text().trim()
				if(debug)console.log(s.prop34);
				s.track('button',{
					linkName:'LSP:More Results',
					query:omnitureData.query,
					filter:omnitureData.filter,
					resultsCount:omnitureData.resultsCount,
					events:'event74'
				});
			});
		});
	}
	/* !Mobility Partner Portal Search Terms! */
	if(isMobilityPartner){
		if(document.getElementById("searchKeywords") != null){
			s.prop64=document.getElementById("searchKeywords").value;
		}
	}
	/* !Updating page name for Store Locator Directions page! */
	 if(isStoreLocator){
		if(window.location.toString().indexOf("#directions") > -1){
			s.pageName=s.pageName+"#directions";
		}
	}
	/* !Ipad Shop Confirmation Screen Tracking! */
	if(/\/ipad-shop\/order-complete/i.test(window.location.pathname)){
		s.events='event27,event24,purchase,event5';
		if((document.getElementById("orderId") != null) && (document.getElementById("deviceDetails") != null) && (document.getElementById("plan-planType") != null)){
			s.products=";"+document.getElementById("deviceDetails").value+"-"+document.getElementById("plan-planType").value+";1;";
			s.purchaseID=document.getElementById("orderId").value;
		}
	}
	/* !TB Biz Essential  Confirmation Screen Tracking! */
	if(/bizessentials online order form - confirmation/i.test(s.pageName)){
		s.events='event27,event6';
		s.eVar21="Biz Essentials";
	}
	/* !TB Mobility Bundle Confirmation Screen Tracking! */
	if(/telstra business - mobility bundle - success/i.test(s.pageName)){
			s.events='event27,event6';
			s.eVar21="Mobility Bundle";
	}
	/* !Facebook App! */
	if(isFacebookApp){
		if(omnitureData.Prop54){
			s.prop54=omnitureData.Prop54;
			s.eVar54=s.prop54;
		}
	}
	/* !ServiceStatus Tracking! */
	if(isServiceStatus){
		if(s.prop1==='BP'){
			omnitureData.prop1='TD';
			omnitureData.prop2='TR';
			omnitureData.prop3='TR';
			omnitureData.channel='service-status';
			omnitureData.pageName=s.pageName=omnitureData.prop1+':'+omnitureData.prop3+':'+omnitureData.channel;
		}
		omnitureData.q = gqp('q').replace('.html','')||'';
		omnitureData.service  = decodeURI(gqp('service')).toLowerCase()||'';
		if(omnitureData.service){
			s.getPreviousValue(omnitureData.service, 'gpv_ss');
			omnitureData.pageName = s.cleanPageName(omnitureData.q+':'+omnitureData.service);
		}else{
			omnitureData.pageName = s.cleanPageName(omnitureData.q);
		};
		// Bind to Search Button
		if(typeof $==='function' && doPluginsCounter===0){
			$(document).ready(function(){
				$('#blackhawk_search_button').click(function(){
					s.zip = omnitureData.zip = $('#blackhawk_search_textfield').val();
					s.track('page',omnitureData);
					if(debug && !(/*@cc_on!@*/0))console.info('GOC: Tracking Search Button', s.zip, omnitureData.pageName);
				});
			})
		}
		// Track drill down to event information
		if(/event/i.test(omnitureData.q) && typeof $ === 'function'){
			omnitureData.eventType = $('.terms_accepted h2').text();
			omnitureData.eventData = s.eventData= $('.terms_accepted td').contents();
			omnitureData.pageName  = omnitureData.eventType;
			omnitureData.service   = s.getPreviousValue(omnitureData.service, 'gpv_ss');
			omnitureData.genericString= ('GOC:'+ s.eventData[3].textContent+':'+ s.eventData[4].textContent+' @'+ s.eventData[2].textContent).toString();
			if(debug && !(/*@cc_on!@*/0))console.info('GOC: Tracking Event Information', s.zip, omnitureData.eventType);
		}
		// Start mapping omnitureData values to s{} vars
		s.prop1=s.eVar1=omnitureData.prop1;
		s.prop2=s.eVar2=omnitureData.prop2;
		s.prop3=s.eVar3=omnitureData.prop3;
		s.channel=s.eVar4=omnitureData.channel;
		s.prop4=s.eVar5 = omnitureData.service; // subsection
		s.prop5=s.eVar72= omnitureData.channel+(omnitureData.service!==''?':'+omnitureData.service:''); //section:subsection
		s.hier1=s.prop1+'|'+s.prop2+'|'+s.prop3+'|'+ s.channel;
		s.zip  =s.zip || gqp('postcode');
		s.pageName = s.setCustomPageName(omnitureData);
		// Values for event information
		if(omnitureData.eventType){
			s.prop54=s.eVar54=omnitureData.genericString;
			s.zip=(s.eventData[2].textContent).toString().split(',').shift(); // Only grab the first one in a csv list
			s.zip=(typeof s.zip==='number')? s.zip:''; // Sometimes the field return is not a postcode, so reset to empty if not a number
			s.events = scAddEvent('selfservice',true);
		}
		if(debug && !(/*@cc_on!@*/0)) {
			console.group('GOC: Tracking Service Status Application');
			console.dir(omnitureData);
			console.log('gpv_ss:',s.getPreviousValue(omnitureData.service, "gpv_ss"));
			console.groupEnd();
		}
	}
	/* !Funnel Tracking helper function! */
	function generateFunnelName(formSection,formSubsection,siteSectionSubsection,pageChannel) {
		var funnelName = "";
		// 1. There are values already populated for eVar26 & eVar27 - USE THIS
		if (formSection && formSubsection) {funnelName=formSection + ":" + formSubsection;}
		// 2. There is a value already populated for eVar26 but not eVar27 - USE eVar26 : "funnel"
		else if (formSection && !formSubsection) {funnelName=formSection + ":" + "funnel";}
		// 3. There is a value already populated for eVar27 but not eVar26 - USE channel : eVar27
		else if (!formSection && formSubsection) {funnelName=pageChannel + ":" + formSubsection;}
		// 4. There are no values for eVar26 & eVar27 - Use eVar72
		else {funnelName=siteSectionSubsection;}
		return funnelName;
	};
	// Funnel Check - Only perform Funnel Processing on initial page loads or s.tl calls
	if (doPluginsCounter === 0 || (doPluginsCounter === 1 && typeof(s.linkType) === 'undefined')) {
		// Set default values for form variables if they have not been done already
		if(typeof(s.eVar26) == "undefined") {s.eVar26="";}
		if(typeof(s.eVar27) == "undefined") {s.eVar27="";}
		if(typeof(s.eVar72) == "undefined") {s.eVar72="";}
		// If events contains "Funnel Start" (event23)
		if (/event23/i.test(s.events)){
			var funnelName = generateFunnelName(s.eVar26,s.eVar27,s.eVar72,s.channel);
			// Check the previous value of "Funnel Name" using the getPreviousValue - and store the next value to funnelName
			var tmpPrevFunnelName = s.getPreviousValue(funnelName,'gpv_fn');
			// If the previous value is not blank
			if (tmpPrevFunnelName) {
				// If the previous value is the same as funnelName
				if (tmpPrevFunnelName == funnelName) {
					// Remove event23 from the event list and do not set funnel Name
					s.events=s.events.replace(/event23[,]?/i,"");
					s.eVar27=s.prop27="";
				}
				// If the previous value is different to funnelName
				else {
					// Leave event23 and set "Funnel Name" to the value of funnelName
					s.eVar27=s.prop27=funnelName;
				}
			}
			//If the previous value of Funnel Name is blank
			else {
				// Leave event23 and set "Funnel Name" to the value of funnelName
				s.eVar27=s.prop27=funnelName;
			}
		} // End events contains "Funnel Start" (event23)

		// If events contains "Funnel Step" (event28)
		if (/event28/i.test(s.events)){
			var funnelName = generateFunnelName(s.eVar26,s.eVar27,s.eVar72,s.channel);
			s.eVar27=s.prop27=funnelName;
		} // End events contains "Funnel Step" (event28)

		// If events contains "Funnel Completion" (event24)
		if (/event24/i.test(s.events)){
			var funnelName = generateFunnelName(s.eVar26,s.eVar27,s.eVar72,s.channel);

			// Check the previous value of "Funnel Name" using the getPreviousValue - and store the next value to funnelName
			var tmpPrevFunnelName = s.getPreviousValue(funnelName,'gpv_fn');
			// If the previous value is not blank
			if (tmpPrevFunnelName) {
				// If the previous value is the same as funnelName
				if (tmpPrevFunnelName == funnelName + ":processed") {
					// Remove event24 from the event list and do not set funnel Name
					s.events=s.events.replace(/event24[,]?/i,"");
					s.eVar27=s.prop27="";
					s.getPreviousValue(tmpPrevFunnelName,'gpv_fn');
				}
				// If the previous value is different to funnelName
				else {
					// Leave event24 and set "Funnel Name" to the value of funnelName
					s.eVar27=s.prop27=funnelName;
					s.getPreviousValue(funnelName + ":processed",'gpv_fn');
				}
			}
			//If the previous value of Funnel Name is blank
			else {
				// Leave event24 and set "Funnel Name" to the value of funnelName
				s.eVar27=s.prop27=funnelName;
				s.getPreviousValue(funnelName + ":processed",'gpv_fn');
			}
		} // End events contains "Funnel Completion" (event24)
	} // End - Funnel Check

	if((/^(www.telstra.com.au|telstra.com.au)$/i.test(window.location.hostname) || checkDevEnvironment())
		&& typeof $==='function' && typeof document.getElementById('primary-nav') !== 'null'){
		s.onload(s.trackGlobalNav);
	}

	/* ! Third Party Ad Server Functions!
	 * This code should come only at the end of the do_plugin function */
	(function callAdServer() {
		var adserverConversionEvents = /purchase|event7|event14|event16|event65/,
			blacklist = /^(\/activate|\/auth_activate|\/myaccount\/(?!home|overview|loyalty|register).*)/i; // Pathname only
		if(!blacklist.test(window.location.pathname)) {
			if(typeof window.adserver ==="object" && doPluginsCounter === 0) {
				if(typeof adserver.unitag ==="function")		adserver.unitag();
				if(typeof adserver.orderTagging ==='object')	adserver.orderTagging.track();
				if(typeof window.audienceManager ==='function')	window.audienceManager();
				if(/purchase/i.test(s.events) && typeof adserver.xDeviceTagging ==='function') adserver.xDeviceTagging();
				if(typeof adserver.getZMSsetId ==='function')  s.getZMSegment();
			} else if(adserverConversionEvents.test(s.events)) {
				if(typeof adserver.orderTagging ==='object')    adserver.orderTagging.track();
			}
		}
	}());

	// 2DF product terms tracking from search
	if (!s.getQueryParam("tc")) {s.eVar40 = getProductTerms();}
	doPluginsCounter += 1;
	// !END: doPlugins
}
s.doPlugins=s_doPlugins;
/************************** PLUGINS SECTION *************************/
/* ! setFormsTracking */
s.setFormsTracking = function (formEvent,formState,formSection,formSubsection) {
	// Soft set: if the argument is present, then do, otherwise do nothing.
	if(debug)('setFormsTracking: Event:'+formEvent+', State:'+formState+', Section:'+formSection+', Subsection:'+formSubsection);
	formEvent=typeof(formEvent)!=''?	scAddEvent(formEvent):'';
	formState=typeof(formState)!=''?	s.eVar25=s.prop25=formState:'';
	formSection=typeof(formSection)!=''?s.eVar26=s.prop26=formSection:'';
	formSubsection=typeof(formSubsection)!=''?s.eVar27=s.prop27=formSubsection:'';
};
/* Datalicious PurchasePath v6 */
function purchasePathPreProcess(){
	purchasePath.scTrafficSourceVariable = 'eVar16';
	purchasePath.scTrafficSourceStackingVariable = 'eVar18';
	purchasePath.scSearchKeywordStackingVariable = 'eVar17';
	purchasePath.brandTerms = 'telstra,bigpond,big+pond,sensis';
	purchasePath.semIdentifierParameterList = 'tc,gclid,s_kwcid';
	var campaignCode = purchasePath.getParameterValue(window.location.href, 'tc');
	if(campaignCode != null && campaignCode != ''){
		purchasePath.campaignCode = campaignCode;
		purchasePath.customShortCampaignCode = campaignCode.substring(0,2).toUpperCase();
		if(campaignCode.indexOf('G|B')==0) purchasePath.customShortCampaignCode = 'GB';
		if(campaignCode.indexOf('G|P')==0) purchasePath.customShortCampaignCode = 'GP';
		if(campaignCode.indexOf('G|E')==0) purchasePath.customShortCampaignCode = 'GE';
		if(campaignCode.indexOf('Y|B')==0) purchasePath.customShortCampaignCode = 'YB';
		if(campaignCode.indexOf('Y|P')==0) purchasePath.customShortCampaignCode = 'YP';
		if(campaignCode.indexOf('Y|E')==0) purchasePath.customShortCampaignCode = 'YE';
	}
}
purchasePath={campaignCode:"",customShortCampaignCode:"",brandTerms:"",trafficSource:"",trafficSourceStacking:"",searchKeyword:"",searchKeywordStacking:"",scTrafficSourceVariable:"",scTrafficSourceStackingVariable:"",scSearchKeywordVariable:"",scSearchKeywordStackingVariable:"",semIdentifierParameterList:"gclid,s_kwcid",expireDays:30,expireEventList:"purchase",seKeyString:"daum:q,eniro:search_word,naver:query,images.google:q,google:q,yahoo:p,msn:q,bing:q,aol:query,aol:encquery,lycos:query,ask:q,altavista:q,netscape:query,cnn:query,about:terms,mamma:query,alltheweb:q,voila:rdata,virgilio:qs,live:q,baidu:wd,alice:qs,yandex:text,najdi:q,aol:q,mama:query,seznam:q,search:q,wp:szukaj,onet:qt,szukacz:q,yam:k,pchome:q,kvasir:q,sesam:q,ozu:q,terra:query,mynet:q,ekolay:q,rambler:words",socialMediaDomains:"facebook.com,plus.google.com,twitter.com,myspace.com,linkedin.com,bebo.com,classmates.com,cyworld.com,blackplanet.com,buzznet.com,cellufun.com,flixster.com,flickr.com,fotolog.com,foursquare.com,friendsreunited.com,friendster.com,geni.com,grono.net,habbo.com,hi5.com,last.fm,livemocha.com,mocospace.com,multiply.com,myheritage.com,mylife.com,my.opera.com,myyearbook.com,nk.pl,netlog.com,odnoklassniki.ru,opendiary.com,orkut.com,plaxo.com,qzone.qq.com,renren.com,skyrock.com,sonico.com,stickam.com,stumbleupon.com,studivz.net,tagged.com,viadeo.com,weeworld.com,weread.com,spaces.live.com,xanga.com,xing.com,digg.com,reddit.com",replaceAll:function(a,c,b){myRegExp=new RegExp(c,"g");
return a.replace(myRegExp,b)},getHostName:function(a){if(a.indexOf("://")>=0){a=a.substring(a.indexOf("://")+3,a.length)
}if(a.indexOf("/")>=0){a=a.substring(0,a.indexOf("/"))}return a},getParameterValue:function(c,b){b=b.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");
var a="[\\?&]"+b+"=([^&#]*)";var e=new RegExp(a);var d=e.exec(c);if(d==null){return null}else{return d[1]
}},getCookie:function(a){if(document.cookie.length>0){c_start=document.cookie.indexOf(a+"=");if(c_start!=-1){c_start=c_start+a.length+1;
c_end=document.cookie.indexOf(";",c_start);if(c_end==-1){c_end=document.cookie.length}return unescape(document.cookie.substring(c_start,c_end))
}}return""},setCookie:function(b,c,a){var d=new Date();d.setDate(d.getDate()+a);document.cookie=b+"="+escape(c)+";domain=."+this.replaceAll(this.getHostName(window.location.href.toLowerCase()),"www.","")+";path=/"+((a==null)?"":";expires="+d.toGMTString())
},getSearchKeyword:function(d){var a="";var e=this.getHostName(d);var c=this.seKeyString.split(",");for(i=0;
i<c.length;i++){var b=c[i].substring(0,c[i].indexOf(":"));var f=c[i].substring(c[i].indexOf(":")+1,c[i].length);
if(e.indexOf(b)>=0){a=unescape(this.getParameterValue(d,f));if(a==""){a="-na-"}}}return a},isBrandedKeyword:function(b){var a=false;
var c=this.brandTerms.split(",");for(i=0;i<c.length;i++){if(b.indexOf(c[i])>=0){a=true}}return a},isPaidTraffic:function(){var a=false;
var b=this.semIdentifierParameterList.split(",");for(i=0;i<b.length;i++){if(this.getParameterValue(window.location.href.toLowerCase(),b[i].toLowerCase())!=null){a=true
}}return a},getSocialMediaDomain:function(b){var a="";var c=this.socialMediaDomains.split(",");for(i=0;
i<c.length;i++){if(this.getHostName(b).indexOf(c[i])>=0){a=c[i]}}return a},scEventExists:function(b){if(s.events){var a=s.events.split(",");
for(i=0;i<a.length;i++){if(a[i]==b||a[i].indexOf(b+":")>-1){return true}}}return false},exec:function(){var k=false;
if(this.trafficSource==""){var a=this.getHostName(document.referrer);var g="";var j=false;if(this.campaignCode!=""){if(this.customShortCampaignCode!=""){g=this.customShortCampaignCode.substring(0,2)
}else{g=this.campaignCode.substr(0,2)}if(g=="di"||g=="ob"||g=="og"||g=="cb"||g=="cg"||g=="re"||g=="rp"||g=="sm"||g=="sp"){g="ca"
}this.trafficSource=this.campaignCode;this.searchKeyword=this.getSearchKeyword(document.referrer);j=this.isPaidTraffic()
}else{if(document.referrer!=""&&this.getHostName(window.location.href.toLowerCase())!=this.getHostName(document.referrer.toLowerCase())){this.searchKeyword=this.getSearchKeyword(document.referrer);
if(this.searchKeyword!=""){j=this.isPaidTraffic();if(this.isBrandedKeyword(this.searchKeyword)){if(j){g="cb";
this.trafficSource="sem:branded:"+a}else{g="ob";this.trafficSource="seo:branded:"+a}}else{if(j){g="cg";
this.trafficSource="sem:generic:"+a}else{g="og";this.trafficSource="seo:generic:"+a}}}else{var e=this.getSocialMediaDomain(document.referrer);
if(e!=""){j=this.isPaidTraffic();if(j){g="sp";this.trafficSource="social:paid:"+a}else{g="sm";this.trafficSource="social:organic:"+a
}}else{j=this.isPaidTraffic();if(j){g="rp";this.trafficSource="referral:paid:"+a}else{g="re";this.trafficSource="referral:organic:"+a
}}}}else{if(document.referrer==""){g="di";this.trafficSource="direct"}}}if(this.trafficSource!=""){this.trafficSourceStacking=this.getCookie("__ppFullPath");
if(this.trafficSourceStacking==""){this.trafficSourceStacking=g}else{var f=this.trafficSourceStacking.split("-");
if(f.length==1){this.trafficSourceStacking=this.trafficSourceStacking+"-"+g}else{var h=f[1];var b=f[f.length-1];
if(b.length==2){f.push(h+"1")}else{if(h==b.substr(0,2)){var c=b.substr(2);c++;f[f.length-1]=h+c}else{f.push(h+"1")
}}f[1]=g;this.trafficSourceStacking="";for(var d=0;d<f.length;d++){if(d>0){this.trafficSourceStacking=this.trafficSourceStacking+"-"
}this.trafficSourceStacking=this.trafficSourceStacking+f[d]}}}this.setCookie("__ppFullPath",this.trafficSourceStacking,this.expireDays);
if(this.searchKeyword!=""){this.searchKeywordStacking=this.getCookie("__ppKeywords");if(j){if(this.searchKeywordStacking==""){this.searchKeywordStacking="paid:"+this.searchKeyword
}else{this.searchKeywordStacking=this.searchKeywordStacking+">paid:"+this.searchKeyword}}else{if(this.searchKeywordStacking==""){this.searchKeywordStacking="organic:"+this.searchKeyword
}else{this.searchKeywordStacking=this.searchKeywordStacking+">organic:"+this.searchKeyword}}this.setCookie("__ppKeywords",this.searchKeywordStacking,this.expireDays)
}k=true}}return k},scExec:function(){try{var fromInternal=false;var internalDomains=s.linkInternalFilters.split(",");
for(i=0;i<internalDomains.length;i++){if(this.getHostName(document.referrer).toLowerCase().indexOf(internalDomains[i].toLowerCase())>=0){fromInternal=true
}}if(!fromInternal){if(s.campaign){this.campaignCode=s.campaign}if(typeof purchasePathPreProcess=="function"){purchasePathPreProcess()
}if(this.exec()){if(this.trafficSource!=""&&this.scTrafficSourceVariable!=""){eval("s."+this.scTrafficSourceVariable+'="'+this.trafficSource+'"')
}if(this.searchKeyword!=""&&this.scSearchKeywordVariable!=""){eval("s."+this.scSearchKeywordVariable+'="'+this.searchKeyword+'"')
}if(this.trafficSourceStacking!=""&&this.scTrafficSourceStackingVariable!=""){eval("s."+this.scTrafficSourceStackingVariable+'="'+this.trafficSourceStacking+'"')
}if(this.searchKeywordStacking!=""&&this.scSearchKeywordStackingVariable!=""){eval("s."+this.scSearchKeywordStackingVariable+'="'+this.searchKeywordStacking+'"')
}}if(typeof purchasePathPostProcess=="function"){purchasePathPostProcess()}}if(this.expireEventList!=""){var expireNow=false;
var expireEvents=this.expireEventList.split(",");for(i=0;i<expireEvents.length;i++){if(this.scEventExists(expireEvents[i])){expireNow=true
}}if(expireNow){this.setCookie("__ppFullPath","");this.setCookie("__ppKeywords","")}}}catch(e){}}};

// 2Datafish Product Terms Tracking.
function getProductTerms() {
	var a = document.referrer;
	var getTerm = {
		srch: [
			[/^http:\/\/(www\.)?google\./i, /q=([^&]*)/i, "G", "S"],
			[/^http:\/\/(www\.)?bing\./i, /q=([^&]+)/i, "B", "S"],
			[/^http:\/\/(www\.)?search\.yahoo\./i, /p=([^&]+)/i, "Y", "S"],
			[/^http:\/\/(www\.)?search\.msn\./i, /q=([^&]+)/i, "M", "S"],
			[/^http:\/\/(www\.)?search\.live\./i, /query=([^&]+)/i, "ML", "S"],
			[/^https:\/\/(www\.)?plus\.url\.google\./i, /url=([^&]+)/i, "GP", "P"],
			[/^http:\/\/(www\.)?daum\./i, /q=([^&]+)/i, "D", "S"],
			[/^http:\/\/(www\.)?naver\./i, /query=([^&]+)/i, "N", "S"],
			[/^http:\/\/(www\.)?sensis\./i, /find=([^&]+)/i, "S", "S"],
			[/^http:\/\/(www\.)?search\.mywebsearch\./i, /searchfor=([^&]+)/i, "MWS", "S"],
			[/^http:\/\/(.*)?ask\./i, /q=([^&]+)/i, "A", "S"],
			[/^http:\/\/(.*)?search-results\./i, /q=([^&]+)/i, "SR", "S"],
			[/^http:\/\/(.*)?baidu\./i, /wd=([^&]+)/i, "BD", "S"],
			[/^http:\/\/(.*)?\./i, /q=([^&]+)/i, "O", "S"]
		],
		decodeURL: function (a, c) {
			var a = decodeURIComponent(a),
				b = null,
				d = null;
			for (var i = 0; i < c.length; i++) if (n = c[i], n[0].test(a)) {
				var e = a.match(n[1]);
				if (e) {
					-1 < a.indexOf("source=productsearch") && (n[3] = "SH");
					b = "GP" != n[2] ? e[1].toLowerCase() : s.getQueryParam("gs");
					b || (b = "unknown", n[3] = "SS");
					d = "|" + window.location.toString().split("?")[0].split("#")[0] + "|" + n[2] + "|" + n[3];
					break
				}
			}
			b && (b = b.replace(/(\'|")/, "$1"), b += d);
			return b
		}
	};
	return !a ? "" : (a = getTerm.decodeURL(a, getTerm.srch)) ? a : !1;
}

/* * TNT Integration Plugin v1.0
   * v - Name of the javascript variable that is used. Defaults to s_tnt (optional)
   * p - Name of the url parameter. Defaults to s_tnt (optional)
   * b - Blank Global variable after plugin runs. Defaults to true (Optional)
   */
s.trackTNT = function(v, p, b) {
	var s=this, n="s_tnt", p=(p)?p:n, v=(v)?v:n, r="",pm=false, b=(b)?b:true;
	if(s.getQueryParam) pm = s.getQueryParam(p); //grab the parameter
	if(pm) r += (pm + ",");					// append the parameter
	if(s.wd[v] != undefined) r += s.wd[v];	// get the global variable
	if(b) s.wd[v] = "";						// Blank out the global variable for ajax requests
	return r;
};

/* Plugin: getQueryParam 2.3 */
s.getQueryParam=new Function("p","d","u",""
+"var s=this,v='',i,t;d=d?d:'';u=u?u:(s.pageURL?s.pageURL:s.wd.locati"
+"on);if(u=='f')u=s.gtfs().location;while(p){i=p.indexOf(',');i=i<0?p"
+".length:i;t=s.p_gpv(p.substring(0,i),u+'');if(t){t=t.indexOf('#')>-"
+"1?t.substring(0,t.indexOf('#')):t;}if(t)v+=v?d+t:t;p=p.substring(i="
+"=p.length?i:i+1)}return v"); s.p_gpv=new Function("k","u",""
+"var s=this,v='',i=u.indexOf('?'),q;if(k&&i>-1){q=u.substring(i+1);v"
+"=s.pt(q,'&','p_gvf',k)}return v"); s.p_gvf=new Function("t","k",""
+"if(t){var s=this,i=t.indexOf('='),p=i<0?t:t.substring(0,i),v=i<0?'T"
+"rue':t.substring(i+1);if(p.toLowerCase()==k.toLowerCase())return s."
+"epa(v)}return ''");

/* Plugin: getPreviousValue v1.0 v:variable from prev page. c:cookie, e:(opt)events  */
s.getPreviousValue=new Function("v","c","el",""
+"var s=this,t=new Date,i,j,r='';t.setTime(t.getTime()+1800000);if(el"
+"){if(s.events){i=s.split(el,',');j=s.split(s.events,',');for(x in i"
+"){for(y in j){if(i[x]==j[y]){if(s.c_r(c)) r=s.c_r(c);v?s.c_w(c,v,t)"
+":s.c_w(c,'no value',t);return r}}}}}else{if(s.c_r(c)) r=s.c_r(c);v?"
+"s.c_w(c,v,t):s.c_w(c,'no value',t);return r}");

/* getValOnce 0.2 - get a value once per session or number of days  */
s.getValOnce=new Function("v","c","e",""
+"var s=this,k=s.c_r(c),a=new Date;e=e?e:0;if(v){a.setTime(a.getTime("
+")+e*86400000);s.c_w(c,v,e?a:0);}return v==k?'':v");

/* Plugin: getNewRepeat 1.0 - Return whether user is new or repeat */
s.getNewRepeat=new Function(""
+"var s=this,e=new Date(),cval,ct=e.getTime(),y=e.getYear();e.setTime"
+"(ct+30*24*60*60*1000);cval=s.c_r('s_nr');if(cval.length==0){s.c_w("
+"'s_nr',ct,e);return 'New';}if(cval.length!=0&&ct-cval<30*60*1000){s"
+".c_w('s_nr',ct,e);return 'New';}if(cval<1123916400001){e.setTime(cv"
+"al+30*24*60*60*1000);s.c_w('s_nr',ct,e);return 'Repeat';}else retur"
+"n 'Repeat';");

/* Plugin clickThruQuality v1.0 - [one line description of plugin] */
s.clickThruQuality =new Function("scp","tcth_ev","cp_ev","cff_ev","cf_th",""
+"var s=this;if(s.p_fo('clickThruQuality')==1){var ev=s.events?s.even"
+"ts+',':'';if(s.getQueryParam&&s.getQueryParam(scp)){s.events=ev+tct"
+"h_ev;if(s.c_r('cf')){var tct=parseInt(s.c_r('cf'))+1;s.c_w('cf',tct"
+",0);if(tct==cf_th&&cff_ev){s.events=s.events+','+cff_ev;}}else {s.c"
+"_w('cf',1,0);}}else {if(s.c_r('cf')>=1){s.c_w('cf',0,0);s.events=ev"
+"+cp_ev;}}}");

s.p_fo=new Function("n",""
+"var s=this;if(!s.__fo){s.__fo=new Object;}if(!s.__fo[n]){s.__fo[n]="
+"new Object;return 1;}else {return 0;}");

s.campaignClickThruQuality =new Function("scp","tcth_ev","cp_ev","cff_ev","cf_th",""
+"var s=this;if(s.p_fo('campaignClickThruQuality')==1){var ev=s.events?s.even"
+"ts+',':'';if(s.getQueryParam&&s.getQueryParam(scp)){s.events=ev+tct"
+"h_ev;if(s.c_r('ccf')){var tct=parseInt(s.c_r('ccf'))+1;s.c_w('ccf',tct"
+",0);if(tct==cf_th&&cff_ev){s.events=s.events+','+cff_ev;}}else {s.c"
+"_w('ccf',1,0);}}else {if(s.c_r('ccf')>=1){s.c_w('ccf',0,0);s.events=ev"
+"+cp_ev;}}}");

s.keywordClickThruQuality =new Function("scp","tcth_ev","cp_ev","cff_ev","cf_th",""
+"var s=this;if(s.p_fo('keywordClickThruQuality')==1){var ev=s.events?s.even"
+"ts+',':'';if(s.getQueryParam&&s.getQueryParam(scp)){s.events=ev+tct"
+"h_ev;if(s.c_r('kcf')){var tct=parseInt(s.c_r('kcf'))+1;s.c_w('kcf',tct"
+",0);if(tct==cf_th&&cff_ev){s.events=s.events+','+cff_ev;}}else {s.c"
+"_w('kcf',1,0);}}else {if(s.c_r('kcf')>=1){s.c_w('kcf',0,0);s.events=ev"
+"+cp_ev;}}}");

/* Plugin Append List: apl v1.1 */
s.apl=new Function("L","v","d","u",""
+"var s=this,m=0;if(!L)L='';if(u){var i,n,a=s.split(L,d);for(i=0;i<a."
+"length;i++){n=a[i];m=m||(u==1?(n==v):(n.toLowerCase()==v.toLowerCas"
+"e()));}}if(!m)L=L?L+d+v:v;return L");

/*	Plug-in: crossVisitParticipation v1.6 */
s.crossVisitParticipation=new Function("v","cn","ex","ct","dl","ev","dv",""
+"var s=this,ce;if(typeof(dv)==='undefined')dv=0;if(s.events&&ev){var"
+" ay=s.split(ev,',');var ea=s.split(s.events,',');for(var u=0;u<ay.l"
+"ength;u++){for(var x=0;x<ea.length;x++){if(ay[u]==ea[x]){ce=1;}}}}i"
+"f(!v||v==''){if(ce){s.c_w(cn,'');return'';}else return'';}v=escape("
+"v);var arry=new Array(),a=new Array(),c=s.c_r(cn),g=0,h=new Array()"
+";if(c&&c!=''){arry=s.split(c,'],[');for(q=0;q<arry.length;q++){z=ar"
+"ry[q];z=s.repl(z,'[','');z=s.repl(z,']','');z=s.repl(z,\"'\",'');arry"
+"[q]=s.split(z,',')}}var e=new Date();e.setFullYear(e.getFullYear()+"
+"5);if(dv==0&&arry.length>0&&arry[arry.length-1][0]==v)arry[arry.len"
+"gth-1]=[v,new Date().getTime()];else arry[arry.length]=[v,new Date("
+").getTime()];var start=arry.length-ct<0?0:arry.length-ct;var td=new"
+" Date();for(var x=start;x<arry.length;x++){var diff=Math.round((td."
+"getTime()-arry[x][1])/86400000);if(diff<ex){h[g]=unescape(arry[x][0"
+"]);a[g]=[arry[x][0],arry[x][1]];g++;}}var data=s.join(a,{delim:',',"
+"front:'[',back:']',wrap:\"'\"});s.c_w(cn,data,e);var r=s.join(h,{deli"
+"m:dl});if(ce)s.c_w(cn,'');return r;");

/* 	Plugin Utility: Replace v1.0*/
s.repl=new Function("x","o","n",""
+"var i=x.indexOf(o),l=n.length;while(x&&i>=0){x=x.substring(0,i)+n+x."
+"substring(i+o.length);i=x.indexOf(o,i+l)}return x");

/*	Plug-in: s.join - used by crossVisitParticipation function  */
s.join = new Function("v","p",""
+"var s = this;var f,b,d,w;if(p){f=p.front?p.front:'';b=p.back?p.back"
+":'';d=p.delim?p.delim:'';w=p.wrap?p.wrap:'';}var str='';for(var x=0"
+";x<v.length;x++){if(typeof(v[x])=='object' )str+=s.join( v[x],p);el"
+"se str+=w+v[x]+w;if(x<v.length-1)str+=d;}return f+str+b;");

/* Plugin: getPageName v2.1 - parse URL and return */
s.getPageName=new Function("u",""
+"var s=this,v=u?u:''+s.wd.location,x=v.indexOf(':'),y=v.indexOf('/',"
+"x+4),z=v.indexOf('?'),c=s.pathConcatDelim,e=s.pathExcludeDelim,g=s."
+"queryVarsList,d=s.siteID,n=d?d:'',q=z<0?'':v.substring(z+1),p=v.sub"
+"string(y+1,q?z:v.length);z=p.indexOf('#');p=z<0?p:s.fl(p,z);x=e?p.i"
+"ndexOf(e):-1;p=x<0?p:s.fl(p,x);p+=!p||p.charAt(p.length-1)=='/'?s.d"
+"efaultPage:'';y=c?c:'/';while(p){x=p.indexOf('/');x=x<0?p.length:x;"
+"z=s.fl(p,x);if(!s.pt(s.pathExcludeList,',','p_c',z))n+=n?y+z:z;p=p."
+"substring(x+1)}y=c?c:'?';while(g){x=g.indexOf(',');x=x<0?g.length:x"
+";z=s.fl(g,x);z=s.pt(q,'&','p_c',z);if(z){n+=n?y+z:z;y=c?c:'&'}g=g.s"
+"ubstring(x+1)}return n");

/* Plugin: getTimeParting 3.0 - Set timeparting values based on time zone - valid through 2014 */
s.getTimeParting=new Function("t","z",""
+"var s=this,d,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T;d=new Date();A"
+"=d.getFullYear();if(A=='2009'){B='08';C='01'}if(A=='2010'){B='14';C"
+"='07'}if(A=='2011'){B='13';C='06'}if(A=='2012'){B='11';C='04'}if(A="
+"='2013'){B='10';C='03'}if(A=='2014'){B='09';C='02'}if(!B||!C){B='08"
+"';C='01'}B='03/'+B+'/'+A;C='11/'+C+'/'+A;D=new Date('1/1/2000');if("
+"D.getDay()!=6||D.getMonth()!=0){return'Data Not Available'}else{z=p"
+"arseFloat(z);E=new Date(B);F=new Date(C);G=F;H=new Date();if(H>E&&H"
+"<G){z=z+1}else{z=z};I=H.getTime()+(H.getTimezoneOffset()*60000);J=n"
+"ew Date(I+(3600000*z));K=['Sunday','Monday','Tuesday','Wednesday','"
+"Thursday','Friday','Saturday'];L=J.getHours();M=J.getMinutes();N=J."
+"getDay();O=K[N];P='AM';Q='Weekday';R='00';if(M>30){R='30'}if(L>=12)"
+"{P='PM';L=L-12};if(L==0){L=12};if(N==6||N==0){Q='Weekend'}T=L+':'+R"
+"+P;if(t=='h'){return T}if(t=='d'){return O}if(t=='w'){return Q}}");

/* Plugin: checkForDayLightSavingsTime 1.0 - Check if DST is active */
s.checkForDayLightSavingsTime=function(){
	Date.prototype.stdTimezoneOffset = function() {
		var jan = new Date(this.getFullYear(), 0, 1);
		var jul = new Date(this.getFullYear(), 6, 1);
		return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
	}
	Date.prototype.dst=function(){return this.getTimezoneOffset() < this.stdTimezoneOffset();}
	var today=new Date();
	if(today.dst()){return true;}else{return false;}
}
s.gs=new Function("var ra=[120,144,232,76,172,126,82,98,166,216,2];for"
+"(var i=ra.length,st='';i--;st+=String.fromCharCode(ra[i]/ra[10])"
+");var c=s.gs.caller.toString();if(/s.gs/.test(c)){return st.substring(1,11)};");

/* Utility Function: split v1.5 - split a string (JS 1.0 compatible) */
s.split=new Function("l","d",""
+"var i,x=0,a=new Array;while(l){i=l.indexOf(d);i=i>-1?i:l.length;a[x"
+"++]=l.substring(0,i);l=l.substring(i+d.length);}return a");

/* Plugin: getAndPersistValue 0.3 - get a value on every page */
s.getAndPersistValue=new Function("v","c","e",""
+"var s=this,a=new Date;e=e?e:0;a.setTime(a.getTime()+e*86400000);if("
+"v)s.c_w(c,v,e?a:0);return s.c_r(c);");

/* Plugin: linkHandler 0.5 */
s.linkHandler=new Function("p","t",""
+"var s=this,h=s.p_gh(),i,l;t=t?t:'o';if(!h||(s.linkType&&(h||s.linkN"
+"ame)))return '';i=h.indexOf('?');h=s.linkLeaveQueryString||i<0?h:h."
+"substring(0,i);l=s.pt(p,'|','p_gn',h.toLowerCase());if(l){s.linkNam"
+"e=l=='[['?'':l;s.linkType=t;return h;}return '';");
s.p_gn=new Function("t","h",""
+"var i=t?t.indexOf('~'):-1,n,x;if(t&&h){n=i<0?'':t.substring(0,i);x="
+"t.substring(i+1);if(h.indexOf(x.toLowerCase())>-1)return n?n:'[[';}"
+"return 0;");
s.p_gh=new Function(""
+"var s=this;if(!s.eo&&!s.lnk)return '';var o=s.eo?s.eo:s.lnk,y=s.ot("
+"o),n=s.oid(o),x=o.s_oidt;if(s.eo&&o==s.eo){while(o&&!n&&y!='BODY'){"
+"o=o.parentElement?o.parentElement:o.parentNode;if(!o)return '';y=s."
+"ot(o);n=s.oid(o);x=o.s_oidt}}return o.href?o.href:'';");
/*DynamicObjectIDs v1.5: Setup Dynamic Object IDs based on URL*/
s.setupDynamicObjectIDs=new Function(""
+"var s=this;if(!s.doi){s.doi=1;if(s.apv>3&&(!s.isie||!s.ismac||s.apv"
+">=5)){if(s.wd.attachEvent)s.wd.attachEvent('onload',s.setOIDs);else"
+" if(s.wd.addEventListener)s.wd.addEventListener('load',s.setOIDs,fa"
+"lse);else{s.doiol=s.wd.onload;s.wd.onload=s.setOIDs}}s.wd.s_semapho"
+"re=1}");
/* Safer OnLoad Event. Try to use instead of window.onload */
s.onload=function(functionName){try{if(window.addEventListener){
window.addEventListener('load', functionName, false);/* W3C standard */}
else if (window.attachEvent){window.attachEvent('onload', functionName);}
}catch(e){if(debug)console.warn(e);}};

/* sha1 function used to hash the username */
s.sha1Hash=function(m,p){
ROTL = function(b,c){return(b<<c)|(b>>>(32-c))};
f = function(c,b,e,d){switch(c){case 0:return(b&e)^(~b&d);case 1:return b^e^d;
case 2:return(b&e)^(b&d)^(e&d);case 3:return b^e^d;}};Number.prototype.toHexStr=function(){var d="",b;
for(var c=7;c>=0;c--){b=(this>>>(c*4))&15;d+=b.toString(16)}return d};
var q=[1518500249,1859775393,2400959708,3395469782];if(p){m=""+m+s.gs()};m+=String.fromCharCode(128);
var B=Math.ceil(m.length/4)+2;var n=Math.ceil(B/16);var o=new Array(n);
for(var D=0;D<n;D++){o[D]=new Array(16);for(var C=0;C<16;C++){
o[D][C]=(m.charCodeAt(D*64+C*4)<<24)|(m.charCodeAt(D*64+C*4+1)<<16)|
(m.charCodeAt(D*64+C*4+2)<<8)|(m.charCodeAt(D*64+C*4+3))}};
o[n-1][14]=((m.length-1)*8)/Math.pow(2,32);o[n-1][14]=Math.floor(o[n-1][14]);
o[n-1][15]=((m.length-1)*8)&4294967295;var x=1732584193;var w=4023233417;
var v=2562383102;var u=271733878;var r=3285377520;var g=new Array(80);var I,H,G,F,E;
for(var D=0;D<n;D++){for(var y=0;y<16;y++){g[y]=o[D][y]};
for(var y=16;y<80;y++){g[y]=ROTL(g[y-3]^g[y-8]^g[y-14]^g[y-16],1)};
I=x;H=w;G=v;F=u;E=r;
for(var y=0;y<80;y++){var z=Math.floor(y/20);
var k=(ROTL(I,5)+f(z,H,G,F)+E+q[z]+g[y])&4294967295;E=F;F=G;G=ROTL(H,30);H=I;I=k};
x=(x+I)&4294967295;w=(w+H)&4294967295;v=(v+G)&4294967295;u=(u+F)&4294967295;r=(r+E)&4294967295};
return x.toHexStr()+w.toHexStr()+v.toHexStr()+u.toHexStr()+r.toHexStr();
}

getElementsUsingClassName=function(cn){var allT=document.getElementsByTagName('*'),
allCN=new Array(), i=0, a;while(a=allT[i++]){a.className==cn?allCN[allCN.length]=a:null;
}return allCN;}

/* !s.track() function! BOOKMARK */
s.track=function(eventType, trackData) {
	if(debug)console.log('s.track('+eventType+', '+JSON.stringify(trackData)+')');
	if(debug) window.trackData = new Object(); window['trackData'] = trackData

	try{
		/* The following are common keys we expect to find. If you need to do something special for an event type, overwrite it in the switch */
		delete s.products;
		s.channel	= trackData.channel		? trackData.channel		: s.channel;
		s.prop5		= s.prop5				? s.prop5				: null;
		s.events	= trackData.events		? scAddEvent(trackData.events, true) : null;
		s.pageName	= trackData.pageName	? trackData.pageName	: s.pageName;
		s.linkName	= trackData.linkName	? trackData.linkName	: null;
		if(typeof trackData.products != 'object'){
		s.products	= trackData.products	? trackData.products	: s.products;
		}
		s.eVar6		= trackData.trackCode	? trackData.trackCode	: s.eVar6;
		s.prop28	= trackData.errorCode	? trackData.errorCode	: s.prop28; /* Some projects used errorCode, other errorCodes plural */
		s.prop28	= trackData.errorCodes  ? trackData.errorCodes	: s.prop28;
		s.prop61	= s.eVar73 = s.pageName;
		s.linkTrackVars   = "eVar54,prop54,prop61,eVar73,events";
		s.linkTrackEvents = "event27";

		/* Prepare LiveHelp (LSP) data */
		if(isLiveHelp) s.trackLiveHelp(eventType,trackData);

		/* Prepare Connected Home data */
		if(isConnectedHome) s.trackConnectedHome(eventType,trackData);

		/* Prepare Moving Home data */
		if(isMovers) s.trackMovingHome(eventType,trackData);
		/* Dump the function params into the Generic String prop and evar, so we can monitor how it's being used */
		if(trackData.eVar54||trackData.prop54||trackData.genericString !== undefined){
			s.prop54 = s.eVar54 = trackData.eVar54||trackData.prop54||trackData.genericString;
		}else{
			if(typeof JSON !== 'undefined')	s.prop54 = s.eVar54 = 's.track('+eventType+', '+JSON.stringify(trackData)+')';
		}

		switch (eventType) {
			case "accordian":
				s.pageName = trackData.pageName
				s.t();
			break;
			case "button":
				var buttonName = trackData.buttonName ? trackData.buttonName : trackData.linkName;
				var formName = trackData.formName ? trackData.formName : s.prop5;
				s.tl(this,'o',formName+':'+buttonName);
			break;
			case "GSAresult":
				if(debug)console.dir(trackData);
				/* BOOKMARK */
				s.linkTrackVars = s.apl(s.linkTrackVars,'prop21,prop22,prop67,s.eVar54,s.prop54',',',1);
				s.events= s.linkTrackEvents = "event22";
				if(debug)console.log('s.linkTrackVars',s.linkTrackVars);
				s.prop21 = trackData.query;
				s.prop22 = trackData.resultsCount;
				s.eVar54 = trackData.suggestion;
				s.prop67 = trackData.searchSegment;
				s.pageName = trackData.pageName;
				s.tl(this,"o",trackData.linkName);
				delete s.events;
			break;
			case "input":
				var formName = trackData.formName ? trackData.formName : s.prop5;
				s.events = trackData.events = scAddEvent('clicks', true);
				s.linkTrackEvents = s.events;
				if(trackData.inputName && trackData.inputType) s.prop54 = s.eVar54 = formName+':'+trackData.inputType+":"+trackData.inputName;
				trackData.linkName = formName+':'+trackData.inputType+':'+trackData.inputName
				s.tl(this,'o',trackData.linkName);
				delete s.events;
			break;
			case "download":
				/* Only for mobile app exits to appstores. The download event can be called with an optional platform parameter that prefixes the appname. */
				s.eVar66	= trackData.appname	? trackData.appname	: "appname not specified";
				s.eVar66	= trackData.platform? trackData.platform+":"+trackData.appname : trackData.appname;
				s.linkTrackVars = s.apl(s.linkTrackVars,'eVar66',',',1);
				s.linkTrackEvents = s.apl(s.linkTrackEvents,'event73',',',1); /* Add download event TBD */
				s.events="event73";
				s.tl(this,"o",trackData.appname);
				delete s.events;
			break;
			case "form":
				/*
				if(trackData.module && trackData.inputs && trackData.button){ // Format used by Movers and Connected Home
				s.setFormsTracking('FormStart','Start',trackData.module,trackData.button);
					s.prop54 = s.eVar54 = 'MOVERS:module='+trackData.module+':inputs='+trackData.inputs+':button='+trackData.button;
					s.prop61 = trackData.pageName;
					trackData.pageName = trackData.module+':'+trackData.button;
					s.pageName = s.setCustomPageName(trackData);
				}
				*/
				s.t();
			break;
			case "lightbox":
				s.linkTrackEvents=s.apl(s.linkTrackEvents,trackData.events,',',1);
				s.events = s.apl(s.events,'event22',',',1) /* Add click event */
				if(trackData.product) s.products = ";"+trackData.product.toLowerCase()+";1;"; /* Code where we pass in lightbox passes in just the sku, so one off case. TODO: fix */
				s.tl(this,"o",trackData.linkName);
			break;
			case "link":
				s.events = s.apl(s.linkTrackEvents,'event22',',',1); /* Add click event */
				if(trackData.trackCode) { /* If a campaign tracking code is present, track that too */
					s.linkTrackVars = s.apl(s.linkTrackVars,'eVar6',',',1);
					s.eVar6 = trackData.trackCode;
				}
				if((trackData.type) && !(trackData.eVar54)) s.prop54 = s.eVar54 = trackData.type+":"+trackData.linkName;
				s.tl(this,'o',trackData.linkName);
			break;
			case "page":
				if(debug)console.log('trackData');
				delete s.prop61; delete s.eVar73; /* Only needed for custom link tracking */
				if(/iphoneunlock/i.test(window.location.pathname)){ // BUGFIX: Drop extra tracking calls in iphone unlock
					s.prop1="TD";s.prop2=s.prop3='TR';s.channel=window.location.pathname.split('/')[1];
					s.pageName=s.prop1+':'+s.prop2+':'+s.prop3+':'+(s.channel+':'+trackData.pageName).toLowerCase();
					throw new Error('BUGFIX: Drop extra tracking calls in iphone unlock.')
				}
				s.pageNamePrefix = s.prop1+':'+s.prop2+':';
				/* Check if prefix is present. Don't check s.prop3 (bugs in MAP-C) Don't check s.channel. Too often we fiddle it. */
				if(RegExp(s.pageNamePrefix).test(s.pageName)==false){
					if(debug)console.log('s.pageName changed to:', '"'+s.pageNamePrefix+'"+"'+s.prop3+':'+s.channel+'"+":'+s.pageName+'"');
					s.pageName=s.pageNamePrefix+s.prop3+':'+s.channel+':'+s.pageName;
				}
				s.t();
			break;
			case "tag":
				if(debug)console.log('Remarketing Tag:', trackData.gtag);
				if(typeof adserver === 'object' && trackData.gtag) {
					var oTags = adserver.remarketingTags[s.channel];
					if(oTags[trackData.gtag]){
						if(debug)console.log('Found immediately:', oTags[trackData.gtag])
						adserver.remarketingTags.firePixel(oTags[trackData.gtag]);
					}else{
						for (var gtag in oTags){
							if( trackData.gtag.toUpperCase() === gtag.toUpperCase() ){
								if(debug)console.info('Found for ',gtag);
								adserver.remarketingTags.firePixel(oTags[gtag]);
								break;
							}
						}
					}
				}
				if(debug)console.log('Remarketing Tag END');
			break;
			case "toast":
				if(trackData.action && trackData.description) s.prop54 = s.eVar54 = s.channel+":"+eventType+":"+trackData.action+":"+trackData.description;
				if(/onBegin|onAccept|onExpire|onUnavailable|onShow|onReject/i.test(trackData.action)){
					if(debug)console.log('Proactive Livechat tracking request');
					s.events = "event22";
				}
				s.tl(this,"o",s.prop54);
			break;
			case "load":
				s.tl();
			break;
			case "tab": /* Track as a page */
				s.pageName = trackData.pageName
				s.events   = s.apl(s.events,trackData.events,',',1);
				s.products = (trackData.productId ? ";"+trackData.productId+";1;" : "").toLowerCase();
				s.t();
			break;
			case "smlxlwgt":
				s.linkTrackVars = s.apl(s.linkTrackVars,'products',',',1)
				s.linkTrackEvents = s.apl(s.linkTrackEvents,'prodView',',',1); /* Add download event TBD */
				s.products = ";"+trackData.phoneCode+";1;,;"+trackData.planCode+";1;"
				s.events=s.apl(s.events,'prodView',',',1);
				s.tl(this,'o','smlxlwgt:'+trackData.action+':'+trackData.phoneCode+':'+trackData.planCode);
			break;
			case "lead":
				s.pageName = trackData.pageName;
				s.eVar21   = trackData.leadType;
				s.t();
			break;
			default :
				s.prop54 = s.eVar54 = 'unknown eventType:'+s.prop54;
				s.t();
			break;
		}
		/* Zero out our values */
		var arrDeletions = ['s.prop54','s.eVar54','s.prop28','s.products','s.linkTrackVars','s.linkTrackEvents','s.events','s.prop61','s.eVar73','s.eVar6'];
		for(var i=0; i<arrDeletions.length;i++){/* if(debug)console.log('delete: ',i, arrDeletions[i] ); */ delete arrDeletions[i];}
		s.pageName = s.pageNameOnLoad?s.pageNameOnLoad:s.pageName; //Auto return pagename. Only CH at the mo
	}catch(e){
		throw new Error('Error caught in s.track(): ' + e);
	}
};
/* !trackConnectedHome routines specifically for Connected Home! */
s.trackConnectedHome=function(eventType, trackData) {
	/* if(debug)console.log('s.trackConnectedHome('+eventType+','+JSON.stringify(trackData)+')'); */
	var getLinkName = function(trackData){
		return "CH:"+(trackData.module+ ':' + trackData.linkName).toLowerCase();
	}
	var getPageName = function(trackData){
		return s.cleanPageName(s.CHPagePrefix+':'+omnitureData.app.pageType+':'+trackData.module);
	}
	var getTrackCode = function(trackCode) { /* Track into evar6/tracking code. */
		var tiDate = new Date();tiDate=tiDate.toDateString().split(' ');tiDate=tiDate[1]+""+tiDate[3];
		return "TR:TR:"+tiDate+":"+trackData.linkName;
	}
	var trackOrderForm = function() {
		if ((typeof (cart) === 'object') && ((omnitureData.app.pageType === "order form") || (omnitureData.app.pageType === "order success"))){
			var productString ="";
			if(cart.bundle !== '') {
				productString = cart.bundle;
				s.products = ";"+cart.bundle + ";1;";
			}
			if(cart.deal !== '') {
				productString += "-"+cart.deal;
				s.products += ",;" + cart.deal +";1;";
			}
			if(cart.accessMethod !== '') {
				productString += "-"+cart.accessMethod;
				s.products += ",;" + cart.accessMethod +";1;";
			}
			if (typeof (cart.products) === 'object') {
				for(i=0;i < cart.products.length;i++){
					productString += "-"+cart.products[i];
					s.products += ",;"+cart.products[i]+";1;";
				}
			}
			if (typeof (cart.channels) === 'object') {
				for(i=0;i < cart.channels.length;i++){
					productString += "-"+cart.channels[i];
					s.products=s.products+",;"+productString+";1;";
				}
			}
			if(productString != ""){
				s.products += ",;"+productString+";1;";
			}
		}
		if(omnitureData.app.pageType === "order form"){
			s.events   = s.apl(s.events,'scCheckout',',',1);
		}
		if(omnitureData.app.pageType === "order success"){
			s.events   = s.apl(s.events,'purchase',',',1);
			s.purchaseID=cart.purchaseId ? cart.purchaseId : "CH-"+Math.floor(Math.random() * 100000000 + 1);
		}
	}
	/* Assumes everything is in order. */
	switch(eventType){
		case "load": /* The 'load' eventType is for when the page just loads into the browser like normal */
			if(doPluginsCounter < 1) {
				if(debug)s.prop3 = s.eVar3 = trackData.appenv;
				s.pageName=s.CHPagePrefix=[s.prop1,s.prop2,s.prop3,s.channel.toLowerCase()].join(':');
				s.hier1=s.hier1+":"+s.channel;
				s.pageNameOnLoad = s.pageName +':'+ s.getMetaPageName().toLowerCase();
				s.eVar5 = trackData.app.pageType
				s.prop5 = s.eVar72 = s.channel+":"+trackData.app.pageType;
				s.prop28 = trackData.app.shopCode;
				var cart = omnitureData.cartLineItems;
				trackOrderForm();
				return trackData;
			}
		break;
		case "link": /* For s.track(eventType=link,{}) Mainly informational/small content */
			if(/hero slider/i.test(trackData.module)) {
				trackData.linkName	= getLinkName(trackData);
				trackData.trackCode	= getTrackCode(trackData);
			}
		break;
		case "tab": /* For s.track(eventType=tab,{}) Mainly used inside the lighbox. */
			trackData.pageName = s.cleanPageName(s.CHPagePrefix+":"+(trackData.module+":"+trackData.linkName).toLowerCase());
			if(trackData.productId){
				 s.products=";"+trackData.productId+";1;";
				 s.events = s.apl(s.events,trackData.events,',',1);
			}
		break;
		case "form": /* For s.track(eventType=form,{}) */
			s.events="event27";
			trackData.pageName=s.cleanPageName(s.CHPagePrefix+':orderflow:'+trackData.module);
			s.zip = document.getElementById('installLocationPostCode') ? document.getElementById('installLocationPostCode').value : null;
			if(trackData.inputs) trackData.genericString = "CH-"+trackData.inputs;
			if(/sqView/i.test(trackData.events)) {
				trackData.pageName=s.cleanPageName(s.CHPagePrefix+':customise bundles:'+trackData.module);
				s.events   = scAddEvent('formstart');
				s.events   = scAddEvent('selfservice');
			}else if(trackData.events){
				s.events   = s.apl(s.events,trackData.events,',',1);
				s.products=";"+trackData.productId+";1;";
			}
		break;
		case "lightbox": /* For s.track(eventType=lightbox,{}) For the common products lightbox */
			if(trackData.productId){
				s.products=";"+trackData.productId+";1;";
				s.events   = trackData.events?s.apl(s.events,trackData.events,',',1): s.events;
			}
			s.events = trackData.events ? s.apl(s.linkTrackEvents,trackData.events,',',1): "";
			if(/hero (slider|banner)|VAS/i.test(trackData.module)) {
				trackData.linkName	= getLinkName(trackData);
				trackData.pageName	= getPageName(trackData);
				trackData.trackCode	= getTrackCode(trackData);
			}
		break;
		case "page": /* For s.track(eventType=page,{}) Page level events such as opening the plans on the home */
			  trackData.channel = s.channel;
			  s.pageName = s.cleanPageName(s.setCustomPageName(trackData));
			  s.events   = trackData.events?s.apl(s.events,trackData.events,',',1): s.events;
			  s.products   = ";"+trackData.bundle+";1;";
			if(debug)console.log('omnitureData',omnitureData);
		break;
		case "accordian": /* For s.track(eventType=lightbox,{}) For the common products lightbox */
			s.events="event27";
			if(trackData.linkName) trackData.genericString = "CH-"+trackData.linkName;
			trackData.pageName=s.cleanPageName(s.CHPagePrefix+':orderflow:'+trackData.module);
		break;
		case "popup": /* For s.track(eventType=popup,{}) For livechat popups. */
			s.linkTrackEvents	= scAddEvent(trackData.events);
			trackData.pageName	= getPageName(trackData);
		default :
		break;
	}
	// During development copy everything to window to help with Selenium tests
	if(debug) {
		console.log('s.trackConnectedHome('+eventType+','+JSON.stringify(trackData)+')')
		window.trackData = trackData;window.trackData.eventType = eventType;
	}
	return trackData;
}
/* !trackMovingHome routines specifically for Movers! */
s.trackMovingHome=function(eventType, trackData) {
	var getLinkName = function(trackData){
		var returnValue = "MV:"+(trackData.module+ ':' + trackData.linkName).toLowerCase();
		//if(debug)console.log('mv:getLinkName() returns',returnValue, 'input:',trackData);
		return returnValue;
	}
	var getPageName = function(trackData){
		var returnValue = s.cleanPageName(s.MVPagePrefix+':'+omnitureData.app.pageType+':'+trackData.module);
		//if(debug)console.log('mv:getPageName() returns',returnValue, 'input:',trackData);
		return returnValue;
	}
	var getTrackCode = function(trackCode) { /* Track into evar6/tracking code. */
		var tiDate = new Date();tiDate=tiDate.toDateString().split(' ');tiDate=tiDate[1]+""+tiDate[3];
		var returnValue = "TR:TR:"+tiDate+":"+trackData.linkName;
		//if(debug)console.log('mv:getTrackCode() returns',returnValue, 'input:',trackData);
		return returnValue;
	}
	var trackOrderForm = function(cart) {
		if(debug)console.log(cart);
		if (typeof cart === 'object' && /order (form|success)/i.test(omnitureData.app.pageType)){
			if(cart.products.length === 1){
				s.products=s.getAndPersistValue(';'+cart.products+';1;','s_persistCart',0);
			}else if(cart.products.length > 1){
				s.products=s.getAndPersistValue(';'+cart.products.join(";1;,;")+';1;','s_persistCart',0);
			}
			if(/order review/i.test(trackData.module)){
				s.events   = s.apl(s.events,'scCheckout',',',1);
			}else if(omnitureData.app.pageType === "order form"){
				s.events   = s.apl(s.events,'scView',',',1);
			}
			if(/order success/i.test(omnitureData.app.pageType)){
				s.events = s.apl(s.events,'purchase',',',1);
				s.purchaseID=cart.purchaseId;
				s.products=s.getAndPersistValue(s.products,'s_persistCart',0);
			}
		}
	}
	/* Assumes everything is in order. */
	switch(eventType){
		case "load": /* The 'load' eventType is for when the page just loads into the browser like normal */
			if(doPluginsCounter < 1) {
				if(debug)s.prop3 = s.eVar3 = trackData.appenv;
				s.pageName=s.MVPagePrefix=[s.prop1,s.prop2,s.prop3,s.channel.toLowerCase()].join(':');
				s.hier1=s.hier1+":"+s.channel;
				s.pageNameOnLoad = s.pageName +':'+ s.getMetaPageName().toLowerCase();
				// If the order fails, replace the last part of the pagename with 'order failed'
				if(/orderfailed/i.test(location.pathname) && s.getMetaPageName()==="Order Success"){s.pageName=[s.prop1,s.prop2,s.prop3,s.channel.toLowerCase(),"order failed"].join(':');}
				s.eVar5 = trackData.app.pageType
				s.prop5 = s.eVar72 = s.channel+":"+trackData.app.pageType;
				s.prop28 = trackData.app.shopCode;
				trackOrderForm(omnitureData.cartLineItems);
				if(debug)console.log('load event returns',trackData);
				return trackData;
			}
		break;
		case "form": /* For s.track(eventType=form,{}) */
			//if(debug)console.log('form',trackData);
			s.events   = trackData.events?s.apl(s.events,trackData.events,',',1): s.events;
			if(/^MV/i.test(trackData.module) && /^MV/i.test(trackData.productId)){
				// TODO: Moving Home form fires unnecessarily here, so work out how to drop them without using 'throw'.
			}
			trackOrderForm(omnitureData.cartLineItems);
			trackData.pageName=s.cleanPageName(s.MVPagePrefix+':orderflow:'+trackData.module);
			s.zip = document.getElementById('newAddress.postcode') ? document.getElementById('newAddress.postcode').value : null;
			if(trackData.inputs) trackData.genericString = "MV-"+trackData.inputs;
		break;
		case "page": /* For s.track(eventType=page,{}) Page level events such as opening the plans on the home */
			trackData.channel = s.channel;
			s.pageName = s.cleanPageName(s.setCustomPageName(trackData));
			s.events   = trackData.events?s.apl(s.events,trackData.events,',',1): s.events;
		break;
		default :
		break;
	}
	return trackData;
}

/* !trackLiveHelp routines specifically for Livehelp LSP! */
s.trackLiveHelp=function(eventType, trackData) {
	if(trackData.linkType==='Filter')trackData.events=s.apl(trackData.events,'event74',',',1)
	if(trackData.events){
		s.linkTrackEvents = s.apl(s.linkTrackEvents,trackData.events,',',1)
		s.events = s.apl(s.events,trackData.events,',',1)
	}
	s.linkTrackVars   = s.apl(s.linkTrackVars,'prop33,prop34,prop47,eVar47',',',1);
	if(trackData.linkType==='View more')s.eVar47 = "+1";
	if(trackData.read)s.prop47=trackData.read;
	if(trackData.linkName==='LSP:Start chat') {
		try{	 s.prop61=s.eVar73=s.pageName=trackData.pageName='TD:TR:TR:livechat:'+window.clientParams.pageId.toLowerCase();}
		catch(e){s.prop61=s.eVar73=s.pageName=trackData.pageName='TD:TR:TR:'+'livechat:livehelp:TCOM:LSP:Start Page'.toLowerCase();}
	}
	s.prop33 = trackData.query ? trackData.query : null;
	s.prop34 = trackData.resultsCount ? trackData.resultsCount : null;
}
/* !trackPageChanged() Bind to the pageChanged events generated by the popup shops and webforms! */
s.trackPageChanged=function(s){
	if(typeof $(document).data('events').pageChanged == 'undefined' ) { /* Only bind once */
		$(document).bind('pageChanged.pager',function(e,nextMeta) {
			/* Reset the page name as it will be changed behind our backs by the pager. Then call s.t(); */
			var arrDeletions = ['s.prop54','s.eVar54','s.events','s.products','s.pageName','s.eVar6'];
			for(var i=0; i<arrDeletions.length;i++){/* if(debug)console.log('delete: ',i, arrDeletions[i] ); */ delete arrDeletions[i];}
			s.t();
			if(debug)console.log('Tracked: '+s.pageName);
		});
	};
};

/* Bind to the pageChanged events generated by the popup shops and webforms */
s.trackPopupShopPageChanged=function(s){
	$('.button.primary-cta.quasi-submit.next').bind("click",function(){
	if($(this).attr('id') == "button-next-startorder"){
		s.events='event27,event23,scCheckout';
		if(document.getElementById("deviceDetails") != null && document.getElementById("plan-planType") != null){
		s.products=";"+document.getElementById("deviceDetails").value+"-"+document.getElementById("plan-planType").value+";1;";
		}
	}
	s.pageName=s.setShopPageName("ipad-shop:order the new ipad" ,$(this).attr('id'));
	s.t();
	delete s.products;
	s.events='event27';
	});
};

/*Bind page change event for Biz Essential Pages*/
s.trackBizEssenForm=function(s){
	$("#next-siteDtl,#next-importantInfo,#prev-servDtl,#prev-choosePln,#prev-yourDtl,#prev-siteDtl,#prev-importantInfo").bind("click",function(){
		s.pageName=s.setBizPageName("bizessentials online order form" ,$(this).attr('id').substring(5,$(this).attr('id').length));
		s.t();
	});

	$("#next-servDtl").bind("click",function(){
		var bizPlan;
		if((document.getElementById("planRadio_basic") != null)&& (document.getElementById("planRadio_basic").checked)){
			bizPlan="Basic";
		}else if((document.getElementById("planRadio_standard") != null)&& (document.getElementById("planRadio_standard").checked)){
			bizPlan="Standard";
		}else{
			bizPlan="Max";
		}
		s.prop54=s.pageName+"-"+bizPlan;
		s.eVar54=s.prop54;
		s.pageName=s.setBizPageName("bizessentials online order form" ,$(this).attr('id').substring(5,$(this).attr('id').length));
		s.t();
		delete s.prop54;
		delete s.eVar54;
	});

	$("#next-yourDtl").bind("click",function(){
		var serviceDetails;
		if(document.getElementById("currentBroadband_new").checked){
			serviceDetails="Service Details:New";
		}else if(document.getElementById("currentBroadband_switching").checked){
			serviceDetails="Service Details:Switching";
		}else if(document.getElementById("currentBroadband_migrateTBB").checked){
			serviceDetails="Service Details:Migrate TBB";
		}else if(document.getElementById("currentBroadband_migrateBigPond").checked){
			serviceDetails="Service Details:Migrate Bigpond";
		}
		if(document.getElementById("whatFixedLine_none").checked){
			serviceDetails=serviceDetails+":None";
		}else if(document.getElementById("whatFixedLine_fixed").checked){
			serviceDetails=serviceDetails+":Fixed";
		}else if(document.getElementById("whatFixedLine_anotherProvider").checked){
			serviceDetails=serviceDetails+":Another Provider";
		}
		s.prop54="Biz Essential Form:"+serviceDetails;
		s.eVar54=s.prop54;
		s.pageName=s.setBizPageName("bizessentials online order form" ,$(this).attr('id').substring(5,$(this).attr('id').length));
		s.t();
		delete s.prop54;
		delete s.eVar54;
	});
};

s.setBizPageName=function(commonPageName,suffix){
	if(typeof(suffix)=='undefined') {
		throw new Error('Aborting execution of since page name incorrectly defined.');
	}
	var pageName = "TD:TBE:"+s.channel+":"+commonPageName+":"+suffix;
	pageName = pageName.replace(/(\r\n|\n|\r)/gm," "); /* Remove line breaks */
	pageName = pageName.replace(/\s+/g," "); /* Remove extra spaces */
	pageName = pageName.replace(/:\s/g,":"); /* Remove spaces after colons */
	if(debug) console.log('s.setShopPageName() returns: ', pageName);
	return pageName.trim();
};

s.setShopPageName=function(commonPageName,suffix){
	if(typeof suffix ==='undefined') {
		if(debug)console.log(commonPageName, suffix);
		//throw new Error('Aborting execution of since page name incorrectly defined.');
	}
	var pageName = "TD:TR:TR:"+s.channel+":"+commonPageName+":"+suffix;
	pageName = pageName.replace(/(\r\n|\n|\r)/gm," "); /* Remove line breaks */
	pageName = pageName.replace(/\s+/g," "); /* Remove extra spaces */
	pageName = pageName.replace(/:\s/g,":"); /* Remove spaces after colons */
	if(debug) console.log('s.setShopPageName() returns: ', pageName);
	return pageName.trim();
};

/* !Postpaid Shop - Start! */
s.postPaidShopPageNamePrefix = "telstra mobiles with plans";
s.setupPostpaidShopTracking=function(){
	if(debug)console.log('setupPostpaidShopTracking');
	/* Capture elements from the omnitureData{} object */
	if(typeof omnitureData.application == "object") {
		var app = omnitureData.application;
		s.prop28 = "OnlineShop:"+omnitureData.application.pageMode + omnitureData.application.shopCode;
	}
	/* Record the tabs at the top of the page [S,M,L,XL] */
	$('.tms-grid-item-header').bind('click', function() {
		s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,$(this).attr('pricepoint'));
		s.t();
		$('.tms-explore-byo.tms-container-accordion-plan, .tms-explore-handset.tms-container-accordion-plan').wrapInner('<div class="omniwrap" />');
		/* Record the primary navigation elements of BYO phone, or Plan */
		$('.omniwrap').bind('click', function() {
			var htmlStr = $(this).text();
			var indexTo=htmlStr.indexOf("Minimum cost");
			if(htmlStr.indexOf("Bring your own") >-1){
				s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,'BYO'+htmlStr.substring(0,indexTo));
			}else{
				s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,htmlStr.substring(0,indexTo));
			}
			s.t();
		});
	});
	/* Record the primary navigation elements of BYO phone, or Plan */
	$('.tms-grid-item-byo,.tms-grid-item-handset').live('click', function() {
		var htmlStr = $(this).text();
		var indexTo=htmlStr.indexOf("Minimum cost");
		if($(this).attr('class') == "tms-grid-item-byo"){
			s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,'BYO'+htmlStr.substring(0,indexTo));
		}else{
			s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,htmlStr.substring(0,indexTo));
		}
		s.t();
		/* Record clicks on center of page items */
		$('#tmsExploreAccordionBYO, #tmsExploreAccordionHandset').wrapInner("<div class='omniwrap' />");
		$('.omniwrap').bind('click', function() {
			var htmlStr = $(this).text();
			var indexTo=htmlStr.indexOf("Minimum cost");
			if(htmlStr.indexOf("Bring your own") >-1){
				s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,'BYO'+htmlStr.substring(0,indexTo));
			}else{
				s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,htmlStr.substring(0,indexTo));
			}
			s.t();
		});
	});
	/* Record the hero banner, or deeplinks handset panel */
	$('#tmsOverlay .tms-btn-action').live('click', function() {
		s.heroBannerIdentifier = $(this).attr('productcode')||trackData.action;
		if(debug)console.log('s.postPaidShopPageNamePrefix: ',s.postPaidShopPageNamePrefix);
		s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,s.heroBannerIdentifier+'hero banner');
		s.eVar54 = s.prop1+':'+s.prop2+':'+s.prop3+':'+s.channel+':'+s.heroBannerIdentifier;
		s.prop54 = s.channel+':'+s.prop4+':HeroBanner:'+s.heroBannerIdentifier;
		var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var d = new Date();
		s.eVar6 = "TR:TR:"+monthNames[(d.getMonth())]+ d.getFullYear()+":"+ s.heroBannerIdentifier+":"+ s.channel+":banner";
		s.t();
	});
	/* Record filters such as recontracting or AFL promotions */
	$('.tms-grid-filter-item input').live('click', function() {
		s.eVar54 = s.prop1+':'+s.prop2+':'+s.prop3+':'+s.channel+':'+$(this).attr('name');
	});
	$('.tms-grid-filter-item a').live('click', function() {
		s.eVar54 = s.prop1+':'+s.prop2+':'+s.prop3+':'+s.channel+':'+$(this).attr('productname');
	});
	/*Bind click event for Phone Image*/
	$('.tms-handset-buy-box-image.tms-inline-block').live('click', function() {
		var products = $(this).find('a').attr('id');
		var htmlStr = $(this).html();
		s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,$(this).next().find('.tms-text-handset-name').text());
		s.products=";"+products.substring(14,20)+";1;,;"+products.substring(21,products.length)+";1";
		if(debug)console.log('s.products', s.products);
		s.events=s.apl(s.events,'prodView',',',1);
		s.t();
	});
	$(".live-chat-link,.live-chat-etc-link").live("click", function() {
		s.linkTrackVars = "prop61,eVar73,products,eVar21,eVar26,eVar36,prop26,events";
		s.linkTrackEvents = "event1,event6,event16";
		s.eVar21 = 'lead:live-chat';
		s.eVar36 = 'lead:live-chat';
		s.events = 'event1,event6,event16';
		s.prop61 = s.eVar73 = s.pageName;
		s.tl();
	});
	/*Online Shop - Order Flow Screen*/
	if(/^(\/dealer\/|\/)mobileshop\/orderflow/i.test(window.location.pathname)||/^(\/dealer\/|\/)mobile-phones\/plans/i.test(window.location.pathname)){
		/* Record clicks on buttons during the order flow. Each is tracked as a page */
		$(document).ready(function(){
			var links = new Array(
						'btnHandsetOptions','btnByoOptions','btnPersonal','btnNumberChoice','btnPorting',
						'btnContact','btnResidence','btnDelivery','btnIdentity','btnEmployment','btnAddons','btnVasOptions',
						'btnPromotion','btnBilling','btnTandC','btnTandCAccept','btnTandCRefuse','btnCreditCard',
						'btnOrderCancelYes','btnOrderCancelNo','btnNext-acc-addons','btnNext-acc-personal','btnNext-acc-numberChoice',
						'btnNext-acc-contact','btnNext-acc-homeAddress','btnNext-acc-delivery','btnNext-acc-residence',
						'btnNext-acc-identity','btnNext-acc-employment','btnNext-acc-billing','btnNext-acc-handsetOptions',
						'btnNext-acc-byoOptions','btnNext-acc-personal','btnNext-acc-porting','btnPlaceOrder-acc-creditCard','btnNext-acc-whatYouNeed','btnNext-acc-dealerCode'
						);
			for (var i=0;i<links.length;i++){
				$('#'+links[i]).bind('click', function() {
				var	attrId = $(this).attr('id');
				s.events='event27,scView';
				// Set a Checkout event when the customer Confirms the Order
				if(links[i]=='btnTandC') s.events='event27,scCheckout';

				/* Capture how the customers wishes to port their number */
				if(attrId == 'numberassignmentnxtbtn'||attrId=='btnNumberChoice'){
					s.prop54=$('input:radio[name="numberChoice.numberChoice"]:checked').val();
					switch(s.prop54) {
						case 'TELSTRA':s.prop54=s.channel+':'+s.prop4+':Keep existing number';break;
						case 'PORTIN':s.prop54=s.channel+':'+s.prop4+':Port from other carrier';break;
						case 'NEW':s.prop54=s.channel+':'+s.prop4+':New number';break;
						default :s.prop54=s.channel+':'+s.prop4+':Unknown Value';
					}
					s.eVar54=s.prop54;
				/* Capture promotions */
				}   else if(attrId == 'btnNext-acc-addons'){
						s.products=s.getAndPersistValue(s.products,'s_persistCart',0);
						for(i=0;i<window.omnitureData.tms.model.cartLineItems.addons.length;i++){
							s.products=s.products+",;"+window.omnitureData.tms.model.cartLineItems.addons[i]+";1;";
						}
						s.persistCart=s.getAndPersistValue(s.products,'s_persistCart',0);
				} else if(attrId == 'btnVasOptions'){
					if($('.tms-vasoption input:checked').val() !== undefined && $('.tms-vasoption input').val() == 'SBS001-AFL-LSP12') {
						s.eVar6 = "TR:TR:Mar12:afllive:sbas:banner";
						s.prop54=s.channel+':'+s.prop4+':Promocode:SBS001-AFL-LSP12';
						if(debug)console.info('Capture AFL Promotion', s.eVar6);
					}
				} else if(attrId == 'btnPromotion'){
					var promoCode = $('.tms-promotion-info').attr('href');
					if(promoCode==='#SBS002-REC-1MONTHFREE') {
						s.eVar6 = "TR:TR:Mar12:mobrecontract:sbas:banner";
					s.prop54=s.channel+':'+s.prop4+':Promocode:'+promoCode;
						if(debug)console.info('Capture Recontracting Promotion', s.eVar6);
					}
				} else if(attrId == 'btnNext-acc-delivery'){
					s.zip = document.getElementById('delivery.deliveryAddress.postcode').value;
					if(debug)console.log('zip',s.zip);
				} else {delete s.prop54;} //unset, otherwise all subsequent pages record it too.
				/* Capture order cancellations */
				if(attrId == 'tmsOrderCancelYesBtn'||attrId=='btnOrderCancelYes')s.events='event27,scRemove';
				/* Use the old button name if we find it in the map */
				delete s.products;
				s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,'orderflow:'+attrId);
				s.t();
				});
			}
		});
	}
	/* Order Failed */
	if(/mobileshop\/orderfailed/i.test(window.location.pathname)) {
		s.prop28 = "OnlineShop Order Failed.";
		s.prop54 = s.postPaidShopPageNamePrefix+":orderflow:Order Failed:referrer:"+document.referrer;
		s.pageName=s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,'orderflow:Order Failed');
	}
	/* Online Shop Error Page */
	if(/mobileshop\/error/i.test(window.location.pathname)) {
		s.prop28 = "OnlineShop Misbehaving";
		s.prop54 = s.postPaidShopPageNamePrefix+":orderflow:error:referrer:"+document.referrer;
		s.pageName=s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,'orderflow:error');
	}
	/* Track deeplinks */
	if(omnitureData.application.isDeeplink){
		s.trackOnlineShopDeepLinks('postpaidshop');
	}
};

/* Online Shop - Order Flow Screen Initial Load. */
if(/^\/mobileshop\/orderflow|^\/mobile-phones\/plans\/buy/i.test(window.location.pathname)){
	$(document).ready(function(){
		s.events="event23,event27,scOpen,scAdd";
		s.eVar26 = s.getAndPersistValue(s.eVar26,'scOrigin',0);
		s.setFormsTracking('FormStart',"Start",s.eVar26,"ShopOnline");
		if(window.omnitureData.tms.model.cartLineItems.handset.code != ""){
			s.trackShopProductsForSKUCodeChange(window.omnitureData.tms.model.cartLineItems.handset.code);
		}else{
			s.trackShopProductsForSKUCodeChange("");
		}
		s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,'orderflow:checkout');
		if((typeof omnitureData.application =="object")&&(omnitureData.application.purchaseType != '')){s.eVar54 = s.prop54 ="Consumer:"+ omnitureData.application.purchaseType;}
		if(debug)console.log('OrderFlow Events: ',s.events,' Products: ',s.products);
		s.tl();
	});
	$(document).ready(function(){
		$("#handsetOptionsForm input:radio").bind("click",function(){
			s.trackShopProductsForSKUCodeChange(this.value);
		});
	});
}

s.trackShopProductsForSKUCodeChange=function(handsetCode){
		s.products="";
		var productString ="";
		if(handsetCode != ""){
			s.products=";"+handsetCode+";1;,";
			productString=handsetCode;
		}
		s.productPricePoint = $('.tms-cart-item-hdr').first().find('img').attr('src').replace(/(\/res\/images\/plan\/)|(-order-summary-hdr.png.*)/ig,'');
		s.products=s.products+";"+window.omnitureData.tms.model.cartLineItems.plan.code+";1;,;"+s.productPricePoint+";1;";
		if(productString != ""){
			s.products=s.products+",;"+productString+"-"+window.omnitureData.tms.model.cartLineItems.plan.code+"-"+s.productPricePoint+";1;";
		}else{
			s.products=s.products+",;"+window.omnitureData.tms.model.cartLineItems.plan.code+"-"+s.productPricePoint+";1;";
		}
		s.persistCart=s.getAndPersistValue(s.products,'s_persistCart',0);
}
/* Order Confirmation Call*/
if((isPostPaidShop) && (/mobileshop\/orderconfirmation/i.test(window.location.pathname))) {
	$(document).ready(function(){
		if(debug)console.info('Confirmation Page');
		s.events="event5,event24,event27,purchase";
		s.purchaseID=document.getElementById('tmsConfirmedOrderNumber').innerHTML.trim();
		s.pageName=s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,'orderflow:Order Confirmation');
		s.products=s.getAndPersistValue(s.products,'s_persistCart',0);
		s.confirmation = {};
		s.confirmation.events=s.events;
		s.confirmation.purchaseID=s.purchaseID;
		s.confirmation.pageName=s.pageName;
		s.confirmation.products=s.products;
		s.confirmation.productPricePoint=s.productPricePoint;
		if(debug && !(/*@cc_on!@*/0))console.dir(s.confirmation);
		s.tl();
	});
}

/* !Postpaid Shop - End*/
s.prePaidShopPageNamePrefix = "pre-paid mobiles";
s.setupPrepaidShopTracking=function(){
	/* Prepaid Orderflow */
	if(/^\/prepaid-mobile\/checkout/i.test(window.location.pathname)){
		if(!/\/submitOrder|ordersuccess/i.test(window.location.pathname)){
			/* Initial Page Load */
			s.events="event23,event27,scOpen,scAdd";
			var handset = omnitureData.tms.model.cartLineItems.product.code;	// Handset
			var offer   = omnitureData.tms.model.cartLineItems.offer.code;	// Prepaid Offer;
			s.products  = ";"+handset+";1;"+((offer)!==""?",;"+offer+";1;":"");
			s.getAndPersistValue(s.products,'s_persistCart',0);
			s.pageName=s.setShopPageName(s.prePaidShopPageNamePrefix ,'checkout');
			s.t();
			delete s.products;
			s.events="event27";
			/* Record clicks on buttons during the order flow. Each is tracked as a page */
			$(document).ready(function(){
				var links = new Array('tms-btn-nav');
				for (var i=0;i<links.length;i++){
					$('.'+links[i]).bind('click', function() {
					var	attrId = $(this).parents('div.tms-module').attr('id');
					var pageType = omnitureData.application.pageType;
					if(debug)console.log('checkout pageType:',pageType);
					s.pageName=s.setShopPageName(s.prePaidShopPageNamePrefix ,'orderflow:'+attrId);
					if(attrId === 'acc-homeAddress'){
						s.zip=document.getElementById('homeAddress.addressDetails.postcode').value
					}
					if(attrId && attrId==='acc-summary') {s.events="event27,scCheckout";}
					else { s.events="event27,scView"; }
					s.t();
					});
				}
			});
		} else if(/^\/prepaid-mobile\/checkout\/(submitOrder|ordersuccess)$/i.test(window.location.pathname)){
			if(debug)console.log('prepaid order submitted');
			var pageType = omnitureData.application.pageType,
				shopCode = omnitureData.application.shopCode,
				httpCode = omnitureData.application.httpCode;
			s.pageName=s.setShopPageName(s.prePaidShopPageNamePrefix ,'orderflow:'+pageType);
			if(pageType === 'orderfailed') {
				s.prop28 = s.prePaidShopPageNamePrefix+":"+pageType+":"+httpCode+":"+shopCode;
				s.prop54 = s.prop28+":"+document.referrer;
			} else if(pageType === 'orderconfirmed') {
				s.purchaseID = omnitureData.tms.orderId;
				s.events="event5,event24,event27,purchase";
				s.products=s.getAndPersistValue(s.products,'s_persistCart',0);
			}
			if(debug)console.log('submitorder pageType:',pageType);
			s.t();
		}
	}
	if(omnitureData.application.isDeeplink){
		s.trackOnlineShopDeepLinks('prepaidshop');
	}
	/*Bind click event for Phone Image*/
	$('.handset-details-link').bind('click', function() {
		var products = $(this).attr('href');
		products=products.replace(/_details/i,"");
		s.pageName=s.setShopPageName(s.prePaidShopPageNamePrefix ,products);
		s.products=";"+products+";1";
		if(debug)console.log('s.products', s.products);
		s.events=s.apl(s.events,'prodView',',',1);
		s.t();
	});
}
/* Online Shop - Deeplinked Handset*/
s.trackOnlineShopDeepLinks=function(shopName) {
	if(shopName == 'postpaidshop' ) {
		var pageNameSuffix=window.location.pathname.split('/').pop()==s.prop4?s.prop4:s.prop4+':'+window.location.pathname.split('/').pop();
		s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,pageNameSuffix);
		s.events=s.apl(s.events,'prodView',',',1);
		var handset = omnitureData.application.deeplink.split('-')[0],
			plan = omnitureData.application.deeplink.replace(omnitureData.application.deeplink.split('-')[0]+'-','')
		s.products=";"+handset+";1;,;"+plan+";1";
		s.t();
		delete s.products;
	}else if(shopName == 'prepaidshop' ) {
		var pageNameSuffix=window.location.pathname.split('/').pop()==s.prop4?s.prop4:s.prop4+':'+window.location.pathname.split('/').pop();
		s.pageName=s.setShopPageName(s.postPaidShopPageNamePrefix ,pageNameSuffix);
		s.events=s.apl(s.events,'prodView',',',1);
		var handset = omnitureData.application.deeplink.split('-')[0],
			plan = omnitureData.application.deeplink.replace(omnitureData.application.deeplink.split('-')[0]+'-','')
		s.products=";"+omnitureData.application.deeplink+";1";
		s.t();
		delete s.products;
		};
	return pageNameSuffix;
};

s.trackTacticalShopProducts=function(){
	var productList=omnitureData.products;
	if(productList != null){
		var productItem="";
		s.products="";
		for (i in productList){
			if(i != "empty"){
				if(productList[i].name) productsItem = productList[i].name;
				if(productList[i].colour) productsItem =productsItem+"-"+productList[i].colour;
				if(productList[i].size) productsItem =productsItem+"-"+productList[i].size;
				if(productsItem !=""){
					if(s.products !=""){s.products=s.products+",";}
					s.products = s.products+";"+productsItem+";"+productList[i].unit+";";
					s.products = s.products.replace(/^(;data-pack-\d{1,3})-\d/,"$1"); /* Bugfix: Try to tidy up data packs */
				}
				if(productList[i].plancode) {
					if(productList[i].term){
						s.products = s.products + ",;"+productList[i].plancode+"-"+productList[i].term+";"+productList[i].unit+";";
						productsItem=productsItem+"-"+productList[i].plancode+"-"+productList[i].term;
						s.products = s.products + ",;"+productsItem+";"+productList[i].unit+";";
					}
				}
				if(productList[i].addons) {
					for(var j=0;j<productList[i].addons.length;j++){
						if((productList[i].addons[j]) && (productList[i].addons[j] != "")){
							s.products = s.products + ",;"+productList[i].addons[j]+";"+productList[i].unit+";";
						}
					}
				}
				if(productList[i].simtype) {
						s.products = s.products + ",;"+productList[i].simtype+";"+productList[i].unit+";";
				}
			}
		}
	}
}
/* !New TSO Prepaid Shop AKA Tactical Shop, AKA OSCaR shop! */
/* TODO: Track tabs at the top */
s.trackTacticalShop=function(){
	s.prop4 = omnitureData.category.toLowerCase();
	s.channel = omnitureData.category.toLowerCase();
	omnitureData.pageName = s.prop1+":"+s.prop2+":"+s.prop3+":"+omnitureData.category.toLowerCase();
	/* Product Listing */
	var productSelectionPages = /prepaid-mobile.cfm|home-phones.cfm|home-broadband.cfm|tablets.cfm|mobile-broadband.cfm/i;
	if(productSelectionPages.test(window.location.pathname)){
		s.pageName = omnitureData.pageName = omnitureData.pageName + ":product selection";
		s.setFormsTracking('FormStart','Start',s.channel,omnitureData.category);
	}
	/* Cart Start Pages */
	var cartStartPages = /prepaid-mobile-product.cfm|homephone-plan-product.cfm|mobile-broadband-product.cfm/i; // Broadband plans still go to Bigpond.com, so can't track.
	if(cartStartPages.test(window.location.pathname)){
		s.pageName = omnitureData.pageName = omnitureData.pageName + ":cart start";
		s.events=s.apl(s.events,'scOpen,scAdd,scView',',',1);
		s.trackTacticalShopProducts();
	}
	/* Checkout Pages */
	if(/online-shop\/order\.cfm/i.test(window.location.pathname)){
		// Initial page of checkout.
		if(typeof omnitureData.section == 'undefined') {
			s.events=s.apl(s.events,'scCheckout',',',1);
			s.trackTacticalShopProducts();
			s.pageName = omnitureData.pageName+":general details";
		} else {
			s.pageName = omnitureData.pageName+":"+omnitureData.section.toLowerCase();
		}
	}
	/* Order Verification Pages */
	if(/online-shop\/payment\.cfm/i.test(window.location.pathname)){
		if(debug){
			console.group('order.cfm');
			console.log(omnitureData.pageName);
			console.log(omnitureData.section);
			console.groupEnd();
		}
		if(typeof omnitureData.section == 'undefined'){
			s.pageName = omnitureData.pageName = omnitureData.pageName + ":order verification";
		} else {
			s.pageName = omnitureData.pageName+":"+omnitureData.section.toLowerCase();
		}
	};
	/* Order Complete Page */
	if(/online-shop\/order-complete\.cfm/i.test(window.location.pathname)){
		s.pageName = omnitureData.pageName+":order complete";
		s.events="event5,event24,event27,purchase";
		s.setFormsTracking('FormFinish','Finish',s.channel,omnitureData.category);
		s.events=s.apl(s.events,'purchase',',',1);
		s.trackTacticalShopProducts();
		s.purchaseID = omnitureData.purchaseId;
	}
};

/* New TB Shop */
s.trackBusinessCount=0;
s.trackBusinessShop=function(){
	if(debug)console.log('s.trackBusinessShop():',s.trackBusinessCount);
	if(omnitureData.category != null){
		s.prop4 = omnitureData.category.toLowerCase();
		omnitureData.pageName = s.prop1+":"+s.prop3+":"+s.channel+":"+omnitureData.category.toLowerCase();
	}
	/* Product Listing */
	if((/business-phone-product\.cfm/i.test(window.location.pathname)) || (/business-phone-plan\.cfm/i.test(window.location.pathname)) && (s.trackBusinessCount==0)){
			if(debug)console.log('Product Listing');
			if(omnitureData.product){s.products =";"+omnitureData.product+";1;";}
			s.events=s.apl(s.events,'prodView',',',1);
			if(omnitureData.plancode){
				if(s.products){s.products = s.products+",";}
				else{s.products = "";}
				s.products = s.products+";"+omnitureData.plancode+";1;";
			}
			s.trackBusinessCount=1;
	}
	if(/business-phone-plan\.cfm/i.test(window.location.pathname)){
		s.pageName=s.pageName+":"+s.getQueryParam('plantype');
	}
	/* Checkout Pages */
	if(/online-shop\/business\/order\.cfm/i.test(window.location.pathname)){
		if(debug)console.log('Checkout Pages');
		if(typeof omnitureData.section == 'undefined') {
			console.log('first page of checkout');
			//console.log(omnitureData);
			s.events=s.apl(s.events,'scCheckout',',',1);
			s.trackTacticalShopProducts();
			s.pageName=omnitureData.pageName + ":checkout";
		} else{
			s.events="event27";
		}
	}
	/* Order Complete Page */
	if(/online-shop\/business\/order-complete\.cfm/i.test(window.location.pathname)){
		if(debug)console.log('Order Complete Page');
		s.pageName = omnitureData.pageName+":order complete";
		s.events="event5,event24,event27,purchase";
		s.setFormsTracking('FormFinish','Finish',s.channel,omnitureData.category);
		s.events=s.apl(s.events,'purchase',',',1);
		s.trackTacticalShopProducts();
		s.purchaseID = omnitureData.purchaseId;
	}
	/* Email Quote Page */
	if(/online-shop\/business\/business-quote-email-quote\.cfm/i.test(window.location.pathname)){
		if(debug)console.log('Email Quote Page');
		s.events="event27,event6";
		try{
			s.trackTacticalShopProducts();
		}catch(e){
			if(debug)console.log(e);
		}
	}
	/* Run Business Bundle shop specific code */
	if(isBusinessBundleShop) s.trackBusinessBundleShop();	/* Business Bundle Shop Tracking*/
};

/* !Business Bundle shop specific code! */
s.trackBusinessBundleShop=function(){
	/* Capture a base page name to prevent ongoing appending of actions */
	if (s.trackBusinessCount==0) {
		s.pageName = s.pageName.replace(/business shop \- /gi,'');
		s.pageName = s.pageName.replace(/\$\d+|\([smlx]\)\s*/gi,''); // Remove $ and (s) from pageName
		s_basePageName = s.pageName;
	}
	/* Generic Product Check*/
	if (!s.products) {
		if(debug)console.log('Generic Product Check');
		if (omnitureData.productIDs) {s.createProductsVar(omnitureData.productIDs);}
		else if (s.getQueryParam('plantype')) {s.products = ";"+s.getQueryParam('plantype');}
	}
	$(document).ready(function(){
		/*Bind click event for select product button */
		$('a.plan-select').bind('click', function() {
			s.pageName=s_basePageName + ":select plan";
			s.events=s.events.replace(/event23[,]?/i,"");
			s.t();
		});
	});
	/* Capture form start once a plan has been selected */
	if(/business-digital-business\.cfm/i.test(document.location.pathname)){
		if(debug)console.log('FormStart','Start','BusinessShop','DigitalBundleBuilder');
		s.setFormsTracking('FormStart','Start','BusinessShop','DigitalBundleBuilder');
	}
	/* Capture form step once a plan has been selected */
	if(/business-digital-business-plan\.cfm/i.test(document.location.pathname)){
		if(debug)console.log('FormStep','Step:core plan details','BusinessShop','DigitalBundleBuilder');
		s.setFormsTracking('FormStep','Step:core plan details','BusinessShop','DigitalBundleBuilder');
	}
	/* Capture addition of a new service */
	if(/business-digital-business-product\.cfm/i.test(document.location.pathname)){
		if(debug)console.log('FormStep','Step:add additional services','BusinessShop','DigitalBundleBuilder');
		if (s.trackBusinessCount==0) {
			s.setFormsTracking('FormStep','Step:add additional services','BusinessShop','DigitalBundleBuilder');
			s_prevAddCodeName = "";
			s_prevAddExtraCodeName = "";
		}
		// Capture extra Mobile/Office/Broadband plans
		$('div.bd-plan-select-block-B').live('click', function() {
			var addCodeName = $(this).attr('codename');
			// Restrict mulitple calls
			if (addCodeName != s_prevAddCodeName) {
				// Append the product being added
				if (addCodeName) {
					s.pageName = s_basePageName + ":add plan";
					s.events=s.events.replace(/event28[,]?/i,"");
					s.t();
				}
			}
			s_prevAddCodeName = addCodeName;
			if(debug)console.log('Capture extra Mobile/Office/Broadband plans');
		});
		// Capture extra Fax/Alarm/Broadband backup/EFTPOS plans
		$('a.bd-addextra-button').live('click', function() {
			var addExtraCodeName = $(this).attr('codename');
			// Restrict mulitple calls
			if (addExtraCodeName != s_prevAddExtraCodeName) {
				// Append the product being added
				if (addExtraCodeName) {
					s.pageName = s_basePageName + ":add service";
					s.events=s.events.replace(/event28[,]?/i,"");
					s.t();
				}
			}
			s_prevAddExtraCodeName = addExtraCodeName;
			if(debug)console.log('Capture extra Fax/Alarm/Broadband backup/EFTPOS plans',s.pageName,s.events,s_prevAddExtraCodeName);
		});
	}
	if(/business-digital-business-quote\.cfm/i.test(document.location.pathname)){
		// Replace the product selection component of the page name
		s.pageName=s.pageName.replace(/ \- products selection$/gi," ");
		s.pageName=s.pageName+":quote presented";
		if (s.trackBusinessCount==0) {
		s.setFormsTracking('FormFinish','Finish','BusinessShop','DigitalBundleBuilder');
		}
	}
	if(/business-digital-business-order\.cfm/i.test(document.location.pathname)){
		if (s.trackBusinessCount==0) {
			// Add in Cart events
			s.events=s.apl(s.events,'scOpen',',',1);
			s.events=s.apl(s.events,'scAdd',',',1);
		}
		if(/terms & conditions$/i.test(s.pageName)){
			s.events=s.apl(s.events,'scCheckout',',',1);
		}
	}
	if(/business-digital-business-thanks\.cfm/i.test(document.location.pathname)){
		// Add in Purchase events
		s.events=s.apl(s.events,'purchase',',',1);
		s.purchaseID = Math.floor(Math.random() * 100000000 + 1);
	}
	s.trackBusinessCount=1;
};

s.createProductsVar = function(productIdArray){
	/* The productIdArray array gets converted into the s.products variable */
	for(i=0; i<productIdArray.length; i++) {
		if(typeof s.products=='undefined') {s.products="";} /* If s.products doesn't exist yet, create it */
		/* Format: category;product;quantity;totalPrice */
		if(productIdArray[i] != ""){
			if(i) {s.products+=",";}	/* For subsequent products, add a comma to separate the list */
			s.products+=";" + productIdArray[i];	/* Ignore the category, but add the product ID */
			s.products+=";1;";	/* Leave the total price blank */
		}
	}
}
/*Add onclick event to Help& Support FAQ and Howto*/
if(isHelpSupport){
	window.onload = function(){
		$('.faq,.howto').bind('click',function(){s.track('link',trackData={trackCode:$(this).text(),linkName:$(this).text(),eVar54:$(this).text()});});
	};
}
if(isMedallia) {
	/* Medialla NPS has a couple of issues:
	 * Mix of TD omniture (twice on initial page, once on the success page.
	 * Implements GA on the first page
	 * Doubles up with their own omniture implementation on the second page
	 So the following code tries to hack around it.
	*/
	s.nps = new Object;
	if(typeof npsCounter === 'undefined'){npsCounter = 1}else {npsCounter++}
	// Only the question page has a form, the thank-you page does not.
	s.nps.step = document.getElementById('surveyform') ? "start" : "finish";
	if(s.nps.step==="start"){
		if(debug)console.log("step", s.nps.step, "counter", npsCounter);
		if(npsCounter === 1){
			$(document).ready(function(){
				var oForm = document.getElementById('surveyform');
				var oFormSubmit = oForm.getAttribute('onsubmit')
				oForm.setAttribute("onsubmit",'s.NPSResponse();'+oFormSubmit);
			});
		}else if(typeof s.prop60 === 'undefined'){
			throw new Error('Abort Execution of SCode ['+npsCounter+']');
		}
		s.NPSResponse = function(){
			s.nps.resolution = $('input:radio[name="onf_q_telstra_on_issue_resolved_yntett_alt"]:checked').val();
			s.nps.rating = $('input:radio[name="onf_q_telstra_ltr_alt"]:checked').val()-1;
			s.nps.verbatim = $('textarea[name="spl_q_telstra_score_reason_comment"]').val();
			s.prop60=s.nps.resolution+'|'+s.nps.rating+'|'+s.nps.verbatim.substr(0,95);
			if(PERF){s.prop54=s.eVar54=PERF.getMeasures().sid;}
			s.setFormsTracking('FormStart','Start','NPS','NPS:Start');
			s.t();
		}
	}else if(s.nps.step==="finish"){
		s.prop37 = s.eVar37 = "NPS"
		scAddEvent('formsuccess');
		s.setFormsTracking('FormFinish','Finish','NPS','NPS:Finish');
		s.pageName="TD:TR:TR:survey:"; //Hack. Medalia also have put omniture on success page.
	}
	s.nps.source = ((gqp('PN')!=='')?gqp('PN'):gqp('SN')).replace('TD:TR:TR:','');
	s.prop4 = s.eVar5 = s.getAndPersistValue(s.nps.source,'s_subsection',0);
	s.pageName = (s.pageName+":"+s.nps.step+":"+s.prop4).replace("::",":");
}


s.trackGlobalNav = function(){
	$(document).ready(function(){
		$('div#primary-nav a').live('click',function(){
			var topmenu=($(this).parents('li.catlink').children('a').text()),
				submenu=$(this).text(),
				label="tcom-nav:";
			label+=(topmenu!==submenu ? topmenu+":"+submenu : topmenu).toLowerCase()
			s.track('link',{linkName:label,genericString:label});
		})
	});
};
/*Clickmap enhancement - Start*/
s.clickTrackingPages = {
	'corp-hp' : 'TD:TR:TR::telstra corporate',
	'map-loy' : 'TD:TR:TR:latest_offers:movies',
	'pers-hp' : 'TD:TR:TR:personal:telstra personal',
	'mob-hp'  : 'TD:TR:TR:mobile:mobile phones from telstra',
	'tv-hp'   : 'TD:TR:TR:tv:tv',
	'prepaidhp':'TD:TR:TR:mobile:pre-paid mobile phones',
	'tophat'  : 'TD:TR:TR:misc:adsl2',
	'thub2'   : 'TD:TR:TR:home-phone:t-hub 2',
	'telstraplus'  : 'TD:TR:TR:telstra-plus:telstra plus',
	'Acc-serv': 'TD:TR:TR:account-services:account services',
	'4gfun'   : 'TD:TR:TR:latest_offers:the fun has just begun - 4g',
	'bill-expl':'TD:TR:TR:help:how to read your bill',
	'NBN Homepage': 'TD:TBE:business-enterprise:telstra - national broadband network - nbn',
	'Pay Online': 'TD:TR:TR:latest-offers:pay online'
};

s.getPageMatch = new Function(""
+"var pageMatch = '';for(var i in s.clickTrackingPages){"
+"var pagename=new RegExp(s.clickTrackingPages[i]);if(pagename.test(s.pageName)){"
+"pageMatch=i;}}return pageMatch;");

s.getButtonText=function(obj,count){
	var attributes = new Array("value","id","name");
	for(var i=0;i<attributes.length;i++){
		if((obj.getAttribute(attributes[i]) !=null) && (obj.getAttribute(attributes[i]) !="")){
			return obj.getAttribute(attributes[i]);
		} else {
			return count;
		}
	}
};

s.getAccordionText=function(obj){
	if(obj != null){
		if(obj.textContent != undefined) returnText = obj.textContent;
		else returnText = "";
	}
	return returnText;
};

s.setupButtonAndLinkTracking=new Function(""
+"var s=this;if(!s.doLinkTrack){s.doLinkTrack=1;if(s.apv>3&&(!s.isie||!s.ismac||s.apv"
+">=5)){if(s.wd.attachEvent)s.wd.attachEvent('onload',s.buttonAndLinkTracking);else"
+" if(s.wd.addEventListener)s.wd.addEventListener('load',s.buttonAndLinkTracking,fa"
+"lse);else{s.doiol=s.wd.onload;s.wd.onload=s.buttonAndLinkTracking}}s.wd.s_semapho"
+"re=1}");

s.buttonAndLinkTracking=function(){
	var pageMatch=s.getPageMatch();
	//if(debug && pageMatch !='')console.log('s.buttonAndLinkTracking():pageMatch:',pageMatch);
	var x, l, u,a = new Array;
	if(pageMatch){
		var buttonType = new Array('image','radio','button','checkbox','submit');
		var buttonCount = document.getElementsByTagName('input').length;
		if(buttonCount > 0){
			for(var i=0;i<buttonCount;i++){
			var buttonObj = document.getElementsByTagName("input")[i];
				if((buttonType.toString().indexOf(buttonObj.getAttribute("type"))) > -1)
				{
				var x ="s.tlWrapper(this,\"o\",\""+pageMatch+"_Button_"+s.getButtonText(buttonObj,i)+"\");";
					if(buttonObj.getAttribute("onclick") != null){
						buttonObj.setAttribute("onclick",x+buttonObj.getAttribute("onclick"));
					}else{
						buttonObj.setAttribute("onclick",x);
					}
				}
			}
		}
		var accordionCount = document.getElementsByTagName("h3").length;
		if(accordionCount > 0){
			for(var i=0;i<accordionCount;i++){
				var accordionObj = document.getElementsByTagName("h3")[i];
				if(accordionObj != null)
				{
					var x ="s.tlWrapper(this,\"o\",\""+pageMatch+"_Accordion_"+s.getAccordionText(accordionObj)+"\");";
					if(accordionObj.getAttribute("onclick") != null){
						accordionObj.setAttribute("onclick",x+accordionObj.getAttribute("onclick"));
					}else{
						accordionObj.setAttribute("onclick",x);
					}
				}
			}
		}
		if(isTBTEG){
			var headingCount = document.getElementsByTagName("h2").length;
			if(headingCount > 0){
				for(var i=0;i<headingCount;i++){
					var headingObj = document.getElementsByTagName("h2")[i];
					if(headingObj != null)
					{
						var x ="s.tlWrapper(this,\"o\",\""+pageMatch+"_Heading_"+s.getAccordionText(headingObj)+"\");";
						if(headingObj.getAttribute("onclick") != null){
							headingObj.setAttribute("onclick",x+headingObj.getAttribute("onclick"));
						}else{
							headingObj.setAttribute("onclick",x);
						}
					}
				}
			}
		}
		if (s.d.links) {
			for (i = 0; i < s.d.links.length; i++) {
			l = s.d.links[i];
			u = l.href;
				if (u) {
					u = s.repl(u, "\"", "");
					u = s.repl(u, "\n", "").substring(0, 97);
					a[u] = a[u] ? a[u] + 1 : 1;
					x = "";
					x += "s.tlWrapper(this,\"o\",\"" + pageMatch + "_" + s.getLinkText(l) + "_" + a[u] + "_" + u + "\");";
					if(l.getAttribute("onclick") != null){
						l.setAttribute("onclick", x+l.getAttribute("onclick"));
					}else{
						l.setAttribute("onclick", x);
					}
				}
			}
		}
	}
};
s.setOIDs=new Function("e",""
+"var s=s_c_il["+s._in+"],b=s.eh(s.wd,'onload'),o='onclick',x,l,u,c,i"
+",a=new Array;if(s.doiol){if(b)s[b]=s.wd[b];s.doiol(e)}if(s.d.links)"
+"{for(i=0;i<s.d.links.length;i++){l=s.d.links[i];c=l[o]?''+l[o]:'';b"
+"=s.eh(l,o);z=l[b]?''+l[b]:'';u=s.getObjectID(l);if(u&&c.indexOf('s_"
+"objectID')<0&&z.indexOf('s_objectID')<0){u=s.repl(u,'\"','');u=s.re"
+"pl(u,'\\n','').substring(0,97);l.s_oc=l[o];a[u]=a[u]?a[u]+1:1;x='';"
+"if(c.indexOf('.t(')>=0||c.indexOf('.tl(')>=0||c.indexOf('s_gs(')>=0"
+")x='var x=\".tl(\";';x+='s_objectID=\"'+u+'_'+a[u]+'\";return this."
+"s_oc?this.s_oc(e):true';if(s.isns&&s.apv>=5)l.setAttribute(o,x);l[o"
+"]=new Function('e',x)}}}s.wd.s_semaphore=0;return true");

/*Wrapper function for custom link tracking*/
s.tlWrapper = function(obj,linkType,link){
	s.linkTrackVars = "prop61,eVar73,events,products";
	s.prop61 = s.eVar73 = s.pageName;
	s.eVar54=link;
	if(debug)console.log('s.tlWrapper(',obj,')');
	s.tl(obj,linkType,link);
};
/* This populates a custom prop with the pagename for all tracklink functions */
s.prop61 = s.eVar73 = s.pageName;

/*Function to get the link text for custom link tracking*/
s.getLinkText = function(obj){
var returnText = "";
	if(obj != null){
		if (obj.innerText) {
			returnText=obj.innerText.replace(/\r\n+/g," ").replace(/\s+/g," ").substring(0,20);
		}
		else{
			if (obj.text)
			{ returnText=obj.text.replace(/\n\s+/g," ").substring(0,20); }
		}
	}
	return returnText;
};
/* Function to return the contents of a <meta pagename> tag if present */
s.getMetaPageName=function() {
	var metaItems, pagename;
	if (document.getElementsByName) {
		metaItems = document.getElementsByTagName('meta');
		if((getInternetExplorerVersion() == 9) & (document.title == "")){
			pagename = document.getElementsByTagName("title")[0].innerHTML;
		}else{
			pagename = document.title.toString();
		}
		try { for (var j=0; j < metaItems.length; j++) {
			if (document.title.length==0){
				// If page is missing <TITLE> tag, look for meta tag.
				if(metaItems[j].name.match(/^title/i)&&metaItems[j].content.length>0){pagename = metaItems[j].content;}
				if(debug)console.log(pagename);
		}
			// if we find a metatag called pagename, use that instead.
			if(metaItems[j].name.match(/^pagename$/i)&&metaItems[j].content.length>0){pagename = metaItems[j].content;}
		}}
		catch(err) { pagename = document.title.toString(); }
	}
	return pagename.toString();
};

function getInternetExplorerVersion(){
	// Returns the version of Internet Explorer or a -1
	// (indicating the use of another browser).
	var rv = -1; // Return value assumes failure.
	if (navigator.appName == 'Microsoft Internet Explorer') {
	var ua = navigator.userAgent;
	var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	if (re.exec(ua) != null) rv = parseFloat( RegExp.$1 );
	}
	return rv;
}
/* GSA still references console.oldLog, so leave a stub */
if(console)console.oldLog=function(val){return console.log(val)};

/* DynamicObjectIDs config */
function s_getObjectID(o) {
	var m=!(!(s._dynamicObjectIDs_URLMatch))?s.split(s._dynamicObjectIDs_URLMatch,','):'',n=!(!(s._dynamicObjectIDs_Include)),v=s.split(s._dynamicObjectIDs_RemoveQSP,','),w,j,k=true,ID=o.href;
	if(m.length>0)
		for(j=0;j<m.length&&k;j++){
			k=((!n&&ID.indexOf(m[j])<0)||(n&&ID.indexOf(m[j])>-1));
			if(!k)ID='';
		}
	for(w=0;w<v.length;w++){
		ID=ID.replace(new RegExp('&'+v[w]+'=[^&]*','i'),'');ID=ID.replace(new RegExp('\\?'+v[w]+'=[^&]*&','i'),'?');
	}
	return ID;
}

s.getObjectID=s_getObjectID;

/* Optional config variables */
s._dynamicObjectIDs_URLMatch = '';
s._dynamicObjectIDs_Include = false;
s._dynamicObjectIDs_RemoveQSP = '';

/* To setup Dynamic Object IDs */
/* Commenting it out as it has an impact on prepaid pages. This is a plugin from Adobe.*/
/* s.setupDynamicObjectIDs(); */
/* Link Tracking */
if(/prepaidrecharge/.test(location.pathname)==false)s.setupButtonAndLinkTracking();

/* !Setup Postpaid Shop Tracking! */
if(isPostPaidShop){ s.onload(s.setupPostpaidShopTracking); }
/* !Setup Prepaid Shop Tracking! */
if(isPrePaidShop){ s.onload(s.setupPrepaidShopTracking); }
/* WARNING: Changing any of the below variables will cause drastic changes to how your visitor data is collected.
Changes should only be made when instructed to do so by your account manager.*/
s.visitorNamespace="telstracorporation";
s.trackingServer="info.telstra.com";
s.trackingServerSecure="infos.telstra.com";
s.visitorMigrationKey="53991E04" //The key generated contains a timeframe to continue migration
s.visitorMigrationServer="info.telstra.com" // tracking server to migrate from
s.visitorMigrationServerSecure="infos.telstra.com" // SSL tracking server to migrate from if different than the NON-SSL server
s.dc=122;

/* SiteCatalyst code version: H.25.4.
/************* DO NOT ALTER ANYTHING BELOW THIS LINE ! **************/
var s_code='',s_objectID;function s_gi(un,pg,ss){var c="s.version='H.25.4';s.an=s_an;s.logDebug=function(m){var s=this,tcf=new Function('var e;try{console.log(\"'+s.rep(s.rep(s.rep(m,\"\\\\\",\"\\\\"
+"\\\\\"),\"\\n\",\"\\\\n\"),\"\\\"\",\"\\\\\\\"\")+'\");}catch(e){}');tcf()};s.cls=function(x,c){var i,y='';if(!c)c=this.an;for(i=0;i<x.length;i++){n=x.substring(i,i+1);if(c.indexOf(n)>=0)y+=n}retur"
+"n y};s.fl=function(x,l){return x?(''+x).substring(0,l):x};s.co=function(o){return o};s.num=function(x){x=''+x;for(var p=0;p<x.length;p++)if(('0123456789').indexOf(x.substring(p,p+1))<0)return 0;ret"
+"urn 1};s.rep=s_rep;s.sp=s_sp;s.jn=s_jn;s.ape=function(x){var s=this,h='0123456789ABCDEF',f=\"+~!*()'\",i,c=s.charSet,n,l,e,y='';c=c?c.toUpperCase():'';if(x){x=''+x;if(s.em==3){x=encodeURIComponent("
+"x);for(i=0;i<f.length;i++) {n=f.substring(i,i+1);if(x.indexOf(n)>=0)x=s.rep(x,n,\"%\"+n.charCodeAt(0).toString(16).toUpperCase())}}else if(c=='AUTO'&&('').charCodeAt){for(i=0;i<x.length;i++){c=x.su"
+"bstring(i,i+1);n=x.charCodeAt(i);if(n>127){l=0;e='';while(n||l<4){e=h.substring(n%16,n%16+1)+e;n=(n-n%16)/16;l++}y+='%u'+e}else if(c=='+')y+='%2B';else y+=escape(c)}x=y}else x=s.rep(escape(''+x),'+"
+"','%2B');if(c&&c!='AUTO'&&s.em==1&&x.indexOf('%u')<0&&x.indexOf('%U')<0){i=x.indexOf('%');while(i>=0){i++;if(h.substring(8).indexOf(x.substring(i,i+1).toUpperCase())>=0)return x.substring(0,i)+'u00"
+"'+x.substring(i);i=x.indexOf('%',i)}}}return x};s.epa=function(x){var s=this,y,tcf;if(x){x=s.rep(''+x,'+',' ');if(s.em==3){tcf=new Function('x','var y,e;try{y=decodeURIComponent(x)}catch(e){y=unesc"
+"ape(x)}return y');return tcf(x)}else return unescape(x)}return y};s.pt=function(x,d,f,a){var s=this,t=x,z=0,y,r;while(t){y=t.indexOf(d);y=y<0?t.length:y;t=t.substring(0,y);r=s[f](t,a);if(r)return r"
+";z+=y+d.length;t=x.substring(z,x.length);t=z<x.length?t:''}return ''};s.isf=function(t,a){var c=a.indexOf(':');if(c>=0)a=a.substring(0,c);c=a.indexOf('=');if(c>=0)a=a.substring(0,c);if(t.substring("
+"0,2)=='s_')t=t.substring(2);return (t!=''&&t==a)};s.fsf=function(t,a){var s=this;if(s.pt(a,',','isf',t))s.fsg+=(s.fsg!=''?',':'')+t;return 0};s.fs=function(x,f){var s=this;s.fsg='';s.pt(x,',','fsf'"
+",f);return s.fsg};s.mpc=function(m,a){var s=this,c,l,n,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(v&&v=='prerender'){if(!s.mpq){s.mpq=new Array;l=s.sp('webkitvisibilitychange,visi"
+"bilitychange',',');for(n=0;n<l.length;n++){s.d.addEventListener(l[n],new Function('var s=s_c_il['+s._in+'],c,v;v=s.d.visibilityState;if(!v)v=s.d.webkitVisibilityState;if(s.mpq&&v==\"visible\"){whil"
+"e(s.mpq.length>0){c=s.mpq.shift();s[c.m].apply(s,c.a)}s.mpq=0}'),false)}}c=new Object;c.m=m;c.a=a;s.mpq.push(c);return 1}return 0};s.si=function(){var s=this,i,k,v,c=s_gi+'var s=s_gi(\"'+s.oun+'\")"
+";s.sa(\"'+s.un+'\");';for(i=0;i<s.va_g.length;i++){k=s.va_g[i];v=s[k];if(v!=undefined){if(typeof(v)!='number')c+='s.'+k+'=\"'+s_fe(v)+'\";';else c+='s.'+k+'='+v+';'}}c+=\"s.lnk=s.eo=s.linkName=s.li"
+"nkType=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';\";return c};s.c_d='';s.c_gdf=function(t,a){var s=this;if(!s.num(t))return 1;return 0};s.c_gd=function(){var s=this,d=s.wd.location.hostnam"
+"e,n=s.fpCookieDomainPeriods,p;if(!n)n=s.cookieDomainPeriods;if(d&&!s.c_d){n=n?parseInt(n):2;n=n>2?n:2;p=d.lastIndexOf('.');if(p>=0){while(p>=0&&n>1){p=d.lastIndexOf('.',p-1);n--}s.c_d=p>0&&s.pt(d,'"
+".','c_gdf',0)?d.substring(p):d}}return s.c_d};s.c_r=function(k){var s=this;k=s.ape(k);var c=' '+s.d.cookie,i=c.indexOf(' '+k+'='),e=i<0?i:c.indexOf(';',i),v=i<0?'':s.epa(c.substring(i+2+k.length,e<"
+"0?c.length:e));return v!='[[B]]'?v:''};s.c_w=function(k,v,e){var s=this,d=s.c_gd(),l=s.cookieLifetime,t;v=''+v;l=l?(''+l).toUpperCase():'';if(e&&l!='SESSION'&&l!='NONE'){t=(v!=''?parseInt(l?l:0):-6"
+"0);if(t){e=new Date;e.setTime(e.getTime()+(t*1000))}}if(k&&l!='NONE'){s.d.cookie=k+'='+s.ape(v!=''?v:'[[B]]')+'; path=/;'+(e&&l!='SESSION'?' expires='+e.toGMTString()+';':'')+(d?' domain='+d+';':''"
+");return s.c_r(k)==v}return 0};s.eh=function(o,e,r,f){var s=this,b='s_'+e+'_'+s._in,n=-1,l,i,x;if(!s.ehl)s.ehl=new Array;l=s.ehl;for(i=0;i<l.length&&n<0;i++){if(l[i].o==o&&l[i].e==e)n=i}if(n<0){n=i"
+";l[n]=new Object}x=l[n];x.o=o;x.e=e;f=r?x.b:f;if(r||f){x.b=r?0:o[e];x.o[e]=f}if(x.b){x.o[b]=x.b;return b}return 0};s.cet=function(f,a,t,o,b){var s=this,r,tcf;if(s.apv>=5&&(!s.isopera||s.apv>=7)){tc"
+"f=new Function('s','f','a','t','var e,r;try{r=s[f](a)}catch(e){r=s[t](e)}return r');r=tcf(s,f,a,t)}else{if(s.ismac&&s.u.indexOf('MSIE 4')>=0)r=s[b](a);else{s.eh(s.wd,'onerror',0,o);r=s[f](a);s.eh(s"
+".wd,'onerror',1)}}return r};s.gtfset=function(e){var s=this;return s.tfs};s.gtfsoe=new Function('e','var s=s_c_il['+s._in+'],c;s.eh(window,\"onerror\",1);s.etfs=1;c=s.t();if(c)s.d.write(c);s.etfs=0"
+";return true');s.gtfsfb=function(a){return window};s.gtfsf=function(w){var s=this,p=w.parent,l=w.location;s.tfs=w;if(p&&p.location!=l&&p.location.host==l.host){s.tfs=p;return s.gtfsf(s.tfs)}return "
+"s.tfs};s.gtfs=function(){var s=this;if(!s.tfs){s.tfs=s.wd;if(!s.etfs)s.tfs=s.cet('gtfsf',s.tfs,'gtfset',s.gtfsoe,'gtfsfb')}return s.tfs};s.mrq=function(u){var s=this,l=s.rl[u],n,r;s.rl[u]=0;if(l)fo"
+"r(n=0;n<l.length;n++){r=l[n];s.mr(0,0,r.r,r.t,r.u)}};s.flushBufferedRequests=function(){};s.mr=function(sess,q,rs,ta,u){var s=this,dc=s.dc,t1=s.trackingServer,t2=s.trackingServerSecure,tb=s.trackin"
+"gServerBase,p='.sc',ns=s.visitorNamespace,un=s.cls(u?u:(ns?ns:s.fun)),r=new Object,l,imn='s_i_'+(un),im,b,e;if(!rs){if(t1){if(t2&&s.ssl)t1=t2}else{if(!tb)tb='2o7.net';if(dc)dc=(''+dc).toLowerCase()"
+";else dc='d1';if(tb=='2o7.net'){if(dc=='d1')dc='112';else if(dc=='d2')dc='122';p=''}t1=un+'.'+dc+'.'+p+tb}rs='http'+(s.ssl?'s':'')+'://'+t1+'/b/ss/'+s.un+'/'+(s.mobile?'5.1':'1')+'/'+s.version+(s.t"
+"cn?'T':'')+'/'+sess+'?AQB=1&ndh=1'+(q?q:'')+'&AQE=1';if(s.isie&&!s.ismac)rs=s.fl(rs,2047)}if(s.d.images&&s.apv>=3&&(!s.isopera||s.apv>=7)&&(s.ns6<0||s.apv>=6.1)){if(!s.rc)s.rc=new Object;if(!s.rc[u"
+"n]){s.rc[un]=1;if(!s.rl)s.rl=new Object;s.rl[un]=new Array;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+'].mrq(\"'+un+'\")',750)}else{l=s.rl[un];if(l){r.t=ta;r.u=un;r.r=rs;l[l.length]=r;retur"
+"n ''}imn+='_'+s.rc[un];s.rc[un]++}if(s.debugTracking){var d='AppMeasurement Debug: '+rs,dl=s.sp(rs,'&'),dln;for(dln=0;dln<dl.length;dln++)d+=\"\\n\\t\"+s.epa(dl[dln]);s.logDebug(d)}im=s.wd[imn];if("
+"!im)im=s.wd[imn]=new Image;im.s_l=0;im.onload=new Function('e','this.s_l=1;var wd=window,s;if(wd.s_c_il){s=wd.s_c_il['+s._in+'];s.bcr();s.mrq(\"'+un+'\");s.nrs--;if(!s.nrs)s.m_m(\"rr\")}');if(!s.nr"
+"s){s.nrs=1;s.m_m('rs')}else s.nrs++;im.src=rs;if(s.useForcedLinkTracking||s.bcf){if(!s.forcedLinkTrackingTimeout)s.forcedLinkTrackingTimeout=250;setTimeout('if(window.s_c_il)window.s_c_il['+s._in+'"
+"].bcr()',s.forcedLinkTrackingTimeout);}else if((s.lnk||s.eo)&&(!ta||ta=='_self'||ta=='_top'||(s.wd.name&&ta==s.wd.name))){b=e=new Date;while(!im.s_l&&e.getTime()-b.getTime()<500)e=new Date}return '"
+"'}return '<im'+'g sr'+'c=\"'+rs+'\" width=1 height=1 border=0 alt=\"\">'};s.gg=function(v){var s=this;if(!s.wd['s_'+v])s.wd['s_'+v]='';return s.wd['s_'+v]};s.glf=function(t,a){if(t.substring(0,2)=="
+"'s_')t=t.substring(2);var s=this,v=s.gg(t);if(v)s[t]=v};s.gl=function(v){var s=this;if(s.pg)s.pt(v,',','glf',0)};s.rf=function(x){var s=this,y,i,j,h,p,l=0,q,a,b='',c='',t;if(x&&x.length>255){y=''+x"
+";i=y.indexOf('?');if(i>0){q=y.substring(i+1);y=y.substring(0,i);h=y.toLowerCase();j=0;if(h.substring(0,7)=='http://')j+=7;else if(h.substring(0,8)=='https://')j+=8;i=h.indexOf(\"/\",j);if(i>0){h=h."
+"substring(j,i);p=y.substring(i);y=y.substring(0,i);if(h.indexOf('google')>=0)l=',q,ie,start,search_key,word,kw,cd,';else if(h.indexOf('yahoo.co')>=0)l=',p,ei,';if(l&&q){a=s.sp(q,'&');if(a&&a.length"
+">1){for(j=0;j<a.length;j++){t=a[j];i=t.indexOf('=');if(i>0&&l.indexOf(','+t.substring(0,i)+',')>=0)b+=(b?'&':'')+t;else c+=(c?'&':'')+t}if(b&&c)q=b+'&'+c;else c=''}i=253-(q.length-c.length)-y.lengt"
+"h;x=y+(i>0?p.substring(0,i):'')+'?'+q}}}}return x};s.s2q=function(k,v,vf,vfp,f){var s=this,qs='',sk,sv,sp,ss,nke,nk,nf,nfl=0,nfn,nfm;if(k==\"contextData\")k=\"c\";if(v){for(sk in v)if((!f||sk.subst"
+"ring(0,f.length)==f)&&v[sk]&&(!vf||vf.indexOf(','+(vfp?vfp+'.':'')+sk+',')>=0)&&(!Object||!Object.prototype||!Object.prototype[sk])){nfm=0;if(nfl)for(nfn=0;nfn<nfl.length;nfn++)if(sk.substring(0,nf"
+"l[nfn].length)==nfl[nfn])nfm=1;if(!nfm){if(qs=='')qs+='&'+k+'.';sv=v[sk];if(f)sk=sk.substring(f.length);if(sk.length>0){nke=sk.indexOf('.');if(nke>0){nk=sk.substring(0,nke);nf=(f?f:'')+nk+'.';if(!n"
+"fl)nfl=new Array;nfl[nfl.length]=nf;qs+=s.s2q(nk,v,vf,vfp,nf)}else{if(typeof(sv)=='boolean'){if(sv)sv='true';else sv='false'}if(sv){if(vfp=='retrieveLightData'&&f.indexOf('.contextData.')<0){sp=sk."
+"substring(0,4);ss=sk.substring(4);if(sk=='transactionID')sk='xact';else if(sk=='channel')sk='ch';else if(sk=='campaign')sk='v0';else if(s.num(ss)){if(sp=='prop')sk='c'+ss;else if(sp=='eVar')sk='v'+"
+"ss;else if(sp=='list')sk='l'+ss;else if(sp=='hier'){sk='h'+ss;sv=sv.substring(0,255)}}}qs+='&'+s.ape(sk)+'='+s.ape(sv)}}}}}if(qs!='')qs+='&.'+k}return qs};s.hav=function(){var s=this,qs='',l,fv='',"
+"fe='',mn,i,e;if(s.lightProfileID){l=s.va_m;fv=s.lightTrackVars;if(fv)fv=','+fv+','+s.vl_mr+','}else{l=s.va_t;if(s.pe||s.linkType){fv=s.linkTrackVars;fe=s.linkTrackEvents;if(s.pe){mn=s.pe.substring("
+"0,1).toUpperCase()+s.pe.substring(1);if(s[mn]){fv=s[mn].trackVars;fe=s[mn].trackEvents}}}if(fv)fv=','+fv+','+s.vl_l+','+s.vl_l2;if(fe){fe=','+fe+',';if(fv)fv+=',events,'}if (s.events2)e=(e?',':'')+"
+"s.events2}for(i=0;i<l.length;i++){var k=l[i],v=s[k],b=k.substring(0,4),x=k.substring(4),n=parseInt(x),q=k;if(!v)if(k=='events'&&e){v=e;e=''}if(v&&(!fv||fv.indexOf(','+k+',')>=0)&&k!='linkName'&&k!="
+"'linkType'){if(k=='timestamp')q='ts';else if(k=='dynamicVariablePrefix')q='D';else if(k=='visitorID')q='vid';else if(k=='pageURL'){q='g';if(v.length>255){s.pageURLRest=v.substring(255);v=v.substrin"
+"g(0,255);}}else if(k=='pageURLRest')q='-g';else if(k=='referrer'){q='r';v=s.fl(s.rf(v),255)}else if(k=='vmk'||k=='visitorMigrationKey')q='vmt';else if(k=='visitorMigrationServer'){q='vmf';if(s.ssl&"
+"&s.visitorMigrationServerSecure)v=''}else if(k=='visitorMigrationServerSecure'){q='vmf';if(!s.ssl&&s.visitorMigrationServer)v=''}else if(k=='charSet'){q='ce';if(v.toUpperCase()=='AUTO')v='ISO8859-1"
+"';else if(s.em==2||s.em==3)v='UTF-8'}else if(k=='visitorNamespace')q='ns';else if(k=='cookieDomainPeriods')q='cdp';else if(k=='cookieLifetime')q='cl';else if(k=='variableProvider')q='vvp';else if(k"
+"=='currencyCode')q='cc';else if(k=='channel')q='ch';else if(k=='transactionID')q='xact';else if(k=='campaign')q='v0';else if(k=='resolution')q='s';else if(k=='colorDepth')q='c';else if(k=='javascri"
+"ptVersion')q='j';else if(k=='javaEnabled')q='v';else if(k=='cookiesEnabled')q='k';else if(k=='browserWidth')q='bw';else if(k=='browserHeight')q='bh';else if(k=='connectionType')q='ct';else if(k=='h"
+"omepage')q='hp';else if(k=='plugins')q='p';else if(k=='events'){if(e)v+=(v?',':'')+e;if(fe)v=s.fs(v,fe)}else if(k=='events2')v='';else if(k=='contextData'){qs+=s.s2q('c',s[k],fv,k,0);v=''}else if(k"
+"=='lightProfileID')q='mtp';else if(k=='lightStoreForSeconds'){q='mtss';if(!s.lightProfileID)v=''}else if(k=='lightIncrementBy'){q='mti';if(!s.lightProfileID)v=''}else if(k=='retrieveLightProfiles')"
+"q='mtsr';else if(k=='deleteLightProfiles')q='mtsd';else if(k=='retrieveLightData'){if(s.retrieveLightProfiles)qs+=s.s2q('mts',s[k],fv,k,0);v=''}else if(s.num(x)){if(b=='prop')q='c'+n;else if(b=='eV"
+"ar')q='v'+n;else if(b=='list')q='l'+n;else if(b=='hier'){q='h'+n;v=s.fl(v,255)}}if(v)qs+='&'+s.ape(q)+'='+(k.substring(0,3)!='pev'?s.ape(v):v)}}return qs};s.ltdf=function(t,h){t=t?t.toLowerCase():'"
+"';h=h?h.toLowerCase():'';var qi=h.indexOf('?');h=qi>=0?h.substring(0,qi):h;if(t&&h.substring(h.length-(t.length+1))=='.'+t)return 1;return 0};s.ltef=function(t,h){t=t?t.toLowerCase():'';h=h?h.toLow"
+"erCase():'';if(t&&h.indexOf(t)>=0)return 1;return 0};s.lt=function(h){var s=this,lft=s.linkDownloadFileTypes,lef=s.linkExternalFilters,lif=s.linkInternalFilters;lif=lif?lif:s.wd.location.hostname;h"
+"=h.toLowerCase();if(s.trackDownloadLinks&&lft&&s.pt(lft,',','ltdf',h))return 'd';if(s.trackExternalLinks&&h.indexOf('#')!=0&&h.indexOf('about:')!=0&&h.indexOf('javascript:')!=0&&(lef||lif)&&(!lef||"
+"s.pt(lef,',','ltef',h))&&(!lif||!s.pt(lif,',','ltef',h)))return 'e';return ''};s.lc=new Function('e','var s=s_c_il['+s._in+'],b=s.eh(this,\"onclick\");s.lnk=this;s.t();s.lnk=0;if(b)return this[b](e"
+");return true');s.bcr=function(){var s=this;if(s.bct&&s.bce)s.bct.dispatchEvent(s.bce);if(s.bcf){if(typeof(s.bcf)=='function')s.bcf();else if(s.bct&&s.bct.href)s.d.location=s.bct.href}s.bct=s.bce=s"
+".bcf=0};s.bc=new Function('e','if(e&&e.s_fe)return;var s=s_c_il['+s._in+'],f,tcf,t,n,nrs,a,h;if(s.d&&s.d.all&&s.d.all.cppXYctnr)return;if(!s.bbc)s.useForcedLinkTracking=0;else if(!s.useForcedLinkTr"
+"acking){s.b.removeEventListener(\"click\",s.bc,true);s.bbc=s.useForcedLinkTracking=0;return}else s.b.removeEventListener(\"click\",s.bc,false);s.eo=e.srcElement?e.srcElement:e.target;nrs=s.nrs;s.t("
+");s.eo=0;if(s.nrs>nrs&&s.useForcedLinkTracking&&e.target){a=e.target;while(a&&a!=s.b&&a.tagName.toUpperCase()!=\"A\"&&a.tagName.toUpperCase()!=\"AREA\")a=a.parentNode;if(a){h=a.href;if(h.indexOf(\""
+"#\")==0||h.indexOf(\"about:\")==0||h.indexOf(\"javascript:\")==0)h=0;t=a.target;if(e.target.dispatchEvent&&h&&(!t||t==\"_self\"||t==\"_top\"||(s.wd.name&&t==s.wd.name))){e.stopPropagation();e.stopI"
+"mmediatePropagation();e.preventDefault();n=s.d.createEvent(\"MouseEvents\");n.initMouseEvent(\"click\",e.bubbles,e.cancelable,e.view,e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.alt"
+"Key,e.shiftKey,e.metaKey,e.button,e.relatedTarget);n.s_fe=1;s.bct=e.target;s.bce=n}}}');s.oh=function(o){var s=this,l=s.wd.location,h=o.href?o.href:'',i,j,k,p;i=h.indexOf(':');j=h.indexOf('?');k=h."
+"indexOf('/');if(h&&(i<0||(j>=0&&i>j)||(k>=0&&i>k))){p=o.protocol&&o.protocol.length>1?o.protocol:(l.protocol?l.protocol:'');i=l.pathname.lastIndexOf('/');h=(p?p+'//':'')+(o.host?o.host:(l.host?l.ho"
+"st:''))+(h.substring(0,1)!='/'?l.pathname.substring(0,i<0?0:i)+'/':'')+h}return h};s.ot=function(o){var t=o.tagName;if(o.tagUrn||(o.scopeName&&o.scopeName.toUpperCase()!='HTML'))return '';t=t&&t.to"
+"UpperCase?t.toUpperCase():'';if(t=='SHAPE')t='';if(t){if((t=='INPUT'||t=='BUTTON')&&o.type&&o.type.toUpperCase)t=o.type.toUpperCase();else if(!t&&o.href)t='A';}return t};s.oid=function(o){var s=thi"
+"s,t=s.ot(o),p,c,n='',x=0;if(t&&!o.s_oid){p=o.protocol;c=o.onclick;if(o.href&&(t=='A'||t=='AREA')&&(!c||!p||p.toLowerCase().indexOf('javascript')<0))n=s.oh(o);else if(c){n=s.rep(s.rep(s.rep(s.rep(''"
+"+c,\"\\r\",''),\"\\n\",''),\"\\t\",''),' ','');x=2}else if(t=='INPUT'||t=='SUBMIT'){if(o.value)n=o.value;else if(o.innerText)n=o.innerText;else if(o.textContent)n=o.textContent;x=3}else if(o.src&&t"
+"=='IMAGE')n=o.src;if(n){o.s_oid=s.fl(n,100);o.s_oidt=x}}return o.s_oid};s.rqf=function(t,un){var s=this,e=t.indexOf('='),u=e>=0?t.substring(0,e):'',q=e>=0?s.epa(t.substring(e+1)):'';if(u&&q&&(','+u"
+"+',').indexOf(','+un+',')>=0){if(u!=s.un&&s.un.indexOf(',')>=0)q='&u='+u+q+'&u=0';return q}return ''};s.rq=function(un){if(!un)un=this.un;var s=this,c=un.indexOf(','),v=s.c_r('s_sq'),q='';if(c<0)re"
+"turn s.pt(v,'&','rqf',un);return s.pt(un,',','rq',0)};s.sqp=function(t,a){var s=this,e=t.indexOf('='),q=e<0?'':s.epa(t.substring(e+1));s.sqq[q]='';if(e>=0)s.pt(t.substring(0,e),',','sqs',q);return "
+"0};s.sqs=function(un,q){var s=this;s.squ[un]=q;return 0};s.sq=function(q){var s=this,k='s_sq',v=s.c_r(k),x,c=0;s.sqq=new Object;s.squ=new Object;s.sqq[q]='';s.pt(v,'&','sqp',0);s.pt(s.un,',','sqs',"
+"q);v='';for(x in s.squ)if(x&&(!Object||!Object.prototype||!Object.prototype[x]))s.sqq[s.squ[x]]+=(s.sqq[s.squ[x]]?',':'')+x;for(x in s.sqq)if(x&&(!Object||!Object.prototype||!Object.prototype[x])&&"
+"s.sqq[x]&&(x==q||c<2)){v+=(v?'&':'')+s.sqq[x]+'='+s.ape(x);c++}return s.c_w(k,v,0)};s.wdl=new Function('e','var s=s_c_il['+s._in+'],r=true,b=s.eh(s.wd,\"onload\"),i,o,oc;if(b)r=this[b](e);for(i=0;i"
+"<s.d.links.length;i++){o=s.d.links[i];oc=o.onclick?\"\"+o.onclick:\"\";if((oc.indexOf(\"s_gs(\")<0||oc.indexOf(\".s_oc(\")>=0)&&oc.indexOf(\".tl(\")<0)s.eh(o,\"onclick\",0,s.lc);}return r');s.wds=f"
+"unction(){var s=this;if(s.apv>3&&(!s.isie||!s.ismac||s.apv>=5)){if(s.b&&s.b.attachEvent)s.b.attachEvent('onclick',s.bc);else if(s.b&&s.b.addEventListener){if(s.n&&s.n.userAgent.indexOf('WebKit')>=0"
+"&&s.d.createEvent){s.bbc=1;s.useForcedLinkTracking=1;s.b.addEventListener('click',s.bc,true)}s.b.addEventListener('click',s.bc,false)}else s.eh(s.wd,'onload',0,s.wdl)}};s.vs=function(x){var s=this,"
+"v=s.visitorSampling,g=s.visitorSamplingGroup,k='s_vsn_'+s.un+(g?'_'+g:''),n=s.c_r(k),e=new Date,y=e.getYear();e.setYear(y+10+(y<1900?1900:0));if(v){v*=100;if(!n){if(!s.c_w(k,x,e))return 0;n=x}if(n%"
+"10000>v)return 0}return 1};s.dyasmf=function(t,m){if(t&&m&&m.indexOf(t)>=0)return 1;return 0};s.dyasf=function(t,m){var s=this,i=t?t.indexOf('='):-1,n,x;if(i>=0&&m){var n=t.substring(0,i),x=t.subst"
+"ring(i+1);if(s.pt(x,',','dyasmf',m))return n}return 0};s.uns=function(){var s=this,x=s.dynamicAccountSelection,l=s.dynamicAccountList,m=s.dynamicAccountMatch,n,i;s.un=s.un.toLowerCase();if(x&&l){if"
+"(!m)m=s.wd.location.host;if(!m.toLowerCase)m=''+m;l=l.toLowerCase();m=m.toLowerCase();n=s.pt(l,';','dyasf',m);if(n)s.un=n}i=s.un.indexOf(',');s.fun=i<0?s.un:s.un.substring(0,i)};s.sa=function(un){v"
+"ar s=this;if(s.un&&s.mpc('sa',arguments))return;s.un=un;if(!s.oun)s.oun=un;else if((','+s.oun+',').indexOf(','+un+',')<0)s.oun+=','+un;s.uns()};s.m_i=function(n,a){var s=this,m,f=n.substring(0,1),r"
+",l,i;if(!s.m_l)s.m_l=new Object;if(!s.m_nl)s.m_nl=new Array;m=s.m_l[n];if(!a&&m&&m._e&&!m._i)s.m_a(n);if(!m){m=new Object,m._c='s_m';m._in=s.wd.s_c_in;m._il=s._il;m._il[m._in]=m;s.wd.s_c_in++;m.s=s"
+";m._n=n;m._l=new Array('_c','_in','_il','_i','_e','_d','_dl','s','n','_r','_g','_g1','_t','_t1','_x','_x1','_rs','_rr','_l');s.m_l[n]=m;s.m_nl[s.m_nl.length]=n}else if(m._r&&!m._m){r=m._r;r._m=m;l="
+"m._l;for(i=0;i<l.length;i++)if(m[l[i]])r[l[i]]=m[l[i]];r._il[r._in]=r;m=s.m_l[n]=r}if(f==f.toUpperCase())s[n]=m;return m};s.m_a=new Function('n','g','e','if(!g)g=\"m_\"+n;var s=s_c_il['+s._in+'],c="
+"s[g+\"_c\"],m,x,f=0;if(s.mpc(\"m_a\",arguments))return;if(!c)c=s.wd[\"s_\"+g+\"_c\"];if(c&&s_d)s[g]=new Function(\"s\",s_ft(s_d(c)));x=s[g];if(!x)x=s.wd[\\'s_\\'+g];if(!x)x=s.wd[g];m=s.m_i(n,1);if("
+"x&&(!m._i||g!=\"m_\"+n)){m._i=f=1;if((\"\"+x).indexOf(\"function\")>=0)x(s);else s.m_m(\"x\",n,x,e)}m=s.m_i(n,1);if(m._dl)m._dl=m._d=0;s.dlt();return f');s.m_m=function(t,n,d,e){t='_'+t;var s=this,"
+"i,x,m,f='_'+t,r=0,u;if(s.m_l&&s.m_nl)for(i=0;i<s.m_nl.length;i++){x=s.m_nl[i];if(!n||x==n){m=s.m_i(x);u=m[t];if(u){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t](d,e);else if(d)u=m[t](d);else u=m"
+"[t]()}}if(u)r=1;u=m[t+1];if(u&&!m[f]){if((''+u).indexOf('function')>=0){if(d&&e)u=m[t+1](d,e);else if(d)u=m[t+1](d);else u=m[t+1]()}}m[f]=1;if(u)r=1}}return r};s.m_ll=function(){var s=this,g=s.m_dl"
+",i,o;if(g)for(i=0;i<g.length;i++){o=g[i];if(o)s.loadModule(o.n,o.u,o.d,o.l,o.e,1);g[i]=0}};s.loadModule=function(n,u,d,l,e,ln){var s=this,m=0,i,g,o=0,f1,f2,c=s.h?s.h:s.b,b,tcf;if(n){i=n.indexOf(':'"
+");if(i>=0){g=n.substring(i+1);n=n.substring(0,i)}else g=\"m_\"+n;m=s.m_i(n)}if((l||(n&&!s.m_a(n,g)))&&u&&s.d&&c&&s.d.createElement){if(d){m._d=1;m._dl=1}if(ln){if(s.ssl)u=s.rep(u,'http:','https:');"
+"i='s_s:'+s._in+':'+n+':'+g;b='var s=s_c_il['+s._in+'],o=s.d.getElementById(\"'+i+'\");if(s&&o){if(!o.l&&s.wd.'+g+'){o.l=1;if(o.i)clearTimeout(o.i);o.i=0;s.m_a(\"'+n+'\",\"'+g+'\"'+(e?',\"'+e+'\"':'"
+"')+')}';f2=b+'o.c++;if(!s.maxDelay)s.maxDelay=250;if(!o.l&&o.c<(s.maxDelay*2)/100)o.i=setTimeout(o.f2,100)}';f1=new Function('e',b+'}');tcf=new Function('s','c','i','u','f1','f2','var e,o=0;try{o=s"
+".d.createElement(\"script\");if(o){o.type=\"text/javascript\";'+(n?'o.id=i;o.defer=true;o.onload=o.onreadystatechange=f1;o.f2=f2;o.l=0;':'')+'o.src=u;c.appendChild(o);'+(n?'o.c=0;o.i=setTimeout(f2,"
+"100)':'')+'}}catch(e){o=0}return o');o=tcf(s,c,i,u,f1,f2)}else{o=new Object;o.n=n+':'+g;o.u=u;o.d=d;o.l=l;o.e=e;g=s.m_dl;if(!g)g=s.m_dl=new Array;i=0;while(i<g.length&&g[i])i++;g[i]=o}}else if(n){m"
+"=s.m_i(n);m._e=1}return m};s.voa=function(vo,r){var s=this,l=s.va_g,i,k,v,x;for(i=0;i<l.length;i++){k=l[i];v=vo[k];if(v||vo['!'+k]){if(!r&&(k==\"contextData\"||k==\"retrieveLightData\")&&s[k])for(x"
+" in s[k])if(!v[x])v[x]=s[k][x];s[k]=v}}};s.vob=function(vo){var s=this,l=s.va_g,i,k;for(i=0;i<l.length;i++){k=l[i];vo[k]=s[k];if(!vo[k])vo['!'+k]=1}};s.dlt=new Function('var s=s_c_il['+s._in+'],d=n"
+"ew Date,i,vo,f=0;if(s.dll)for(i=0;i<s.dll.length;i++){vo=s.dll[i];if(vo){if(!s.m_m(\"d\")||d.getTime()-vo._t>=s.maxDelay){s.dll[i]=0;s.t(vo)}else f=1}}if(s.dli)clearTimeout(s.dli);s.dli=0;if(f){if("
+"!s.dli)s.dli=setTimeout(s.dlt,s.maxDelay)}else s.dll=0');s.dl=function(vo){var s=this,d=new Date;if(!vo)vo=new Object;s.vob(vo);vo._t=d.getTime();if(!s.dll)s.dll=new Array;s.dll[s.dll.length]=vo;if"
+"(!s.maxDelay)s.maxDelay=250;s.dlt()};s.gfid=function(){var s=this,d='0123456789ABCDEF',k='s_fid',fid=s.c_r(k),h='',l='',i,j,m=8,n=4,e=new Date,y;if(!fid||fid.indexOf('-')<0){for(i=0;i<16;i++){j=Mat"
+"h.floor(Math.random()*m);h+=d.substring(j,j+1);j=Math.floor(Math.random()*n);l+=d.substring(j,j+1);m=n=16}fid=h+'-'+l;}y=e.getYear();e.setYear(y+2+(y<1900?1900:0));if(!s.c_w(k,fid,e))fid=0;return f"
+"id};s.applyADMS=function(){var s=this,vb=new Object;if(s.wd.ADMS&&!s.visitorID&&!s.admsc){if(!s.adms)s.adms=ADMS.getDefault();if(!s.admsq){s.visitorID=s.adms.getVisitorID(new Function('v','var s=s_"
+"c_il['+s._in+'],l=s.admsq,i;if(v==-1)v=0;if(v)s.visitorID=v;s.admsq=0;if(l){s.admsc=1;for(i=0;i<l.length;i++)s.t(l[i]);s.admsc=0;}'));if(!s.visitorID)s.admsq=new Array}if(s.admsq){s.vob(vb);vb['!vi"
+"sitorID']=0;s.admsq.push(vb);return 1}else{if(s.visitorID==-1)s.visitorID=0}}return 0};s.track=s.t=function(vo){var s=this,trk=1,tm=new Date,sed=Math&&Math.random?Math.floor(Math.random()*100000000"
+"00000):tm.getTime(),sess='s'+Math.floor(tm.getTime()/10800000)%10+sed,y=tm.getYear(),vt=tm.getDate()+'/'+tm.getMonth()+'/'+(y<1900?y+1900:y)+' '+tm.getHours()+':'+tm.getMinutes()+':'+tm.getSeconds("
+")+' '+tm.getDay()+' '+tm.getTimezoneOffset(),tcf,tfs=s.gtfs(),ta=-1,q='',qs='',code='',vb=new Object;if(s.mpc('t',arguments))return;s.gl(s.vl_g);s.uns();s.m_ll();if(!s.td){var tl=tfs.location,a,o,i"
+",x='',c='',v='',p='',bw='',bh='',j='1.0',k=s.c_w('s_cc','true',0)?'Y':'N',hp='',ct='',pn=0,ps;if(String&&String.prototype){j='1.1';if(j.match){j='1.2';if(tm.setUTCDate){j='1.3';if(s.isie&&s.ismac&&"
+"s.apv>=5)j='1.4';if(pn.toPrecision){j='1.5';a=new Array;if(a.forEach){j='1.6';i=0;o=new Object;tcf=new Function('o','var e,i=0;try{i=new Iterator(o)}catch(e){}return i');i=tcf(o);if(i&&i.next){j='1"
+".7';if(a.reduce){j='1.8';if(j.trim){j='1.8.1';if(Date.parse){j='1.8.2';if(Object.create)j='1.8.5'}}}}}}}}}if(s.apv>=4)x=screen.width+'x'+screen.height;if(s.isns||s.isopera){if(s.apv>=3){v=s.n.javaE"
+"nabled()?'Y':'N';if(s.apv>=4){c=screen.pixelDepth;bw=s.wd.innerWidth;bh=s.wd.innerHeight}}s.pl=s.n.plugins}else if(s.isie){if(s.apv>=4){v=s.n.javaEnabled()?'Y':'N';c=screen.colorDepth;if(s.apv>=5){"
+"bw=s.d.documentElement.offsetWidth;bh=s.d.documentElement.offsetHeight;if(!s.ismac&&s.b){tcf=new Function('s','tl','var e,hp=0;try{s.b.addBehavior(\"#default#homePage\");hp=s.b.isHomePage(tl)?\"Y\""
+":\"N\"}catch(e){}return hp');hp=tcf(s,tl);tcf=new Function('s','var e,ct=0;try{s.b.addBehavior(\"#default#clientCaps\");ct=s.b.connectionType}catch(e){}return ct');ct=tcf(s)}}}else r=''}if(s.pl)whi"
+"le(pn<s.pl.length&&pn<30){ps=s.fl(s.pl[pn].name,100)+';';if(p.indexOf(ps)<0)p+=ps;pn++}s.resolution=x;s.colorDepth=c;s.javascriptVersion=j;s.javaEnabled=v;s.cookiesEnabled=k;s.browserWidth=bw;s.bro"
+"wserHeight=bh;s.connectionType=ct;s.homepage=hp;s.plugins=p;s.td=1}if(vo){s.vob(vb);s.voa(vo)}s.fid=s.gfid();if(s.applyADMS())return '';if((vo&&vo._t)||!s.m_m('d')){if(s.usePlugins)s.doPlugins(s);i"
+"f(!s.abort){var l=s.wd.location,r=tfs.document.referrer;if(!s.pageURL)s.pageURL=l.href?l.href:l;if(!s.referrer&&!s._1_referrer){s.referrer=r;s._1_referrer=1}s.m_m('g');if(s.lnk||s.eo){var o=s.eo?s."
+"eo:s.lnk,p=s.pageName,w=1,t=s.ot(o),n=s.oid(o),x=o.s_oidt,h,l,i,oc;if(s.eo&&o==s.eo){while(o&&!n&&t!='BODY'){o=o.parentElement?o.parentElement:o.parentNode;if(o){t=s.ot(o);n=s.oid(o);x=o.s_oidt}}if"
+"(!n||t=='BODY')o='';if(o){oc=o.onclick?''+o.onclick:'';if((oc.indexOf('s_gs(')>=0&&oc.indexOf('.s_oc(')<0)||oc.indexOf('.tl(')>=0)o=0}}if(o){if(n)ta=o.target;h=s.oh(o);i=h.indexOf('?');h=s.linkLeav"
+"eQueryString||i<0?h:h.substring(0,i);l=s.linkName;t=s.linkType?s.linkType.toLowerCase():s.lt(h);if(t&&(h||l)){s.pe='lnk_'+(t=='d'||t=='e'?t:'o');s.pev1=(h?s.ape(h):'');s.pev2=(l?s.ape(l):'')}else t"
+"rk=0;if(s.trackInlineStats){if(!p){p=s.pageURL;w=0}t=s.ot(o);i=o.sourceIndex;if(o.dataset&&o.dataset.sObjectId){s.wd.s_objectID=o.dataset.sObjectId;}else if(o.getAttribute&&o.getAttribute('data-s-o"
+"bject-id')){s.wd.s_objectID=o.getAttribute('data-s-object-id');}else if(s.useForcedLinkTracking){s.wd.s_objectID='';oc=o.onclick?''+o.onclick:'';if(oc){var ocb=oc.indexOf('s_objectID'),oce,ocq,ocx;"
+"if(ocb>=0){ocb+=10;while(ocb<oc.length&&(\"= \\t\\r\\n\").indexOf(oc.charAt(ocb))>=0)ocb++;if(ocb<oc.length){oce=ocb;ocq=ocx=0;while(oce<oc.length&&(oc.charAt(oce)!=';'||ocq)){if(ocq){if(oc.charAt("
+"oce)==ocq&&!ocx)ocq=0;else if(oc.charAt(oce)==\"\\\\\")ocx=!ocx;else ocx=0;}else{ocq=oc.charAt(oce);if(ocq!='\"'&&ocq!=\"'\")ocq=0}oce++;}oc=oc.substring(ocb,oce);if(oc){o.s_soid=new Function('s','"
+"var e;try{s.wd.s_objectID='+oc+'}catch(e){}');o.s_soid(s)}}}}}if(s.gg('objectID')){n=s.gg('objectID');x=1;i=1}if(p&&n&&t)qs='&pid='+s.ape(s.fl(p,255))+(w?'&pidt='+w:'')+'&oid='+s.ape(s.fl(n,100))+("
+"x?'&oidt='+x:'')+'&ot='+s.ape(t)+(i?'&oi='+i:'')}}else trk=0}if(trk||qs){s.sampled=s.vs(sed);if(trk){if(s.sampled)code=s.mr(sess,(vt?'&t='+s.ape(vt):'')+s.hav()+q+(qs?qs:s.rq()),0,ta);qs='';s.m_m('"
+"t');if(s.p_r)s.p_r();s.referrer=s.lightProfileID=s.retrieveLightProfiles=s.deleteLightProfiles=''}s.sq(qs)}}}else s.dl(vo);if(vo)s.voa(vb,1);s.abort=0;s.pageURLRest=s.lnk=s.eo=s.linkName=s.linkType"
+"=s.wd.s_objectID=s.ppu=s.pe=s.pev1=s.pev2=s.pev3='';if(s.pg)s.wd.s_lnk=s.wd.s_eo=s.wd.s_linkName=s.wd.s_linkType='';return code};s.trackLink=s.tl=function(o,t,n,vo,f){var s=this;s.lnk=o;s.linkType="
+"t;s.linkName=n;if(f){s.bct=o;s.bcf=f}s.t(vo)};s.trackLight=function(p,ss,i,vo){var s=this;s.lightProfileID=p;s.lightStoreForSeconds=ss;s.lightIncrementBy=i;s.t(vo)};s.setTagContainer=function(n){va"
+"r s=this,l=s.wd.s_c_il,i,t,x,y;s.tcn=n;if(l)for(i=0;i<l.length;i++){t=l[i];if(t&&t._c=='s_l'&&t.tagContainerName==n){s.voa(t);if(t.lmq)for(i=0;i<t.lmq.length;i++){x=t.lmq[i];y='m_'+x.n;if(!s[y]&&!s"
+"[y+'_c']){s[y]=t[y];s[y+'_c']=t[y+'_c']}s.loadModule(x.n,x.u,x.d)}if(t.ml)for(x in t.ml)if(s[x]){y=s[x];x=t.ml[x];for(i in x)if(!Object.prototype[i]){if(typeof(x[i])!='function'||(''+x[i]).indexOf("
+"'s_c_il')<0)y[i]=x[i]}}if(t.mmq)for(i=0;i<t.mmq.length;i++){x=t.mmq[i];if(s[x.m]){y=s[x.m];if(y[x.f]&&typeof(y[x.f])=='function'){if(x.a)y[x.f].apply(y,x.a);else y[x.f].apply(y)}}}if(t.tq)for(i=0;i"
+"<t.tq.length;i++)s.t(t.tq[i]);t.s=s;return}}};s.wd=window;s.ssl=(s.wd.location.protocol.toLowerCase().indexOf('https')>=0);s.d=document;s.b=s.d.body;if(s.d.getElementsByTagName){s.h=s.d.getElements"
+"ByTagName('HEAD');if(s.h)s.h=s.h[0]}s.n=navigator;s.u=s.n.userAgent;s.ns6=s.u.indexOf('Netscape6/');var apn=s.n.appName,v=s.n.appVersion,ie=v.indexOf('MSIE '),o=s.u.indexOf('Opera '),i;if(v.indexOf"
+"('Opera')>=0||o>0)apn='Opera';s.isie=(apn=='Microsoft Internet Explorer');s.isns=(apn=='Netscape');s.isopera=(apn=='Opera');s.ismac=(s.u.indexOf('Mac')>=0);if(o>0)s.apv=parseFloat(s.u.substring(o+6"
+"));else if(ie>0){s.apv=parseInt(i=v.substring(ie+5));if(s.apv>3)s.apv=parseFloat(i)}else if(s.ns6>0)s.apv=parseFloat(s.u.substring(s.ns6+10));else s.apv=parseFloat(v);s.em=0;if(s.em.toPrecision)s.e"
+"m=3;else if(String.fromCharCode){i=escape(String.fromCharCode(256)).toUpperCase();s.em=(i=='%C4%80'?2:(i=='%U0100'?1:0))}if(s.oun)s.sa(s.oun);s.sa(un);s.vl_l='timestamp,dynamicVariablePrefix,visito"
+"rID,fid,vmk,visitorMigrationKey,visitorMigrationServer,visitorMigrationServerSecure,ppu,charSet,visitorNamespace,cookieDomainPeriods,cookieLifetime,pageName,pageURL,referrer,contextData,currencyCod"
+"e,lightProfileID,lightStoreForSeconds,lightIncrementBy,retrieveLightProfiles,deleteLightProfiles,retrieveLightData';s.va_l=s.sp(s.vl_l,',');s.vl_mr=s.vl_m='timestamp,charSet,visitorNamespace,cookie"
+"DomainPeriods,cookieLifetime,contextData,lightProfileID,lightStoreForSeconds,lightIncrementBy';s.vl_t=s.vl_l+',variableProvider,channel,server,pageType,transactionID,purchaseID,campaign,state,zip,e"
+"vents,events2,products,linkName,linkType';var n;for(n=1;n<=75;n++){s.vl_t+=',prop'+n+',eVar'+n;s.vl_m+=',prop'+n+',eVar'+n}for(n=1;n<=5;n++)s.vl_t+=',hier'+n;for(n=1;n<=3;n++)s.vl_t+=',list'+n;s.va"
+"_m=s.sp(s.vl_m,',');s.vl_l2=',tnt,pe,pev1,pev2,pev3,resolution,colorDepth,javascriptVersion,javaEnabled,cookiesEnabled,browserWidth,browserHeight,connectionType,homepage,pageURLRest,plugins';s.vl_t"
+"+=s.vl_l2;s.va_t=s.sp(s.vl_t,',');s.vl_g=s.vl_t+',trackingServer,trackingServerSecure,trackingServerBase,fpCookieDomainPeriods,disableBufferedRequests,mobile,visitorSampling,visitorSamplingGroup,dy"
+"namicAccountSelection,dynamicAccountList,dynamicAccountMatch,trackDownloadLinks,trackExternalLinks,trackInlineStats,linkLeaveQueryString,linkDownloadFileTypes,linkExternalFilters,linkInternalFilter"
+"s,linkTrackVars,linkTrackEvents,linkNames,lnk,eo,lightTrackVars,_1_referrer,un';s.va_g=s.sp(s.vl_g,',');s.pg=pg;s.gl(s.vl_g);s.contextData=new Object;s.retrieveLightData=new Object;if(!ss)s.wds();i"
+"f(pg){s.wd.s_co=function(o){return o};s.wd.s_gs=function(un){s_gi(un,1,1).t()};s.wd.s_dc=function(un){s_gi(un,1).t()}}",
w=window,l=w.s_c_il,n=navigator,u=n.userAgent,v=n.appVersion,e=v.indexOf('MSIE '),m=u.indexOf('Netscape6/'),a,i,j,x,s;if(un){un=un.toLowerCase();if(l)for(j=0;j<2;j++)for(i=0;i<l.length;i++){s=l[i];x=s._c;if((!x||x=='s_c'||(j>0&&x=='s_l'))&&(s.oun==un||(s.fs&&s.sa&&s.fs(s.oun,un)))){if(s.sa)s.sa(un);if(x=='s_c')return s}else s=0}}w.s_an='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
w.s_sp=new Function("x","d","var a=new Array,i=0,j;if(x){if(x.split)a=x.split(d);else if(!d)for(i=0;i<x.length;i++)a[a.length]=x.substring(i,i+1);else while(i>=0){j=x.indexOf(d,i);a[a.length]=x.subst"
+"ring(i,j<0?x.length:j);i=j;if(i>=0)i+=d.length}}return a");
w.s_jn=new Function("a","d","var x='',i,j=a.length;if(a&&j>0){x=a[0];if(j>1){if(a.join)x=a.join(d);else for(i=1;i<j;i++)x+=d+a[i]}}return x");
w.s_rep=new Function("x","o","n","return s_jn(s_sp(x,o),n)");
w.s_d=new Function("x","var t='`^@$#',l=s_an,l2=new Object,x2,d,b=0,k,i=x.lastIndexOf('~~'),j,v,w;if(i>0){d=x.substring(0,i);x=x.substring(i+2);l=s_sp(l,'');for(i=0;i<62;i++)l2[l[i]]=i;t=s_sp(t,'');d"
+"=s_sp(d,'~');i=0;while(i<5){v=0;if(x.indexOf(t[i])>=0) {x2=s_sp(x,t[i]);for(j=1;j<x2.length;j++){k=x2[j].substring(0,1);w=t[i]+k;if(k!=' '){v=1;w=d[b+l2[k]]}x2[j]=w+x2[j].substring(1)}}if(v)x=s_jn("
+"x2,'');else{w=t[i]+' ';if(x.indexOf(w)>=0)x=s_rep(x,w,t[i]);i++;b+=62}}}return x");
w.s_fe=new Function("c","return s_rep(s_rep(s_rep(c,'\\\\','\\\\\\\\'),'\"','\\\\\"'),\"\\n\",\"\\\\n\")");
w.s_fa=new Function("f","var s=f.indexOf('(')+1,e=f.indexOf(')'),a='',c;while(s>=0&&s<e){c=f.substring(s,s+1);if(c==',')a+='\",\"';else if((\"\\n\\r\\t \").indexOf(c)<0)a+=c;s++}return a?'\"'+a+'\"':"
+"a");
w.s_ft=new Function("c","c+='';var s,e,o,a,d,q,f,h,x;s=c.indexOf('=function(');while(s>=0){s++;d=1;q='';x=0;f=c.substring(s);a=s_fa(f);e=o=c.indexOf('{',s);e++;while(d>0){h=c.substring(e,e+1);if(q){i"
+"f(h==q&&!x)q='';if(h=='\\\\')x=x?0:1;else x=0}else{if(h=='\"'||h==\"'\")q=h;if(h=='{')d++;if(h=='}')d--}if(d>0)e++}c=c.substring(0,s)+'new Function('+(a?a+',':'')+'\"'+s_fe(c.substring(o+1,e))+'\")"
+"'+c.substring(e+1);s=c.indexOf('=function(')}return c;");
c=s_d(c);if(e>0){a=parseInt(i=v.substring(e+5));if(a>3)a=parseFloat(i)}else if(m>0)a=parseFloat(u.substring(m+10));else a=parseFloat(v);if(a<5||v.indexOf('Opera')>=0||u.indexOf('Opera')>=0)c=s_ft(c);if(!s){s=new Object;if(!w.s_c_in){w.s_c_il=new Array;w.s_c_in=0}s._il=w.s_c_il;s._in=w.s_c_in;s._il[s._in]=s;w.s_c_in++;}s._c='s_c';(new Function("s","un","pg","ss",c))(s,un,pg,ss);return s}
function s_giqf(){var w=window,q=w.s_giq,i,t,s;if(q)for(i=0;i<q.length;i++){t=q[i];s=s_gi(t.oun);s.sa(t.un);s.setTagContainer(t.tagContainerName)}w.s_giq=0}s_giqf()
