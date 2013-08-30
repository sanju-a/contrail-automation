/* FYI: SNIPET FROM MAIN PAGE - IT SETS PARAMETERS COMING FROM CALLING PAGE.
<script language="javascript">
	requestSiteId="<!--$ requestSiteId-->";//request siteId from global header
	searchFormSubmited="<!--$ searchFormSubmited-->";
	
	inpSearch="<!--$ inpSearch-->";//search term from global header
	inpSearch=decodeURIComponent(inpSearch);
		
	searchTermInSimple="<!--$ searchTermInSimple-->";//search term from simple/advacned page
	searchTermInSimple=decodeURIComponent(searchTermInSimple);
	
	xsltFile="/search/download/document/gsa-stylesheet.xslt"; //xslt file url
</script>
*/

var xslt; //holds the xsl file content

var timeoutValue = 10000; // 10 seconds timeout.
var gsa_search_timeout = 0; //to execute s.gsasearch() function once
var gsa_main_request;

var gsa_main_xml;

var main_site;
var main_client;
var feedback_submitted = false;
var ss_seq = [ 'g' ];
var ss_form_element = 'suggestion_form';
var ss_popup_element = 'search_suggest';
var ss_allow_debug = false;
var ss_wait_millisec = 0;
var ss_delay_millisec = 0;
var ss_g_one_name_to_display = ""; 
var ss_g_more_names_to_display = ""; 
var ss_g_max_to_display = 5;
var ss_max_to_display = 5;
var SS_OUTPUT_FORMAT_RICH = 'rich';
var ss_protocol = SS_OUTPUT_FORMAT_RICH;
var ss_allow_non_query = true;
var ss_non_query_empty_title = "No Title"; 
var SS_OUTPUT_FORMAT_LEGACY = 'legacy';
var SS_OUTPUT_FORMAT_OPEN_SEARCH = 'os';

var searchText = "";

var page_query = "";
var page_site = "TDigital_Consumer";
var page_start = "0";

var spellingSuggestion = "";
var spellingSuggestionOriginal = "";
var spellingSuggestionShow = "YES";

var searchReset = "";
var test = "";

/*var searchLoc = window.location.search;
if (searchLoc.indexOf('.') != -1 || searchLoc.indexOf('alert') != -1){
    alert("Illegal characters found in Search term, redirecting to Search page.");
    window.location = "/search/simple-search/index.htm";
}*/

var inpSearch = url_query('inpSearch');
var searchLoc = inpSearch;
searchLoc = encodeURIComponent(searchLoc);
searchLoc = searchLoc.toLowerCase();
var currUrl = location.protocol + "//" + location.host + location.pathname;

//if (searchLoc.indexOf('.') != -1 || searchLoc.indexOf('alert') != -1){
    //window.location = currUrl;
//}

// This file includes the javascript functions for the simple and advanced
// search options.
$(function () {

    //hide main-column and right-columns on page-load
    $("#main-module").hide();
	
	try {
    if (window.location.pathname.indexOf('search') >= 0)

    {
        $("#header").find(".header-loc").html("<span class=\"header-loc\"><a href=\"/search/simple-search/index.htm\">Search</a></span>");
        $("#global-nav").find("li").each(function(){$(this).find("a").removeClass("active");$(this).removeClass("active")});
        $("#global-nav").find("li").first().find("a").addClass("active");
        $("#site-label").find("a").attr("href","/search/simple-search/index.htm");
    }
    } catch(e) {}


    xslt = loadXSLFile();

    selectSiteIdOnLoad();

    //bind onclick event to open feedback form
    $("#feedback-form a").live("click", function () {
        $("#feedback-form").css("width","920");
		$("#feedback-form h2").addClass("feedbackh2");
		$("#feedback-form form").show();
		return false;
    });
	$("#main-col a").live("mousedown", function (ev) {
		cl_link_clicked(ev);
	});

    populateSearchTerm();

    fill_GSA_Collection_Client();

    var result = handleNoSearchTerm("load");

    if (result) {
        performSearch(null);
    } 

    // Perform search, when user clicks on a synonym.
    $(".synonymsValue").live("click", function () {
        $("#q").val($(this).text());
        performSearch(null);
    });

    // Perform search, when user clicks on spelling search.
    $(".spellingsuggestion").live("click", function () {
        $("#q").val($(this).text());
        spellingSuggestionShow = "NO";
        spellingSuggestionOriginal = "-";
        spellingSuggestion = "";
        performSearch(null);
    });

    $(document).click(function (event) {
        if ($(event.target).closest("#search_suggest").length == 0) {
            $("#search_suggest").css("visibility", "hidden");
        }
        if ($(event.target).closest("#search_suggest_header").length == 0) {
            $("#search_suggest_header").css("visibility", "hidden");
        }
    });

    $("#q").focus(function () {
        $("#search_suggest_header").css("visibility", "hidden");
    });

    $("#search-telstra-keywords").focus(function () {
        $("#search_suggest").css("visibility", "hidden");
    });

    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    if (isiPad) {
        $("#q").css("width", "262px"); ;
    }
});


