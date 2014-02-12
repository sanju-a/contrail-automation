
if (window.ignoreSwitchProtocol) {
	  // do nothing
}
else {
	  if (window.isSSL){
			if ((isSSL!=0)&& location.protocol != 'https:') {
				  window.location= 'https://' + location.host + location.pathname + location.search
			}
			else if ((isSSL==0) && location.protocol != 'http:') {
				  window.location= 'http://' + location.host + location.pathname + location.search
			}
	  }
	  else if (!window.isSSL && location.protocol != 'http:'){
			window.location= 'http://' + location.host + location.pathname + location.search
	  }
	  else {
			// do nothing
	  }
}

// TelstraGlobal object stub
var TelstraGlobal = {};

// Controls display of various header elements for homepage & application templates
TelstraGlobal.header_load = function(){
	TelstraGlobal.initialise_homepage();
	TelstraGlobal.initialise_application();
};

TelstraGlobal._el = function(id){
	return document.getElementById(id);
}

TelstraGlobal.initialise_homepage = function(){
	if(TelstraGlobal.is_homepage){

		// Set current global nav item to 'Telstra home'
		TelstraGlobal._el('global-tab-personal').className = '';
		TelstraGlobal._el('global-tab-home').className = 'current';

		// Hide channel logo
		TelstraGlobal._el('header-channel').style.display = 'none';
		TelstraGlobal._el('header-logo').style.borderRight = 'none';

		// Hide primary navigation
		TelstraGlobal._el('primary-navigation').style.display = 'none';

		// Show pay my bill, Contact us & Help & suppoot nav buttons
		TelstraGlobal._el('hsn-pay-my-bill').style.display = 'inline-block';
		TelstraGlobal._el('hsn-contact-us').style.display = 'inline-block';
		TelstraGlobal._el('hsn-help-support').style.display = 'inline-block';

	}
};

TelstraGlobal.initialise_application = function(){

	if(TelstraGlobal.is_application || (typeof telstra_application != 'undefined' && telstra_application)){

		// Remove header top margin
		document.body.style.marginTop = 0;
		TelstraGlobal._el('header').style.marginTop = 0;

		// Hide channel logo
		TelstraGlobal._el('header-channel').style.display = 'none';
		TelstraGlobal._el('header-logo').style.borderRight = 'none';

		// Hide various bits of nav
		TelstraGlobal._el('global-nav').style.display = 'none';
		TelstraGlobal._el('bp-directories-nav').style.display = 'none';
		TelstraGlobal._el('header-search').style.display = 'none';
		TelstraGlobal._el('header-support-nav').getElementsByTagName('ul')[0].style.display = 'none';

		// Hide primary navigation
		var pn = TelstraGlobal._el('primary-navigation');
		pn.innerHTML = '';
		pn.style.height = 0;
		pn.style.padding = 0;
		pn.style.borderTop = '4px solid #757575';
		pn.style.background = 'none';

	}

	if(typeof telstra_global_loginState != 'undefined'){
		checkWelcomeMessage(telstra_global_loginState);
	}

};





// From /shop/global/themes/v9/javascript/header.js


/**
 * Sets a Cookie with the given name and value.
 *
 * name       Name of the cookie
 * value      Value of the cookie
 * [expires]  Expiration date of the cookie (default: end of current session)
 * [path]     Path where the cookie is valid (default: path of calling document)
 * [domain]   Domain where the cookie is valid
 *              (default: domain of calling document)
 * [secure]   Boolean value indicating if the cookie transmission requires a
 *              secure transmission
 */
function setCookie(name, value, expires, path, domain, secure)
{
    document.cookie= name + "=" + escape(value) +
        ((expires) ? "; expires=" + expires.toGMTString() : "") +
        ((path) ? "; path=" + path : "") +
        ((domain) ? "; domain=" + domain : "") +
        ((secure) ? "; secure" : "");
}

/**
 * Gets the value of the specified cookie.
 *
 * name  Name of the desired cookie.
 *
 * Returns a string containing value of specified cookie,
 *   or null if cookie does not exist.
 */
