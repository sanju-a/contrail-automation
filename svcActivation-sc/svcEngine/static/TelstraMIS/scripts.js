/*jshint scripturl:true*/

/**
 * MOCK CONSOLE
 * Avoid `console` errors in browsers that lack a console
 */
(function() {
	var method;
	var noop = function () {};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

/**
 * UTILITIES
 */
var DEBUG = (function() {
	var pad = function (s) {return (s.length == 1 ? '0' + s : s);},
		t = new Date(),
		y = t.getFullYear().toString(),
		m = pad((t.getMonth() + 1).toString()), // month is index returned in JS :)
		d = pad(t.getDate().toString()),
		hash = window.location.hash.replace('#', '');

	return ((d + m + y) === hash.replace('debug-', ''));
})();
	
function debugLog(msg) {
	if(DEBUG)
		console.log(msg);
}

//===========================================================================START OF SURVEY-JS
function getSecondsSinceEnteredSite(enteredSiteTimeMillis) {
	var d = new Date();
	var currentTimeMillis = d.getTime();

	return Math.round((currentTimeMillis - enteredSiteTimeMillis) / 1000);
}

function isInternal(url) {
	// CALLS TO JS
	if (url.startsWith('javascript:')) {
		// all js functions called from links in our application do not
		// leave the site
		return true;
	}

	// ONCLICK LINKS
	if (url.startsWith('#') || url === '') {
		// these links probably have onclick attributes - they do not leave
		// the site
		return true;
	}

	// ABSOLUTE LINKS
	if (url.startsWith('http')) {

		var surveyWinLocation = window.location.href;
		surveyWinLocation = surveyWinLocation.substring(surveyWinLocation
				.indexOf("://") + 3);
		surveyWinLocation = surveyWinLocation.substring(0,
				surveyWinLocation.indexOf("/"));

		var surveyHomeDomain = surveyWinLocation;

		if (url.startsWith('http://' + surveyHomeDomain) || url.startsWith('https://' + surveyHomeDomain)) {
			return true;
		} else {
			return false;
		}
	}

	// All remaining URLs are relative ones, which are internal.
	return true;
}

String.prototype.startsWith = function(str) {
	return (this.match("^" + str) == str);
};

function readCookie(name) {
	var cookies = {};
	if (document.cookie && document.cookie !== '') {
		var split = document.cookie.split(';');
		for ( var i = 0; i < split.length; i++) {
			var name_value = split[i].split("=");
			name_value[0] = name_value[0].replace(/^ /, '');
			cookies[decodeURIComponent(name_value[0])] = decodeURIComponent(name_value[1]);
		}
	}

	for ( var cname in cookies) {
		if (cname == name) {
			return cookies[cname];
		}
	}
	return null;
}

/**
 * SURVEY CODE
 */
function SurveyPage(freq, popUpInSeconds, onPageEnterPopupInSeconds, surveyUrl, enteredSiteCookieName) {

	this._requestPageUrl = surveyUrl;
	this._enteredSiteCookieName = enteredSiteCookieName;
	
	// Timings of Popup
	this._freq = freq;
	this._popUpInSeconds = popUpInSeconds;
	this._onPageEnterPopupInSeconds = onPageEnterPopupInSeconds;

	this._surveyToday = new Date();
}

	SurveyPage.prototype.attachLinkOnClickEvent = function() {
		var _this = this;
		// links
		$('a').click(function() {
			_this.setClickedLinkCookie();
		}); // attach onsubmit on to all forms
		$('form').submit(function() {
			_this.setClickedLinkCookie();
		});
	};

	SurveyPage.prototype.doSession = function() {
		var enteredSiteDate = readCookie(this._enteredSiteCookieName);
		var hasClickedOnLink = readCookie(SURVEY_CLICKED_ON_LINK_COOKIE);

		if (enteredSiteDate === null) {
			debugLog("enteredSiteDate cookie not set");
			this.setEnteredSiteCookie();
			this.attachLinkOnClickEvent();
		} else if (hasClickedOnLink === null) {
			debugLog("enteredSiteDate session cookie set, attaching onclick event");
			this.attachLinkOnClickEvent();
		} else {
			debugLog("Set survey timer");
			var secondsSinceEnteredSite = getSecondsSinceEnteredSite(enteredSiteDate);
			debugLog("secondsSinceEnteredSite: " + secondsSinceEnteredSite);

			var secondsUntilTrigger = this._popUpInSeconds - secondsSinceEnteredSite;
			debugLog("secondsUntilTrigger: " + secondsUntilTrigger);
			if (secondsUntilTrigger < this._onPageEnterPopupInSeconds) {
				secondsUntilTrigger = this._onPageEnterPopupInSeconds;
			}
			debugLog("secondsUntilTrigger: " + secondsUntilTrigger);
			var _this = this;
			setTimeout(function() { _this.surveyOpenPopup(); }, secondsUntilTrigger * 1000);
		}
	};

	SurveyPage.prototype.setEnteredSiteCookie = function() {
		var d = new Date();
		var timeMillis = d.getTime();
		debugLog("setEnteredSiteCookie: " + timeMillis);
		document.cookie = this._enteredSiteCookieName + "=" + timeMillis + "; path=/business-enterprise;";
	};

	SurveyPage.prototype.setClickedLinkCookie = function() {
		debugLog("setClickedLinkCookie");
		document.cookie = SURVEY_CLICKED_ON_LINK_COOKIE + "=1; path=/business-enterprise;";
	};


	SurveyPage.prototype.surveyOpenPopup = function() {
		// added by d637853
		var url = '';

		pick = 1 + Math.floor(Math.random() * 100);
		vote = 1 + Math.floor(99 / Number(this._freq));

		if (vote >= pick) {
			if (typeof (surveyRequestWindow) == "undefined" || !surveyRequestWindow) {
				// @BUG: popup survey replacing the page already openned by another process
				// @FIX: http://stackoverflow.com/a/2455480/243730
				var surveyRequestWindow = TelstraGlobal.launch_popup('', 700, 540, /* resizable: */false, /* scrollbars: */	true);

				try {
					url = surveyRequestWindow.location.toString();
				} catch (e) {
					debugLog('Popup window access error.');
					url = 'none';
				}

				// see whether the popup window is already openned
				if(url === 'about:blank' || url === ''){
					debugLog('Popup window not found. Opening the URL.');

					// and set the URL to the survey content
					surveyRequestWindow.location.replace(this._requestPageUrl);
					surveyRequestWindow.focus();
				} else {
					debugLog('Popup window found. Existing URL will not be overriden.');
				}
			}
		}
	};

	
/**
 * SURVEYPOPUP
 */
function SurveyPopup(surveyUrl, daysForYes, daysForNoClose, daysForLater) {
	this._surveyUrl = surveyUrl;
	this._daysForYes = daysForYes;
	this._daysForNoClose = daysForNoClose;
	this._daysForLater = daysForLater;
	this._surveyToday = new Date();
			
	this._expiryDayCookie = SURVEY_EXPIRY_DAY_COOKIE;
	this._userResponseCookie = SURVEY_USER_RESPONSE_COOKIE;
}
	
	SurveyPopup.prototype.surveyDecline = function() {
		debugLog("surveyDecline");
		var survDay = this._daysForNoClose;
		var setDay = new Date();
		setDay.setDate(this._surveyToday.getDate() + Number(survDay));

		document.cookie = this._userResponseCookie + '=declined; expires=Mon, 31-Dec-2012 23:59:59 GMT; path=/business-enterprise;';
		document.cookie = this._expiryDayCookie + '=' + setDay.toString() + '; expires=Mon, 31-Dec-2029 23:59:59 GMT; path=/business-enterprise;';
	};

	SurveyPopup.prototype.surveyLater = function() {
		debugLog("survey_later");
		var survDay = this._daysForLater;
		var setDay = new Date();
		setDay.setDate(this._surveyToday.getDate() + Number(survDay));

		document.cookie = this._userResponseCookie+'=later; expires=Mon, 31-Dec-2012 23:59:59 GMT; path=/business-enterprise;';
		document.cookie = this._expiryDayCookie + '=' + setDay.toString() + '; expires=Mon, 31-Dec-2029 23:59:59 GMT; path=/business-enterprise;';
	};

	SurveyPopup.prototype.surveyClosePopup = function() {
		debugLog("surveyClosePopup");
		var cookieExist = readCookie(this._expiryDayCookie);
		if (cookieExist || cookieExist !== null) {
			return;
		}

		var survDay = this._daysForNoClose;
		var setDay = new Date();
		setDay.setDate(this._surveyToday.getDate() + Number(survDay));

		document.cookie = this._userResponseCookie+'=declined; expires=Mon, 31-Dec-2012 23:59:59 GMT; path=/business-enterprise;';
		document.cookie = this._expiryDayCookie + '=' + setDay.toString() + '; expires=Mon, 31-Dec-2029 23:59:59 GMT; path=/business-enterprise;';
	};

	SurveyPopup.prototype.surveyAccept = function() {
		debugLog("surveyAccept");
		if (typeof (surveyMonkeyWindow) == "undefined" || !surveyMonkeyWindow) {
			surveyMonkeyWindow = this.surveyOpenPopup();
		} else if (typeof (surveyMonkeyWindow) == "object" || surveyMonkeyWindow || surveyMonkeyWindow !== null) {
			$(surveyMonkeyWindow).focus();
		}
		if (typeof (surveyMonkeyWindow) == "object" || surveyMonkeyWindow || surveyMonkeyWindow !== null) {
			this.surveyAcceptCreateCookie();
		}
	};

	SurveyPopup.prototype.surveyAcceptCreateCookie = function() {
		debugLog("survey_AcceptCreateCookie");
		var survDay = this._daysForYes;
		var setDay = new Date();
		setDay.setDate(this._surveyToday.getDate() + Number(survDay));

		// We only set the accepted cookie after the user push the YES
		// button on
		// popup
		document.cookie = this._userResponseCookie+'=accepted; expires=Mon, 31-Dec-2012 23:59:59 GMT; path=/business-enterprise;';
		document.cookie = this._expiryDayCookie + '=' + setDay.toString() + '; expires=Mon, 31-Dec-2029 23:59:59 GMT; path=/business-enterprise;';
	};

	SurveyPopup.prototype.surveyOpenPopup = function () {
		debugLog("surveyOpenPopup");
		var width = 800;
		var height = 800;

		var screenWidth = screen.width;
		var screenHeight = screen.height;
		if (width >= screenWidth) {
			width = screenWidth - 100;
		}
		if (height >= screenHeight) {
			height = screenHeight - 200;
		}
		
		
		var windowProp = 'location=no, toolbar=no, menubar=no, width='+width+', height='+height+', scrollbars=yes, resizable=yes';
		return window.open(this._surveyUrl, 'surveyWindow', windowProp);
	};
	
	function initEvents(surveyPopup) {
		$(window).unload(function() {
			surveyPopup.surveyClosePopup();
		});

		$(document).ready(function() {
			$("#survey-accept-btn").click(function(e) {
				debugLog("survey-accept-btn - clicked");
				surveyPopup.surveyAccept();
				setTimeout(function() {
					parent.window.close();
				}, 5);
				return false;
			});
			$("#survey-decline-btn").click(function(e) {
				debugLog("survey-decline-btn - clicked");
				surveyPopup.surveyDecline();
				setTimeout(function() {
					window.close();
				}, 5);
				return false;
			});
			$("#survey-later-btn").click(function(e) {
				debugLog("survey-later-btn - clicked");
				surveyPopup.surveyLater();
				setTimeout(function() {
					window.close();
				}, 5);
				return false;
			});
		});
	}


/**
 * KEYNOTE SURVEY
 */
var KEYNOTE_PAGES = {};

KEYNOTE_PAGES['ss-be-products-services'] =  'FE7D0DA3CEB44253B156C96D1B29A629business';
KEYNOTE_PAGES['ss-be-bundles'] =  '08486E682C424712B6276D12AC778558bundles';
KEYNOTE_PAGES['ss-be-enterprise-solutions'] = 'A4774B8E0C384A378E5203E3588174AAenterprise';
KEYNOTE_PAGES['ss-be-resource-insights'] = '8739060BFF3440ACB22D07C1581916CBresource';
KEYNOTE_PAGES['ss-be-account-services'] = '5C88070C436B408B8D9206B4C5E4C7EAaccount';
KEYNOTE_PAGES['ss-be-customer-tools'] = '946103714E064DEA9D2B9865A23ABFB1tools';
KEYNOTE_PAGES['ss-be-account-ss-tools'] = '87176AA4625147B4A4CF079E155A5DD1myacct';

function KeynoteSurvey() {}
		
	KeynoteSurvey.prototype.HandleKeynoteIntercept = function() {
		var keynoteInterceptLikelihood = 1;
		var keynoteInterceptTaskKey = KEYNOTE_PAGES[g_ssSourceNodeId];
		var keynoteInterceptType = 'Layer';

		debugLog("window.location.pathname: " +window.location.pathname);
		debugLog("ucm page id: "+g_ssSourceNodeId);
		debugLog("keynoteInterceptTaskKey: "+keynoteInterceptTaskKey);
			
		try {
			if (Math.random() >= (keynoteInterceptLikelihood*5)) return;
			var s = document.createElement('script');
			s.src = 'http://webeffective.keynote.com/applications/intercept/filter_page.asp?inv=' + keynoteInterceptTaskKey + '&type=' + keynoteInterceptType + '&rate=' + keynoteInterceptLikelihood + '&domain=' + window.location.hostname + '&max=5';
			document.body.insertBefore(s, document.body.firstChild);
			window.keynoteConnectorWindow = 'primary';
		}
		catch(e){}
	};

	KeynoteSurvey.prototype.doKeynote = function() {
		var _this = this;
		this.setKeynoteCookie();

		if (window.attachEvent) {
			window.attachEvent('onload',_this.HandleKeynoteIntercept());
		} else {
			window.addEventListener('load',_this.HandleKeynoteIntercept(),false);
		}
	};

	KeynoteSurvey.prototype.setKeynoteCookie = function() {
		debugLog("setKeynoteCookie");
		document.cookie = KEYNOTE_SESSION_COOKIE + "=1; path=/business-enterprise;";
	};
	

/**
 * DECISIONMAKER
 */
function DecisionMaker() {
	this._surveyToday = new Date();
}

	DecisionMaker.prototype.isTimeToShowAgain = function(expiryDayCookie) {
		var previousExpires = readCookie(expiryDayCookie);
		var previousExpiresDate = new Date(previousExpires);
		return (this._surveyToday > previousExpiresDate);
	};
	
	DecisionMaker.prototype.isInitNewSession = function() {
		var initNewSession = false;
		var expiryDayCookie = SURVEY_EXPIRY_DAY_COOKIE;
		var previousExpires = readCookie(expiryDayCookie);
		debugLog("previousExpires: " + expiryDayCookie);

		var newToTheSite = previousExpires === null;
		if (newToTheSite || this.isTimeToShowAgain(expiryDayCookie)) {
			debugLog("init new session");
			initNewSession = true;
		}
		return initNewSession;
	};

	DecisionMaker.prototype.isKeynoteSession = function() {
		for(var key in KEYNOTE_PAGES){
			if(key.indexOf(g_ssSourceNodeId) != -1){
				debugLog("Keynote page "+window.location.pathname);
				return true;
			}
		}
		
		return false;
	};

	DecisionMaker.prototype.makeDecision = function() {

		var hasClickedOnLink = readCookie(SURVEY_CLICKED_ON_LINK_COOKIE);
	
		if (this.isKeynoteSession() && !hasClickedOnLink) {
			return KEYNOTE_SESSION;
		}
		
		if (this.isInitNewSession()) {
			return BE_SESSION;
		}
		return DO_NOTHING;
	};

	
/**
 * ON PAGE LOAD HANDLERS
 */
// Common
var SURVEY_CLICKED_ON_LINK_COOKIE = 'survey_clicked_on_link';
var SURVEY_COOKIE_PATH = 'business-enterprise';
var SURVEY_EXPIRY_DAY_COOKIE = 'expiryday';
var SURVEY_USER_RESPONSE_COOKIE = 'survey';

// BE Only
var SURVEY_ENTERED_SITE_COOKIE = 'survey_enter_site';
var REQUEST_PAGE_URL = "/business-enterprise/survey-request/index.htm";

// Decision Maker
var BE_SESSION = 2;
var DO_NOTHING = 3;

// Keynote Survey
var	KEYNOTE_SESSION = 4;
var KEYNOTE_SESSION_COOKIE = 'keynote_session';

$(window).load(function() {
	if (surveyPageType == "PT_V10_GENERIC_TEMPLATE") {
		if(readCookie(KEYNOTE_SESSION_COOKIE) !== null) {
			return;
		}

		var decision = new DecisionMaker().makeDecision();
		if(decision == KEYNOTE_SESSION){
			debugLog("KEYNOTE_SESSION");
			var keynoteSurvey = new KeynoteSurvey();
			keynoteSurvey.doKeynote();
		}else if(decision == BE_SESSION && surveyEnabled == "1"){
			debugLog("BE_SESSION");
			var surveyPage = new SurveyPage(surveyFreq, surveyPopupInSeconds, surveyOnPageEnterPopupInSeconds, REQUEST_PAGE_URL, SURVEY_ENTERED_SITE_COOKIE);
			surveyPage.doSession();
		}else {
			debugLog("DO_NOTHING");
		}
	} else if (surveyPageType == "PT_V10_GENERIC_POPUP_TEMPLATE" && surveyEnabled == "1") {
		debugLog("BE POPUP");
		var surveyPopup = new SurveyPopup(surveyURL, surveyDaysForYes, surveyDaysForNoClose, surveyDaysForLater);
		initEvents(surveyPopup);
	}
});

//=============================================================================END OF SURVEY-JS

//===================================================================START OF MINI-ACCORDION-JS
/**
 * Manages the Mini Accordion (progressive disclosure) behaviour
 * @description set variables to change selectors. (default UL > LI > SPAN, DIV)
 * @example
 * <ul class="miniAccordion">
 *	<li><span>TITLE 1</span>
 *		<div>DESCRIPTION 1</div>
 *	</li>
 *	<li><span>TITLE 2</span>
 *		<div>DESCRIPTION 2</div>
 *	</li>
 *	<li><span>TITLE N</span>
 *		<div>DESCRIPTION N</div>
 *	</li>
 * </ul>
 */
$(document).ready(function() {
			
	var	containerElm = "ul.miniAccordion",
		targetElm = "li",
		targetElmClass = "miniAccordionItem",
		headerElm = "span",
		headerElmClass = "miniAccordionHeader",
		headerElmEventHandler = "a",
		contentElm = "div",
		contentElmClass = "miniAccordionBody",
		expandClass = "expanded",
		tDuration = 250;
	
	/**
	 * iterate over every mini accordion and do the DOM append and attach the click event
	 */
	$(containerElm + ">" + targetElm).each(function(event) {
		var $this = $(this);
		$this.addClass(targetElmClass);
		
		$this.children(contentElm).addClass(contentElmClass).hide();
		
		$this.children(headerElm).each(function() {
			var $this = $(this);
			$this.replaceWith('<' + headerElm + ' class="' + headerElmClass + '"><' + headerElmEventHandler + ' href="#">' + $this.text() + '</' + headerElmEventHandler + '></' + headerElm + '>');
		});
	});
	
	var resizeFix = false;
	
	$(containerElm + ">" + targetElm + ">" + headerElm + "." + headerElmClass + ">" + headerElmEventHandler).live("click", function(event) {
		event.preventDefault();
		
		if (!resizeFix) {
			$(containerElm).parents("div.container-row").find("div.container > div.content.clearfix > div.clearfix").css("height", "auto");
			resizeFix = true;
		}
	
		$(this).parent(headerElm).next(contentElm).slideToggle(tDuration, function() {
			var $this = $(this);
			if ($this.is(":visible")) {
				$this.parent(targetElm).addClass(expandClass);
			} else {
				$this.parent(targetElm).removeClass(expandClass);
			}
		});
		
		event.stopPropagation();
	});
	
});
//=====================================================================END OF MINI-ACCORDION-JS