// This function retrieves the xslt file and trigges the transform process.	
function performSearch(url) {
	if (!handleNoSearchTerm("push-go")) {
		return false; // validation failed, return.
	}

	//$("#ssOriginalValueSpan").css("display","none");				
	
	fill_GSA_Collection_Client();
	
	ajaxCallToGSA(url);
	
	page_query = encodeURIComponent($("#q").val());
	page_site = main_site;	

	
	// Log the load of the page.
	cl_clk(null, page_query, new String('load'), null, null, page_start, page_site, null);
	
	if(typeof s === 'object' && typeof s.gsaSearch === 'function' && gsa_search_timeout == 0){
		s.gsaSearch()
		gsa_search_timeout = 1;
	};	

	
}

/* Loads the xslt file content and sets it in the <code>xslt</code> variable */
function loadXSLFile() {
	var xsltContent = null;
	$.ajax({
		url: xsltFile,   		
		dataType: "text" ,
		type: "GET",
		async: false, //make sure this call doesn't end until the file is loaded.
		timeout: timeoutValue,
		error: function(jqXHR, textStatus, errorThrown){   	
			errorPageRedirect();
		}, 
		success: function(data){   				
			if (window.ActiveXObject) {
				xsltContent = new ActiveXObject("Microsoft.XMLDOM");       			
				xsltContent.async = false;       			
				xsltContent.loadXML(data);       			
			} else {
				xsltContent = data;
				var parser = new DOMParser();
				xsltContent = parser.parseFromString(data, 'text/xml');
			}     			
		}
	});

	return xsltContent;
}

// This function retrieves the xml search results, for 3 searches
// main, faqs and crowd support.
function ajaxCallToGSA(mainUrl) {
    var selectedSiteId = $("#siteId").val();
    var caption = $("#caption").val();
	
	searchText = encodeURIComponent($("#q").val());

	// Depending upon text search type, append parameter.
	var textSearchTypeQuerySnippet = "";
	switch($("input:radio[name=textSearch]:checked").attr("id")) {
		case "exact-phrase":
            textSearchTypeQuerySnippet = "&as_epq=" + searchText;
            break;
        case "one-word":
            textSearchTypeQuerySnippet = "&as_oq=" + searchText;
            break;
    }

	//start building the request URL
	var query = "/gsa-search/search?&btnG=Go&output=xml_no_dtd&access=p&filter=p&getfields=*&searchText=" + searchText + "&q=";
	
	if (textSearchTypeQuerySnippet == "") { //if it's search ALL should use and, add Q
		query = query + searchText;
	} else { // if it's phrase or ANY, don't set the 'q' param, but set the rest ones. 
	    query = query + textSearchTypeQuerySnippet;
	}
	
	if(feedback_submitted) query = query +"&feedbackSubmit=Submit";
	
    //add query snippet for time based filtering
    //query = query + getTimeRangeQuerySnippet(); commenting this line as time filtering doesn't work anyway. TODO: uncomment whenever this gets handled on GSA side.

    //add query snippet for file type based filtering
	var fileTypeQuerySnippet = "";
	$('[name=docType]:checked').each(function() {
		// If all do nothing, else append filetype.
		if ($(this).val() != "all") {
			if ($(this).val() == "web-pages") {
				fileTypeQuerySnippet = fileTypeQuerySnippet + "&as_filetype=htm&as_filetype=html";
			} else {
   				fileTypeQuerySnippet = fileTypeQuerySnippet + "&as_filetype="+$(this).val();
   			}
   		}
 	});
    query = query + fileTypeQuerySnippet;

    //The only time that clickOnPagination is true, is just for clicking on pagination or change result per page
    var clickOnPagination=false;
    if(mainUrl != undefined && mainUrl && mainUrl != null){
        gsa_main_request = mainUrl;
        clickOnPagination=true;
    } else {
        gsa_main_request = query + "&site=" + main_site + "&numgm=5&client=" + main_client
            + "&template=main_results&telstrasiteid=" + selectedSiteId + "&searchId=main" + "&caption=" + caption;
    }
	updateContent(gsa_main_request);
}

/**
 * Get query string snippet to be sent to GSA in order to filter by date based on selection made by user.
 * Note that for date based filtering there is no specific request parameter, but the returned value of this function
 * should be added to the searched text.
 */