function getCookie(name)
{
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1)
    {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else
    {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1)
    {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}

/**
 * Deletes the specified cookie.
 *
 * name      name of the cookie
 * [path]    path of the cookie (must be same as path used to create cookie)
 * [domain]  domain of the cookie (must be same as domain used to create cookie)
 */
function deleteCookie(name, path, domain)
{
    if (getCookie(name))
    {
        document.cookie = name + "=" + 
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}
function logout()
{
	deleteCookie("globalFirstName");

	this.location.href = "/global/includes/logout.html";
}

function writeGlobalHeaderWelcomeMessage(firstname)
{
	login = '';
	mod = false;
	if (firstname == null)
	{
		if ((typeof(telstra_global_tabId) != "undefined") && (telstra_global_tabId == 0))
		{	
			// Homepage is Tab 0.
			//login += '<img src="/global/images/txt_welcome.gif" alt="Welcome to Telstra">';
		}
	}
	else
	{
		mod = true;
		login += '<ul class="nav-horiz">';
		//login += '<span class="">Welcome</span>';
		if (firstname != "#ANONYMOUS#")
		{
			//login += ' <span class="name"><a href="https://telstra.com/tcoma/registration.asp">' + firstname + '</a></span>';
			login += ' <li class="li-welcome">Welcome <a href="https://telstra.com/tcoma/registration.asp">' + firstname + '</a></li>';
		} else {
			//login += '<span class="name">Welcome</span>';
			login += '<li class="li-last">Welcome</li><li><a href="https://telstra.com/tcoma/registration.asp">Login</a></li><li class="li-last"><a href="https://telstra.com/tcoma/registration.asp">Register</a></li>';
		}
		if ((typeof(telstra_global_header_displaytabs) == "undefined") || (telstra_global_header_displaytabs == true)) 
		{
			// KAZ Tom Connolly - support for SSO
			// Need to modify the logout so that it is not displayed during 
			// the checkout screens but still displayed in the shop online screen.
			// Also allow a 'custom' logout routine that logs the user out of
			// Siteminder, as in the current telstra phase 0 static site.
			// And logs the user out of WCS application.
			var default_fn = "logout()";
			if (typeof(telstra_global_header_fn_logout) != "undefined") 
			{
				default_fn = telstra_global_header_fn_logout;
			}
			
			// display the logout link if the tabs are displayed (unable to logout when tabs not displayed)

			//document.write(' <span class="bluebar">|</span> <a id="logout" href="javascript:logout();">Logout</a>');
			//login += ' | <a id="logout" href="javascript:'+default_fn+';">Logout</a>';
			if (firstname != "#ANONYMOUS#") {
				login += '<li class="li-last"><a id="logout" href="javascript:'+default_fn+';">Logout</a></li>';
			}
		login += '</ul>';
		}
	}
	if (mod == true) {
		//try {document.getElementById('headerLogin').innerHTML = login;}
		try {document.getElementById('header-support-nav').innerHTML = '<div class="welcome-message">' + login + '</div>';}
		catch (e) {}
 		
		// show the users status and remove the 'flyLogin' button 
		//document.getElementById('headerLoginWrap').style.display  = 'block'; 
		//document.getElementById('flyLogin').style.display  = 'none'; 
//		document.getElementById('header-support-nav').getElementsByTagName('ul')[0].style.display = 'none';


	}

}

function checkWelcomeMessage(telstra_global_loginState){

	// BEGIN HEADER WELCOME MESSAGE LOGIC
	var globalFirstName = getCookie("globalFirstName");
	if ((typeof(telstra_global_loginState) != "undefined") && (telstra_global_loginState == 1))
	{
		// Check for page defined firstname
		if (typeof(telstra_global_header_firstname) != "undefined")
		{
			setCookie("globalFirstName", telstra_global_header_firstname);
			writeGlobalHeaderWelcomeMessage(telstra_global_header_firstname);
		}
		else 
		{
			if (globalFirstName == null)
			{
				setCookie("globalFirstName", "#ANONYMOUS#");
				globalFirstName = "#ANONYMOUS#";
			}
			writeGlobalHeaderWelcomeMessage(globalFirstName);
		}
	}
	else if ((typeof(telstra_global_loginState) != "undefined") && (telstra_global_loginState == -1))
	{
		// Remove cookie if it exists
		if (globalFirstName != null)
		{
			deleteCookie("globalFirstName");
		}
		writeGlobalHeaderWelcomeMessage(null);
	}
	else
	{
		// Check if cookie exists
		if (globalFirstName == null)
		{
			var telstra_global_loginState = -1;
		}
		else
		{
			var telstra_global_loginState = 1;
		}
		writeGlobalHeaderWelcomeMessage(globalFirstName);
	}
}
