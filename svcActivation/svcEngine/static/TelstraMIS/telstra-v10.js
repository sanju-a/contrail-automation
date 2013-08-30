var TelstraGlobal = (function(_this, $){

	// Public properties

	// Constructor
	_this.initialise = function(){

		_this.init_progress_bar_defaults();

		_this.init_ie6_multiple_classes();

		_this.init_search_gsa(); // comment this line to disable GSA search
		//_this.init_search_fast(); // comment this line to disable FAST search

		
		_this.initialise_global_navigation();

		_this.initialise_current_navigation();
		_this.initialise_primary_navigation();
		_this.initialise_lhs_navigation();

		_this.initialise_hover_states();
		_this.init_logo_hovers();

		_this.initialise_form_help_text();

		_this.initialise_omniture();

		_this.initialise_lightbox_print();
		
		_this.initialise_overlay_groups();

		_this.initialise_lightboxes();

		return _this;
	};


	// Public methods

	// Set defaults for progressBar jQuery plugin
	_this.init_progress_bar_defaults = function(){
		$(function(){

			if($.progressBar){
				// Defaults
				$.progressBar.defaults.width = 296;
				$.progressBar.defaults.height = 15;
				$.progressBar.defaults.showText = false;
				$.progressBar.defaults.boxImage = '/global/themes/v10/images/blank.png';
				$.progressBar.defaults.barImage = '/global/themes/v10/images/bg-wait-time-determiniate.png';

				// Can be passed into progressBar constructor as TelstraGlobal.progress_bar_narrow_options
				_this.progress_bar_narrow_options = {width: 138, barImage: '/global/themes/v10/images/bg-wait-time-determiniate-narrow.png'}
			}

		});
	};

	// Workaround for IE6 not recognising multiple classnames
	// This is very specific to style-f/colour-X2|X3 container combinations
	_this.init_ie6_multiple_classes = function(){
		$('.style-f').each(function(){
			var c = $(this).attr('class'), m;
			if(m = /colour-[a-f]{1}([23]{1})/g.exec(c)){
				if(m.length > 0){
					$(this).addClass('style-f-colour-X'+m[1]);
				}
			}
		});
	};

	// hide the google logo by fclicking on searchbox and(or) logo	
	_this.init_search_gsa = function(){

        if($("#search-telstra-keywords").val()!='') {
               $("#powered-by-google").css("display","none");        
        }

		$('#search-telstra-keywords, #powered-by-google').click(function() {

  			$("#powered-by-google").css("display","none");
  			$("#search-telstra-keywords").focus();

		});

		$("#search-telstra-keywords").focusout(function() {
		if($("#search-telstra-keywords").val()==''){
			$("#powered-by-google").css("display","block");
		}

		});
	};

	// Show the search provider menu when the user hovers over the icon
	_this.init_search_fast = function(){
		var menu_html = '<div class="menu"><ul>', $keywords = $('#header-search .search-keywords');

		// Build the search provider menu
		$keywords.each(function(){
			var $this = $(this), $label = $this.siblings('label'), $form = $this.parents('form'), classname = '';
			if($form.is('.current')){
				classname = ' class="current"'
				$form.data('current', 'true');
			}

			// Display the form so that the label overlay gets positioned properly
			$form.addClass('current');

			// Add label overlays
			// requires jQuery Label Overlay plugin - https://github.com/boomworks/jquery-labeloverlay
			$this.labelOverlay();

			// Hide form, we'll re-show the 'current' form later
			$form.removeClass('current');

			menu_html += '<li id="header-menu-' + $this.attr('id') + '"' + classname + '>' + $label.text() + '</li>';
		});

		// Display the 'current' form
		$('#header-search form').each(function(){
			if($(this).data('current')){
				$(this).addClass('current');
				return true;
			}
		});

		menu_html += '</ul></div>';
		$(menu_html)
			.appendTo('#header-search')
			.mouseleave(function(){
				$('#header-search .menu').hide();
			})
		;

		// Show the selected search provider
		$('#header-search .menu li')
			.live('click', function(){
				var $this = $(this), 
					id = $this.attr('id').replace('menu-', '').replace('-keywords', ''),
					current_keywords = $('#header-search form.current .search-keywords').val();

				$('#header-search form.current').removeClass('current');
				$('#header-search .menu .current').removeClass('current');

				$this.addClass('current');
				$('#' + id)
					.addClass('current')
					.find('.search-keywords')
					.val(current_keywords)
					.trigger('change');

				$this.remove().prependTo($('#header-search .menu ul'));
				$('#header-search .menu ul .hover').removeClass('hover');
				$('#header-search .menu').hide();
			})
		;

		// Add a 'trigger' div for the search menu
		$('<div class="menu-trigger"/>')
			.appendTo('#header-search')
			.mouseenter(function(){
				$('#header-search .menu').show();
			})
		;
	};
	

	_this.initialise_global_navigation = function() {
		// Ensure the correct global tab is highlighted
		if (typeof(TelstraGlobal.global_tab) != "undefined") {
			// if the page vaiable 'TelstraGlobal.global_tab' has been set, highlight the appropriate global tab
			
			switch (TelstraGlobal.global_tab)
				{
				case 'home':
				  	$('#global-tab-home').addClass('current');
				  	break;
				case 'personal':
				  	$('#global-tab-personal').addClass('current');
				  	break;
				case 'business':
				  	$('#global-tab-business').addClass('current');
				  	break;
				 case 'teg':
				  	$('#global-tab-teg').addClass('current');
				  	break;
				 case 'about':
				  	$('#global-tab-about').addClass('current');
				  	break;
				default:
				  // do nothing
			}

		}
	};


	_this.initialise_hover_states = function(){
		// Add 'hover' classname when nav item is hovered over
		$('#header-search .menu li, #primary-navigation li, #bp-directories-nav li, #header-support-nav li, #secondary-navigation li.has-children:not(.open)').hover(function(){
			$(this).addClass('hover');
		}, function(){
			$(this).removeClass('hover');
		});
	};

	// Add 'current' classname to specified IDs
	_this.initialise_current_navigation = function(){

		var $current_secondary_nav_item = $('#' + _this.current_secondary_nav_id);

		if(_this.current_secondary_nav_id === 'section-title'){
			$('.section-title').addClass('current');
		}

		$('#' + _this.current_primary_nav_id).addClass('current');
		$('#' + _this.current_global_nav_id).addClass('current');
		$current_secondary_nav_item.addClass('current').parents('li').addClass('open');
		if($current_secondary_nav_item.find('ul').length){
			$current_secondary_nav_item.addClass('open');
		}
	};


	_this.initialise_primary_navigation = function(){

		var $flyouts = $('#primary-navigation .flyout'),
			content_right = $('#page-body').offset().left + $('#page-body').width();

		// Equalise heights of flyout contents
		$flyouts.each(function(){
			var $children = $(this).find('> ul, .popular-pages, .promo'),
				max_height = 0,
				flyout_width = 14;

			$(this).parents('li').addClass('hover');
			if($children.length > 1){
				$children.each(function(){
					if($(this).height() > max_height){
						max_height = $(this).height();
					}
					flyout_width += $(this).outerWidth();
				});
				if(max_height > 0){
					$(this).find('.popular-pages').css({height: max_height})
				}
				$(this).css({width: flyout_width});
			}

			// Reposition the flyout if it would hang off the right of the screen
			if($(this).width() + $(this).offset().left > content_right){
				$(this).css({left: 'auto', right: 0});
			}

			$(this).parents('li').removeClass('hover');
		});

		// Add <div>s for the drop shadow to each flyout (for IE < 9)
		$flyouts.append('<div class="shadow-r"></div><div class="shadow-b"></div><div class="shadow-l"></div>');

	};

	_this.initialise_lhs_navigation = function(){

		// Add 'has-children' classname to menu items that have children
		$('#secondary-navigation li').each(function(){
			var $this = $(this);
			if($this.find('ul').length){
				$this.addClass('has-children');
			}
		});

		$('#secondary-navigation li.has-children:not(.open)').hover(function(){
			var $menu = $('> ul', this);
			$(this).addClass('hover');
			if($menu.offset().top + $menu.height() > $(window).height()){
				$menu.addClass('bottom-position');
			}
		}, function(){
			var $menu = $('> ul', this);
			$(this).removeClass('hover');
			$menu.removeClass('bottom-position');
		});

	};

	_this.init_logo_hovers = function(){

		// Display Telstra & channel logo hover states
		$('#header .logo')
			.after('<div id="logo-hover">Return to Telstra home page</div>')
			.hover(function(){
				$('#logo-hover').show();
			}, function(e){
				$('#logo-hover').hide();
			});

		$('#header .channel')
			.after('<div id="channel-hover">Return to Personal home page</div>')
			.hover(function(){
				$('#channel-hover').show();
			}, function(){
				$('#channel-hover').hide();
			});

		$('#header .channel-business-enterprise')
			.after('<div id="channel-hover-business-enterprise">Return to Business & Enterprise home page</div>')
			.hover(function(){
				$('#channel-hover-business-enterprise').show();
			}, function(){
				$('#channel-hover-business-enterprise').hide();
		});
		$('#header .channel-about-telstra')
			.after('<div id="channel-hover-about-telstra">Return to About Telstra home page</div>')
			.hover(function(){
				$('#channel-hover-about-telstra').show();
			}, function(){
				$('#channel-hover-about-telstra').hide();
		});

	};

	_this.initialise_form_help_text = function(){
		var $triggers = $('a[rel="help-link"]');
		$triggers.click(function(e){
			e.preventDefault();

			var $link = $(this), $target = $('#' + $link.attr('href').split('#')[1]), $tooltip;

			$tooltip = $('<div id="tooltip-hover" class="wide"></div>')
				.html('<div>'+$target.html()+'<a class="function link" id="tooltip-hover-close" href="#">Close</a></div>')
				.prependTo('body')
				.css({
					top: $link.offset().top,
					left: $link.offset().left + $link.width() + 25,
					marginLeft: 0,
					'z-index': 32768
				});

			$('#tooltip-hover-close').click(function(e){
				e.preventDefault();
				$tooltip.remove();
			});

			$('body').click(function(e){
				if(e.target != $link[0] && !$(e.target).parents('#tooltip-hover').length){
					$tooltip.remove();
				}
			});

		});
	};

	_this.initialise_omniture = function(){
		$('a[rel="lightbox"]:not(.trackpage)').addClass('tracklink');
	};

	_this.initialise_lightbox_print = function(){

		$(document).bind('oB_init', function(){
			$('#ob_content .print').bind('click', TelstraGlobal.print_lightbox);
		});

	};

	/* Opens a new window & inserts priont page style + lightbox content */
	_this.print_lightbox = function(e){

var w = window.open('', 'Print', ''), print_html = '';


var jsPath=$('#telstra-v10-js').attr('src');
var baseUrl=jsPath.substring(0,jsPath.indexOf('/global/'));

        w.document.open();

print_html += '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">' +
'<head>' +
'<meta http-equiv="content-type" content="text/html; charset=utf-8"/>' +
'<title>Printing</title>' +
'<link rel="stylesheet" type="text/css" media="screen,projection,print" href="' + baseUrl + '/global/themes/v10/css/print.css"/>' +
'<link rel="shortcut icon" href="' + baseUrl + '/global/themes/v10/images/favicon-blue.ico"/>' +
'</head>' +
'<body class="no-js" onLoad="self.print(); setTimeout(function() { self.close(); },500);">' +
'<div id="header" class="container_18 clearfix" style="clear:both;height:57px;overflow:auto;">' +
'<div class="logo"><a href="/"><img src="' + baseUrl + '/global/themes/v10/images/logo-blue.png" width="34" height="40" alt="Telstra"/></a></div>' +
'<div class="channel"><h2><a href="/personal/"><img src="' + baseUrl + '/global/themes/v10/images/hd-personal.png" width="135" height="24" alt="Personal"/></a></h2></div>' +
'<br class="clearfix"/>' +
'</div>' +
'<div id="page-body" style="clear:both;">' +
'<div id="content-body">' +
'<div id="page-content" class="article">';

print_html += $('#ob_inline').html();

print_html += '</div></div></div></body></html>';

        w.document.write(print_html);
w.document.close();

//w.print();
//w.close();

//e.preventDefault();
return false;

};

_this.print_popup = function(e){
var w = window.open('', 'Print', ''), print_html = '';
var jsPath=$('#telstra-v10-js').attr('src');
var baseUrl=jsPath.substring(0,jsPath.indexOf('/global/'));
w.document.open();
print_html += '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
'<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">' +
'<head>' +
'<meta http-equiv="content-type" content="text/html; charset=utf-8"/>' +
'<title>Printing</title>' +
'<link rel="stylesheet" type="text/css" media="screen,projection,print" href="' + baseUrl + '/global/themes/v10/css/print.css"/>' +
'<link rel="shortcut icon" href="' + baseUrl + '/global/themes/v10/images/favicon-blue.ico"/>' +
'</head>' +
'<body class="no-js" onLoad="self.print(); setTimeout(function() { self.close(); },500);">' +
'<div id="header" class="container_18 clearfix" style="clear:both;height:57px;overflow:auto;">' +
'<div class="logo"><a href="/"><img src="' + baseUrl + '/global/themes/v10/images/logo-blue.png" width="34" height="40" alt="Telstra"/></a></div>' +
'<div class="channel"><h2><a href="/personal/"><img src="' + baseUrl + '/global/themes/v10/images/hd-personal.png" width="135" height="24" alt="Personal"/></a></h2></div>' +
'<br class="clearfix"/>' +
'</div>' +
'<div id="page-body" style="clear:both;">' +
'<div id="content-body">' +
'<div id="page-content" class="article">';
print_html += $('#content-body').html();
print_html += '</div></div></div></body></html>';
w.document.write(print_html);
w.document.close();
return false;
};
	_this.initialise_overlay_groups = function(){
		$('.overlay-group input').labelOverlay();
	};


	_this.initialise_lightboxes = function(){
		/* Initialise tabs inside lightboxes */
		$(document).bind('oB_init', function(e){
			if($.fn.tabs){
				$('#ob_container .tabs').tabs({context: $('#ob_container')});
			}
			if($.fn.contentAccordion){
				$('#ob_container .contentAccordion').contentAccordion();
			}
		});
	};

	_this.launch_popup = function(url, width, height, resizable, scrollbars, showToolbar){
		var resizable = resizable || false;
		var scrollbars = scrollbars || false;
		var windowProp='location=no, toolbar=no, menubar=no, ';
		if(showToolbar)
			windowProp='location=yes, toolbar=yes, menubar=yes, ';

		// IE has an issue with opening a window at the correct size when the user has set a zoom level other than 100% - APF
		if($.browser.msie == true)
		{
			var ieZoomLevel = (screen.deviceXDPI / screen.logicalXDPI);

			width=width * ieZoomLevel;
			height=height * ieZoomLevel;
		}

		return window.open(url, 'popupWin', windowProp+'width='+width+',height='+height+',scrollbars='+(scrollbars?'yes':'no')+',resizable='+(resizable?'yes':'no'));
};

	return _this.initialise();

}(TelstraGlobal || {}, jQuery));