function getTimeRangeQuerySnippet() {
	var selectedTimeSearchType = $("input:radio[name=timeSearch]:checked").attr("id");
    if (selectedTimeSearchType == null || selectedTimeSearchType == "anytime") {
        return "";
    }

    var startDate = new Date();//start from today and alter it based on user selection.
    switch(selectedTimeSearchType) {
        case "24hr":
            startDate.setDate(startDate.getDate() - 1);
            break;
        case "past-week":
            startDate.setDate(startDate.getDate() - 7);
            break;
        case "past-month":
            startDate.setDate(startDate.getDate() - 31);//this is an approximation as extreme precision is not required.
            break;
        default:
            return "";//should never get here. Though, if it does, ignore time filter.
    }

    return "&as_q=daterange:" + formatToGSADate(startDate) + "..";
}

/* Formats given date to the format that GSA understands. That is: yyyy-MM-dd. Returns a string. */
function formatToGSADate(date) {
    var dayOfMonth = date.getDate();
    var month = date.getMonth() + 1; //month is zero based
    var year = date.getFullYear();
    if (month < 10) {
        month = "0" + month;
    }
    if (dayOfMonth < 10) {
        dayOfMonth = "0" + dayOfMonth;
    }
    return year + "-" + month + "-" + dayOfMonth;
}

/**
 * This function does the xsl transformation using the specified XML as input.
 * It expects that a global variable named <code>xslt</code> holding the content of the xslt to be applied exists.
 */
function processXSLT(gsa_xml) {
    if (! window['XSLTProcessor']) {
        // Trasformation for IE
        //return gsa_xml.transformNode(xslt);
		if (document.documentMode == 10){return loadXMLDocIE10(gsa_xml,xslt);}
		else{
		try {
			return gsa_xml.transformNode(xslt);
		 } catch(e)
		{
		return loadXMLDocIE10(gsa_xml,xslt);
		}
		}	
		
		
    } else {
        // Transformation for non-IE
        var resultDoc;
        var processor = new XSLTProcessor();
        if (typeof processor.transformDocument == 'function') {
            // obsolete Mozilla interface
            resultDoc = document.implementation.createDocument("", "", null);
            processor.transformDocument(gsa_xml, xslt, resultDoc, null);
        } else {
			processor.importStylesheet(xslt);
			resultDoc = processor.transformToFragment(gsa_xml, document);
        }

		var out = new XMLSerializer().serializeToString(resultDoc);
		out=out.replace(/&amp;/gi,"&");
		out=out.replace(/&lt;/gi,"<");
		out=out.replace(/&gt;/gi,">");

		return out;
    }
}

// This function processes the pagination links, and generates a different
// url and submits via ajax.
function alterLinks(){
	$("#pagination li a, .b a").bind("click",function(){ 
		// For UAT/PROD.
		performSearch("/gsa-search/" + $(this).attr("dest"));
   	});

	//Change the CrowdSupport title to CrowdSupport REG;  
	//Do not change the logic 
   	$('.header .heading-12 h2, .header .heading-14').each(function() {
   		var text=$(this).html();
   		if(text.indexOf("CrowdSupport") > -1){
   			var restStr=text.substring(text.indexOf("results"));
   			$(this).html('CrowdSupport&reg; '+restStr)
   		}
	});

	$("#return-to-full-result").bind("click",function(){
   		performSearch(null);
   	});

   	//manipulate FAQ urls for Business & Enterprise and  All results
    //As it is a code to just fix the BusinessFAQ urls, I didn't touch the XSLT and leave is as generic as it can be
    //TODO
   	var radioValue=$("#refine-search input:checked").val();
   	if(radioValue=='business-enterprise' || radioValue=='corporate-homepage'){
   		$('#main-col .link a').each(function() {
   			var newhref=manipulateBusinessFAQUrl($(this));
   			if(newhref!=null){
   				$(this).attr("href",newhref);
   				$(this).text(newhref.substring(0,80)+"...");
   				$(this).parents("li").children("p:first-child").find("a").attr("href",newhref);
   			}

   		});
   		$('#right-col-1 li p a,#right-col-2 li p a ').each(function() {
   			var newhref=manipulateBusinessFAQUrl($(this));
   			if(newhref!=null){
   				$(this).attr("href",newhref);
   			} 
   		});	
   	}
}

// In case of an error, this function redirects the user to the
// Error page, and saves the page state.
function errorPageRedirect() {
	document['keep-state-error-form'].submit();
}

//In case of empty search term, show the empty error message
function handleNoSearchTerm(checkTime){

	if(checkTime=="load"){
		if(searchFormSubmited!=undefined && searchFormSubmited=="Yes"){
			if(inpSearch == undefined || inpSearch == "" || $.trim(inpSearch) == ""){
				//show error message
				$("#no-input-error").show();
				return false;
			}

			inpSearch=inpSearch.replace(/[<>;]+/gi, "");
	
			$("#q").val(inpSearch);
			return true;
		}
	} else {
		var inputTerm=$("#q").val();
		if (inputTerm == undefined || inputTerm == "" || $.trim(inputTerm) == ""){
			//show error message and hide main/right columns
			$("#no-input-error").show();
			$("#main-module").hide();
			return false;
		}

		//sanitizing input term
		inputTerm=inputTerm.replace(/[<>;]+/gi, "");
		$("#q").val(inputTerm);

		//hide error message and show main/right columns
		$("#no-input-error").hide();
		$("#main-module").show();
		$("#close-button").css("display","block");
		return true;
	} 
}

//function onClick of simple/advanced search link
function onClickOfSwitchSearch (){
	var inputTerm=$("#q").val();
	if(inputTerm != undefined || inputTerm != ''){
		$("#searchTermInSimple").val(inputTerm);
	}
	document['keep-state-form'].submit();
}

//populate search term while moving between simple and/or advanced search
function populateSearchTerm(){
	if(searchTermInSimple!=undefined && searchTermInSimple!='' && searchTermInSimple!='<!--$ searchTermInSimple-->'){
		$("#q").val(searchTermInSimple);
	}
}
// This function selects the appropriate site on page load,
// depending upon the search.
function selectSiteIdOnLoad() {
    $("#siteId").val("All");
    if (requestSiteId != undefined && requestSiteId && requestSiteId != null) {
        if (requestSiteId == "personal") $("#siteId").val("Personal");
        if (requestSiteId == "business-enterprise") $("#siteId").val("Business_and_Enterprise");
        if (requestSiteId == "about-telstra") $("#siteId").val("About_Telstra");
    }
	var requestedCaption = $.getUrlVar('caption');
	if (requestedCaption != undefined && requestedCaption && requestedCaption != null) {
	 $("#caption").val(requestedCaption);
	}
    
}

function selectCaptionPerformSearch(caption) {
    $("#caption").val(caption);
    performSearch(null);
    return false;
}
function selectSitePerformSearch(site) {
    $("#siteId").val(site);
    $("#caption").val("All");
    performSearch(null);
    return false;
}

// This function populates the GSA collection and client upon selection of radio button
function fill_GSA_Collection_Client(){
	var siteValue=$("#siteId").val();
	var captionValue = $("#caption").val();
	// Failsafe default values, just incase
	main_site='TDigital_Consumer';
 	main_client='TDigital_FE_Personal_Main';

 	
	if(siteValue=='All'){
		main_site='TDigital_All';
     	main_client='TDigital_FE_All_Main';
	}
    else if (siteValue == 'Personal') {
		main_site='TDigital_Consumer';
     	main_client='TDigital_FE_Personal_Main';
     	if (captionValue == 'CrowdSupport') {
     	    main_site = 'TDigital_Consumer_Crowd';
     	    main_client = 'TDigital_FE_Personal_Crowd';
     	}
     	else if (captionValue == 'FAQ') {
     	    main_site = 'TDigital_Consumer_FAQ';
     	    main_client = 'TDigital_FE_Personal_FAQ';
     	}
     	else if (captionValue == 'Explore') {
     	    main_site = 'TDigital_Consumer_Explore';
     	    main_client = 'TDigital_FE_Personal_Explore';
     	}
     	else if (captionValue == 'Shop') {
     	    main_site = 'TDigital_Consumer_Shop';
     	    main_client = 'TDigital_FE_Personal_Shop';
     	}
     	else if (captionValue == 'Account Services') {
     	    main_site = 'TDigital_Consumer_AccountServices';
     	    main_client = 'TDigital_FE_Personal_AccountServices';
     	}
	}
    else if (siteValue == 'Business_and_Enterprise') {
		main_site='TDigital_Business';
     	main_client='TDigital_FE_Business_Main';
     	if (captionValue == 'CrowdSupport') {
     	    main_site = 'TDigital_Business_Crowd';
     	    main_client = 'TDigital_FE_Business_Crowd';
     	}
     	else if (captionValue == 'FAQ') {
     	    main_site = 'TDigital_Business_FAQ';
     	    main_client = 'TDigital_FE_Business_FAQ';
     	}
     	else if (captionValue == 'Explore') {
     	    main_site = 'TDigital_Business_Explore';
     	    main_client = 'TDigital_FE_Business_Explore';
     	}
     	else if (captionValue == 'Shop') {
     	    main_site = 'TDigital_Business_Shop';
     	    main_client = 'TDigital_FE_Business_Shop';
     	}
     	else if (captionValue == 'Account Services') {
     	    main_site = 'TDigital_Business_AccountServices';
     	    main_client = 'TDigital_FE_Business_AccountServices';
     	}
     	
	}
	else if (siteValue == 'About_Telstra'){
		main_site='TDigital_About';
     	main_client='TDigital_FE_About_Main';
	}
}