$(window).bind("load", function() {

	// remove lightbox-content class so the equalization could work
	$("div[id^='lightbox-']").each(function (i) {
	 $(this).removeClass("lightbox-content");

	});

	// equalise heights of containers within a row
	$("#page-content .container-row").each(function(i, el) {

			var mhContent = 0; //max height of content
			var mhHeading = 0; //max height of headings
			var hContent  = 0; //temp height for content
			var hHeading  = 0; //temp height for headings

			// find max height of headings
			$(el).children().each(function(j, elm) {
				hHeading = $(elm).children('div.header').height();
				mhHeading = Math.round(Math.max(hHeading, mhHeading));
			});



			// find max height of content
			$(el).children().each(function(j, elm) {
				if($(elm).hasClass("style-a") && $(elm).children('div.header').height() == 0) {
					hContent = $(elm).children('div.content').children('div.clearfix').height();
					mhContent = Math.round(Math.max(hContent - mhHeading, mhContent));
				} else {
					hContent = $(elm).children('div.content').children('div.clearfix').height();
					mhContent = Math.round(Math.max(hContent, mhContent));
				}
			});

			// set max height to all containers in the row
			$(el).children().each(function(j, elm) {
				if($(elm).hasClass("style-a") && $(elm).children('div.header').height() == 0) {
					$(elm).children('div.content').children('div.clearfix').css("height", mhContent + mhHeading + "px");
					$(elm).children('div.header').css("height", "0px");
				} else {
					$(elm).children('div.content').children('div.clearfix').css("height", mhContent + "px");
					$(elm).children('div.header').css("height", mhHeading + "px");
				}

			});

	});

	// hide lightbox content
	$("div[id^='lightbox-']").each(function (i) {
	 $(this).addClass("lightbox-content");

	});
});