//function to disable other docTypes when selecting all
function onClickAllDocTypes(){
	var value=$('[name=docType]:checked').val();
	if(value!=undefined && value=='all'){
		$("#web-pages").attr('disabled', 'true');
		$("#pdf").attr('disabled', 'true');
		$("#web-pages").attr('checked', '');
		$("#pdf").attr('checked', '');
	}
	else{
		$("#web-pages").removeAttr("disabled");
		$("#pdf").removeAttr("disabled");

	}
}


// This function processes the View more results trigger, and swaps the xml. It modifies
// the xml params to accommodate the new destination divs.
function updateContent(mainUrl) {
	var returnedResultsXMLMainPanel = null;
    var returnedResultsXMLTopPanel = null;
    var returnedResultsXMLBottomPanel = null;

    var siteId = $("#siteId").val();
    var caption = $("#caption").val();
	
	// If the div is visible, then set the term to nothing.
	if ($("#ssOriginalValueSpan").is(":visible") && spellingSuggestionOriginal != "-" && test != "a") {
		spellingSuggestionOriginal = "";		
	} 
 	
	// Call first ajax request.
	$.ajax({
   		url: mainUrl,
   		dataType: "xml" ,
   		type: "GET",
   		async: false,
   		timeout: timeoutValue,
   		error: function(jqXHR, textStatus, errorThrown){
   			//console.log("Error during main search: " + textStatus);
   			//errorPageRedirect();
   		},
   		success: function(data){
   			returnedResultsXMLMainPanel = data;   			
					  $(data).find('RES').each(function() {   				
   				page_start = $(this).attr("SN") - 1;
   			});  
   			if (spellingSuggestionOriginal == "") {
   				
   					$(data).find('Suggestion').each(function() {   				
   						spellingSuggestion = $(this).attr("q"); 
   						spellingSuggestionOriginal = $("#q").val();  	
   						spellingSuggestionShow = "YES";	
   						test = "a";		
   					});     				
   				
   			}

   		},
		complete: function(xhr,status){
			if (! window['XSLTProcessor']) {
			// Trasformation for IE
			if (document.documentMode == 9 || status=='parsererror') {
				var xml = null;
				// Internet Explorer
				try {
				xml = new ActiveXObject("Microsoft.XMLDOM");
				xml.async = "false";
				xml.loadXML(xhr.responseText.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, ''));
				returnedResultsXMLMainPanel=xml;
				} catch (e) {errorPageRedirect();}
		    }
		 }
		}
 	});

	// If a suggestion is present.
	if (spellingSuggestion != "") {
		$("#q").val(spellingSuggestion);
		spellingSuggestion = "";
		performSearch(null); 
	} else {
 		if (returnedResultsXMLMainPanel != null) {
 			var res1 = processXSLT(returnedResultsXMLMainPanel);
 			$("#main-col").html(res1).attr("queryURL", mainUrl);
			
			var fullLength = $(".sugg").length;
			var counterL = 1;
 			//get and populate the featured result data.
			$(".sugg").each(function(){
				var featuredResultDiv = $(this);
				featuredResultDiv.attr("onmouseover","this.style.background='#FFF'");
				featuredResultDiv.attr("onmouseout","this.style.background='#FFF2CA'");
				//featuredResultDiv.attr("style","border-radius: 10px 10px 10px 10px;");
				if (featuredResultDiv != null) {
					if (fillInFeaturedResultDiv(featuredResultDiv.attr("metaKey"))) {
						featuredResultDiv.show();
					}
				}
				if (counterL == fullLength) {
					$(this).addClass("last");
				}	
				counterL = counterL + 1;
			});
 		}
	
		if (spellingSuggestionOriginal != "" && spellingSuggestionShow == "YES") {
			$("#ssOriginalValue").html(spellingSuggestionOriginal);	
			$("#ssOriginalValueSpan").css("display","inline");		
		} else {
			$("#ssOriginalValueSpan").css("display","none");		
		}
		var caption = $("#caption").val();
			if(caption!="All") {
				if(caption=="Explore") { 
					$("#categories ul.level3 li div").each(function() {
						if($(this).hasClass("icon-info")) {
							$(this).css("background-color","#DDF1FC");
							$(this).append("&nbsp;");
							$(this).parent().parent().parent().find("#totalresults").appendTo($(this));
						}

					});
				}
				else if(caption=="Shop") { 
					$("#categories ul.level3 li div").each(function() {
						if($(this).hasClass("icon-shop")) {
							$(this).css("background-color","#DDF1FC");
							$(this).append("&nbsp;");
							$(this).parent().parent().parent().find("#totalresults").appendTo($(this));
						}
					});
				}
				else if(caption=="CrowdSupport") { 
					$("#categories ul.level3 li div").each(function() {
						if($(this).hasClass("icon-crowd")) {
							$(this).css("background-color","#DDF1FC");
							$(this).append("<br/>");
							$(this).parent().parent().parent().find("#totalresults").appendTo($(this));
						}

					});
				}
				else if(caption=="FAQ") { 
					$("#categories ul.level3 li div").each(function() {
						if($(this).hasClass("icon-faq")){
							$(this).css("background-color","#DDF1FC");
							$(this).append("&nbsp;");
							$(this).parent().parent().parent().find("#totalresults").appendTo($(this));
						}
					});
				}
				else if(caption=="Account Services") { 
					$("#categories ul.level3 li div").each(function() {
						if($(this).hasClass("icon-service")){
							$(this).css("background-color","#DDF1FC");
							$(this).append("&nbsp;");
							$(this).parent().parent().parent().find("#totalresults").appendTo($(this));
						}

						});
				}
			}
		if (feedback_submitted)
		{
			$('html, body').animate({ scrollTop: $("#feedback-form").offset().top }, 500);
		}
 		feedback_submitted=false;
		spellingSuggestionShow = "NO";
		test = "";
		//if (spellingSuggestionOriginal == "-") {
			spellingSuggestionOriginal = "";
		//}
		//spellingSuggestionOriginal = "";
		//spellingSuggestion = "";
		alterLinks();
	}
	
}

/**
 * Makes request to server to get featured result and populates the title, image url and description of it.
 * It does not show the div, caller is responsible for making the DIV visible or not as required.
 * Note that GSA returns '_NoName_' when there is no data is available for title, description or image.
 * @return True if successful. False otherwise.
 */
function fillInFeaturedResultDiv(metaKey) {
	if (metaKey == null) {
		return false;
	}

	var featuredResultXml;	
	var featuredResultGSAUrl = '/gsa-search/search?site=TDigital_All_FeaturedResults&getfields=*&q=inmeta:kmkey='+metaKey;
	
	$.ajax({
		url: featuredResultGSAUrl,
		dataType: "xml" ,
		type: "GET",
		async: false,
		timeout: timeoutValue,
		error: function(jqXHR, textStatus, errorThrown){
			jqXHR.responseText = jqXHR.responseText.replace('<?xml version="1.0" encoding="ISO-8859-1" standalone="no"?>', '').replace('<!DOCTYPE GSP SYSTEM "google.dtd">','').replace(/\n/g, "");
			featuredResultXml = $.parseXML(jqXHR.responseText);
		},
		success: function(data){
			featuredResultXml = data;
		}
	});

	if (featuredResultXml == null) { //if request failed getting a result, return.
		return false;
	}

	var titlePath = "/GSP/RES/R/MT[@N='kmtitle']";
	var descriptionPath = "/GSP/RES/R/MT[@N='kmdesc']";
	var imagePath = "/GSP/RES/R/MT[@N='kmimage']";

	var titleNode = null;
	var descNode = null;
	var imageNode = null;

	// code for IE
	
		$(featuredResultXml).find("MT").each(
			function() {
				if($(this).attr("N")=="kmtitle") title = $(this).attr("V");
				if($(this).attr("N")=="kmdesc") description = $(this).attr("V");
				if($(this).attr("N")=="kmimage") imageUrl = $(this).attr("V");
				 
			}
		);
/*	if (window.ActiveXObject) {
		var source = "";
		source = new ActiveXObject("Microsoft.XMLDOM");
		source.async = false;
		source.load(featuredResultXml);
		featuredResultXml = source;
		
		titleNode = source.selectSingleNode(titlePath);
		descNode = source.selectSingleNode(descriptionPath);
		imageNode = source.selectSingleNode(imagePath);
	} else if (document.implementation && document.implementation.createDocument) {
		// code for Mozilla, Firefox, Opera, etc.
		titleNode = featuredResultXml.evaluate(titlePath, featuredResultXml, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
		descNode = featuredResultXml.evaluate(descriptionPath, featuredResultXml, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
		imageNode = featuredResultXml.evaluate(imagePath, featuredResultXml, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue;
	}

	if (imageNode == null || titleNode == null || descNode == null) {
		return false; //there's something wrong with what we get from GSA!!!
	}


	var imageUrl = imageNode.getAttribute("V");
	var title = titleNode.getAttribute("V");
	var description = descNode.getAttribute("V");
*/
	//set values in the HTML DOM
	var hasTitle=false;
	var hasImage=false;
	var itemid ="";
	if ('_NoName_' != imageUrl) {
		itemid="#featuredResultImg"+metaKey;
		$(itemid).attr("src", imageUrl).closest("div").show();
		hasImage=true;
	}

	if ('_NoName_' != title) {
		itemid="#featuredResultTitle"+metaKey;
		$(itemid).html(title);
		itemid="#featuredResultDesc"+metaKey;
		$(itemid).html(description).closest("div").show();
		if ('_NoName_' == imageUrl) {//make title & description div span all the way if there is no image
			$(itemid).closest("div").removeClass("split_66");
		}
		hasTitle=true;
	}

	if(hasImage && !hasTitle){
		itemid="#featuredResultDiv"+metaKey;
		$(itemid).addClass("featuredResultDivWidth");
	}
	if ($.browser.msie && $.browser.version == 7){
		itemid="#featuredResultDiv"+metaKey;
		$(itemid).find("div").last().prev().css("padding-top","27px");
	}
	return true; //processed successfully
}