// global popup classes - see /templates/popup.html for samples
$(function() {
		var windowsWidth=$(window).width();
		var windowsHeight=$(window).height();
		var popupWidth=windowsWidth*(0.8);
		var popupHeight=windowsHeight*(0.8);

		$('.externalSite').click(function(e){
				TelstraGlobal.launch_popup($(this).attr('href'),  popupWidth, popupHeight, /* resizable: */true, /* scrollbars: */true, /* showToolbar: */true );
				e.preventDefault();
		});

		$('.popupAppLarge').click(function(e){
				TelstraGlobal.launch_popup($(this).attr('href'), popupWidth, popupHeight,  /* resizable: */false, /* scrollbars: */true, /* showToolbar: */false);
				e.preventDefault();
		});

		$('.storeLocator').click(function(e){
				TelstraGlobal.launch_popup($(this).attr('href'),  calculateCorrectWidth(990), calculateCorrectHeight(800),/* resizable: */false, /* scrollbars: */true, /* showToolbar: */false);
				e.preventDefault();
		});

		$('.popupInfo').click(function(e){
				TelstraGlobal.launch_popup($(this).attr('href'), calculateCorrectWidth(350), calculateCorrectHeight(200),  /* resizable: */false, /* scrollbars: */true, /* showToolbar: */false);
				e.preventDefault();
		});

		$('.popupAppMid').click(function(e){
				TelstraGlobal.launch_popup($(this).attr('href'),calculateCorrectWidth(500), calculateCorrectHeight(600),  /* resizable: */false, /* scrollbars: */true, /* showToolbar: */false);
				e.preventDefault();
		});

		$('.popupTall').click(function(e){
				TelstraGlobal.launch_popup($(this).attr('href'),calculateCorrectWidth(700), calculateCorrectHeight(800),  /* resizable: */false, /* scrollbars: */true, /* showToolbar: */false);
				e.preventDefault();
		});

		$('.popupShort').click(function(e){
				TelstraGlobal.launch_popup($(this).attr('href'),calculateCorrectWidth(700), calculateCorrectHeight(400),  /* resizable: */false, /* scrollbars: */true, /* showToolbar: */false);
				e.preventDefault();
		});


		$('.popupDoc').click(function(e){
				TelstraGlobal.launch_popup($(this).attr('href'),  popupWidth, popupHeight, /* resizable: */true, /* scrollbars: */true, /* showToolbar: */false);
				e.preventDefault();
		});

		$('.LiveChat').click(function(e){
				TelstraGlobal.launch_popup($(this).attr('href'),  calculateCorrectWidth(418), calculateCorrectHeight(514), /* resizable: */true, /* scrollbars: */true, /* showToolbar: */false);
				e.preventDefault();
		});

		//IE6,7 issue for clicking on link not return back to its normal style
		 $("a.button").click(function(){
			 $(this).blur();
		});

		 //IE8 issue to add :active style for input and then return to normal style	
	     $("input.button").click(function(){
	    	 $(this).blur();
	    });
});

function calculateCorrectWidth(destWidth){
	var screenWidth=screen.width;
	if(destWidth>=screenWidth){
		destWidth=screenWidth-100;
	}
	return destWidth;
}

function calculateCorrectHeight(destHeight){
	var screenHeight=screen.height;
	if(destHeight>=screenHeight){
		destHeight=screenHeight-200;
	}
	return destHeight;
}