// This function performs the search as you type functionality.
function onEnterPerformSearch(e) {
	var c = String.fromCharCode(e.which);
    if (e.keyCode == 13) {
    	performSearch(null);
    	return true;
	} 
}

// This function processes the click for 10/25 page results.
function updateResultsPerPage(num) {
	var newRequest = $("#main-col").attr("queryURL");

	if (newRequest.indexOf("&num=") == -1) {
		newRequest = newRequest + "&num=" + num;
	} else {
		newRequest = newRequest.replace("&num=10", "&num="+num).replace("&num=25", "&num="+num);
	}

	performSearch(newRequest+"&start=0");
	$("#main-col").attr("queryURL", newRequest);
}

// This function performs a search, when the user clicks on the suggestions
// value for both simple and advanced search.
function performSuggestionsSearch() {
	// Update the text field with the new value.
	$("#q").val($("#suggestionsValue").text());
	performSearch(null);
}

//manipulate Business FAQ urls to point to new B&E FAQ page
function manipulateBusinessFAQUrl($this){
	var vhref=$this.attr("href");
	var newhref=null;
   	if(vhref.indexOf("http://telstrabusinessonline.custhelp.com/app/answers/detail/a_id/")>-1){
   		var index= vhref.indexOf("/a_id/");
   		var restOfurl= vhref.substring(index+6);
   		var firstIndexOfSlash=restOfurl.indexOf("/");
   		var qId;
   		if(firstIndexOfSlash<0){
   			qId=restOfurl.substring(0);
   		}
   		else{
   			qId=restOfurl.substring(0,firstIndexOfSlash);
   		}
   		newhref="http://www.telstra.com.au/business-enterprise/help-support/faqs/index.htm?answerId="+qId;
   	}

   	return  newhref;
}

// This function manages the search for sayt.
function triggerSearch(e) {

	$.browser.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
	
	if (navigator.userAgent.indexOf("Mac OS X") != -1) {
		$("#search_suggest").css("width","540px");
		$("#search_suggest").removeClass("ss-gac-m").addClass("ss-gac-m-chrome");
		$.browser.safari = false;
	}
	
	if ($.browser.msie) {
		$("#search_suggest").css("width","543px");
		$("#search_suggest").removeClass("ss-gac-m").addClass("ss-gac-m-ie");
	}

	if ($.browser.chrome) {
		$("#search_suggest").css("width","541px");
		$("#search_suggest").removeClass("ss-gac-m").addClass("ss-gac-m-chrome");
		$.browser.safari = false;
	}

	if ($.browser.safari) {
		$("#search_suggest").css("width","543px");
		$("#search_suggest").removeClass("ss-gac-m").addClass("ss-gac-m-chrome");
	}
	
	var who = e.target || e.srcElement;
	var kid = (window.event) ? window.event.keyCode : e.keyCode;
	if (who.name == "inpSearch") {
		ss_popup_element = 'search_suggest_header';
		ss_form_element = 'header-search-telstra';
 		document.getElementById('search-telstra-keywords').action = "/search/simple-search/index.htm";
 		if ($.browser.msie) {			
			$("#search_suggest_header").removeClass("ss-gac-m-header").addClass("ss-gac-m-header-ie");
		}
		ss_handleKey(e);
	} else {
		if (kid == 13) {
			$("#search_suggest").css("visibility","hidden");			
			searchReset = "yes";
			performSearch(null);
			searchReset = "";
			return false;
		} else {
			ss_form_element = 'suggestion_form';
			ss_popup_element = 'search_suggest';
			ss_handleKey(e);
		}
	}
	
	//close button events - Start //
		if (who.value != ""){
			$("#close-button").css("display","block");
		}else{
			$("#close-button").css("display","none");
		}
	//close button events - End //
	
}
// Parse URL Queries
function url_query( query ) {
	query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
	var expr = "[\\?&]"+query+"=([^&#]*)";
	var regex = new RegExp( expr );
	var results = regex.exec( window.location.href );
	if ( results !== null ) {
		return results[1];
	} else {
		return false;
	}
}

function loadXMLDocIE10(xmlL,xslL)
{
	// Load data.
	//xmlL = xmlL.replaceAll("[^\\x20-\\x7e]", "");
		var source = "";
		source = new ActiveXObject("Msxml2.DOMDocument");
		source.async = false;
		source.load(xmlL);

	if (source.parseError.errorCode != 0) {
	   var myErr = source.parseError;
	   alert("You have error - 1 - " + myErr.reason);
	} else {
	   // Load style sheet.
	   var stylesheet = new ActiveXObject("Msxml2.DOMDocument.3.0");
	   stylesheet.async = false
	   stylesheet.load(xslL);
	   if (stylesheet.parseError.errorCode != 0) {
					  var myErr = stylesheet.parseError;
					  alert("You have error - 2 - " + myErr.reason);
					} else {
					  // Echo back XSLT output to console
					  return (source.transformNode(stylesheet));
	   }
	}		
}    
function countChar(val) {
var len = val.value.length;
if (len >= 200) {
  val.value = val.value.substring(0, 200);
} else {
  $('.feedbackchars').text(200 - len);
}
};                    

$.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    },
    getUrlVar: function (name) {
        return $.getUrlVars()[name];
    }
});

// Copyright 2007 Google Inc.,  All Rights Reserved
// dspencer@google.com

/**
 * @fileoverview
 *
 * This file is for the clicklogging feature on the GSA.
 *
 * @author dspencer@google.com
 */

/**
 * Create an image tag that causes the URL that logs the click
 * to be hit.
 *
 * @param {String} url target URL the user clicked on
 * @param {String} query users search query
 * @param {String} ctype click type
 * @param {String} cdata optional click data
 * @param {String} rank optional rank, 1 based, usually 1..10
 * @param {String} start optional starting page offset, usually 0
 *                                             on 1st page, 10 on 2nd page etc
 * @param {String} site optional indicates which collection served the page
 * @param {String} src_id optional indicates which GSA the result came from
                                               in federation
 * @return {Boolean} true if we think we logged the click
 */
var cl_clk = function(url, query, ctype, cdata, rank, start, site, src_id){
    if (!document.images) {
        return new Boolean(false);
    }
    var esc = encodeURIComponent || escape;
    var img = document.createElement('img');

    var src = "/gsa-search/click?" +
        (query ? "&q=" + esc(query) : "") +
        (ctype ? "&ct=" + esc(ctype) : "") +
	(cdata ? "&cd=" + esc(cdata) : "") +
	(url ? "&url=" + esc(url.replace(/#.*/, "")).replace(/\+/g, "%2B") : "");

    if (rank != null && typeof rank != 'undefined') {
        src += "&r=" + esc(rank);
    }
    if (start != null && typeof start != 'undefined') {
        src += "&s=" + esc(start);
    }
    if (site != null && typeof site != 'undefined') {
        src += "&site=" + esc(site);
    }
    if (src_id != null && typeof src_id != 'undefined') {
        src += "&src_id=" + esc(src_id);
    }

    img.src = src;
    return new Boolean(true);
};


/**
 * Log click on a link by picking out appropriate
 * attributes in the element that describe the link.
 * We expect to get called from an onmousedown handler
 * such that 'this' is an &lt;a&gt; tag. We look
 * for attributes named "ctype", "cdata", and "rank".
 *
 * @param {Event} ev optional DOM event
 */
var cl_link_clicked = function(ev) {
  var target = this;
  // When this is called directly from an event handler in FF at least,
  // 'this' is not the <a> element, so we try to detect this and adjust.
  if (!target.getAttribute && ev) {
    if (ev.target) {
        target = ev.target;
    } else if (ev.srcElement) {
        target = ev.srcElement;
    }
    if (target.nodeType == 3) {
        target = target.parentNode;
    }
  }
  var cdata = target.getAttribute("cdata");
  var ctype = target.getAttribute("ctype");
  var rank = target.getAttribute("rank");
  var src_id = target.getAttribute("src_id");
  if (!ctype) {
    ctype = "OTHER"; // unknown link type
  }
  var url;
  if (target.href) {
    url = target.href;
  } else {
    url = "#"; // link w/o href
  }

  cl_clk(url, page_query, ctype, cdata, rank, page_start, page_site, src_id);
  return true;
};

