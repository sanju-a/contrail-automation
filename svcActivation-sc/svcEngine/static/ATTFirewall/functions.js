 
// initiate the marquee
function initMarquee() {
	var currentMarquee = "marquee1";
	// they are already shuffled, so display first one
	$("div#marquee1").show();
	// assign click event to each back button
	$(".back").click( function() {
		var newMarquee = $(this).attr("id");
		newMarquee = newMarquee.replace("back_", "");
		$("div#" + currentMarquee).hide();
		$("div#" + newMarquee).show();
		currentMarquee = newMarquee;
	});	
	// assign click event to each next button
	$(".next").click( function() {
		var newMarquee = $(this).attr("id");
		newMarquee = newMarquee.replace("next_", "");
		$("div#" + currentMarquee).hide();
		$("div#" + newMarquee).show();
		currentMarquee = newMarquee;
	});
}

// initiate the tabs
function initTabs() {
	// hide all of the tab divisions
	$("div.tabsection").hide();
	// click even for each tab
	$("ul.tabnav > li > a").click( function() {
		// tab and div are connected by a.name and div.id
		var a_name = $(this).attr("name");
		// find the corresponding div
		$("div.tabsection").each( function() {
			if( $(this).attr("id") == a_name )
				$(this).show();
			else
				$(this).hide();
		});
		// add 'activetab' class to the new active tab
		$("ul.tabnav a").each( function() {
			if( $(this).attr("name") == a_name ) {
				$(this).parent().addClass("activetab");
			}else {
				$(this).parent().removeClass("activetab");
			}
		});
	});
	
	// display the first tab on initially
	var first_tab = $("ul.tabnav a:first").attr("name");
	$("ul.tabnav a[name='" + first_tab + "']").parent().addClass("activetab");
	$("div.tabsection[id='" + first_tab + "']").show();
}
	
var sectionStates;
function setSectionStates( sections ) {
	sectionStates = sections;
}

function toggleSectionState( sectionID ) {
	sectionStates[sectionID] = ( sectionStates[sectionID] == "closed" )
		? "opened"
		: "closed";
}


function initResourcesAccordian( rtype ) { 
	$(".body > dl").hide();
	$(".body").hide();
	$(".head").click( function() {
		if( $(this).next(".body").is(":hidden") ) {
			$(this).next(".body").show();
			$(this).css("background-color", "#B8D9ED");
			$(this).removeClass("expand").addClass("collapse");
			$(this).next(".body").children("dl").fadeIn("fast");
		} else {
			$(this).css("background-color", "#DDDDDD");
			$(this).removeClass("collapse").addClass("expand");
			$(this).next(".body").children("dl").fadeOut("normal");
			$(this).next(".body").fadeOut("fast");
		}
		toggleSectionState( $(this).attr("name") );
		var str = "";
		for ( var state in sectionStates ) {
			if( sectionStates[state] == "opened" )
				str += state + " ";
		}
	});

	if( $("select#year").length > 0 ) {
		$("select#year").change( function() {
			var year = $(this).val().toLowerCase();
			$("div.body > div").each( function() {
				var id = $(this).attr("id").replace(/pr_/,'');
				if( $(this).is(":hidden") && year == id )
					$(this).show();
				else if( $(this).is(":visible") && year != id )
					$(this).hide();		
			});
		});
		//need to show intial pr block, go by value in select#year
		var selectedYear = $("select#year").val().toLowerCase();
		$("div.body > div#pr_" + selectedYear).show();
	}
	
	if( rtype != null && rtype != "null" ) {
		var initial = $(".head[href='#" + rtype + "']");
		$(initial).next(".body").show();
		$(initial).css("background-color", "#B8D9ED");
		$(initial).removeClass("expand").addClass("collapse");
		$(initial).next(".body").children("dl").fadeIn("fast");
		toggleSectionState( $(initial).attr("name") );
	}else {
		// open all
		$(".head").each( function() {
			if( $(this).next(".body").is(":hidden") ) {
				$(this).next(".body").show();
				$(this).css("background-color", "#B8D9ED");
				$(this).removeClass("expand").addClass("collapse");
				$(this).next(".body").children("dl").fadeIn("fast");
			}
		});
		$("a#view_all").text( "Collapse All" );	
	}
	
	$("a#view_all").click( function() {
		if( $(this).text() == "View All" ) {
			$(".head").each( function() {
				if( $(this).next(".body").is(":hidden") ) {
					$(this).next(".body").show();
					$(this).css("background-color", "#B8D9ED");
					$(this).removeClass("expand").addClass("collapse");
					$(this).next(".body").children("dl").fadeIn("fast");
				}
			});
			$(this).text( "Collapse All" );
		}else{
			$(".head").each( function() {
				if( !$(this).next(".body").is(":hidden") ) {
					$(this).next(".body").hide();
					$(this).css("background-color", "#DDDDDD");
					$(this).removeClass("collapse").addClass("expand");
					$(this).next(".body").children("dl").fadeOut("normal");
					$(this).next(".body").fadeOut("fast");
				}
			});
			$(this).text( "View All" );
		}
	});
	//initToggleAll();	
	initSmoothScroll();	
}



function initBrowseResources( rtype ) {	

	$(".body > dl").hide();
	$(".body").hide();
	$(".head").click( function() {
		if( $(this).next(".body").is(":hidden") ) {
			$(this).next(".body").show();
			$(this).css("background-color", "#B8D9ED");
			$(this).removeClass("expand").addClass("collapse");
			$(this).next(".body").children("dl").fadeIn("fast");
		} else {
			$(this).css("background-color", "#DDDDDD");
			$(this).removeClass("collapse").addClass("expand");
			$(this).next(".body").children("dl").fadeOut("normal");
			$(this).next(".body").fadeOut("fast");
		}
		toggleSectionState( $(this).attr("name") );
		var str = "";
		for ( var state in sectionStates ) {
			if( sectionStates[state] == "opened" )
				str += state + " ";
		}
	});

	if( $("select#year").length > 0 ) {
		$("select#year").change( function() {
			var year = $(this).val().toLowerCase();
			$("div.body > div").each( function() {
				var id = $(this).attr("id").replace(/pr_/,'');
				if( $(this).is(":hidden") && year == id )
					$(this).show();
				else if( $(this).is(":visible") && year != id )
					$(this).hide();		
			});
		});
		//need to show intial pr block, go by value in select#year
		var selectedYear = $("select#year").val().toLowerCase();
		$("div.body > div#pr_" + selectedYear).show();
	}
	if( rtype != null && rtype != "null" ) {
		var initial = $(".head[href='#" + rtype + "']");
		$(initial).next(".body").show();
		$(initial).css("background-color", "#B8D9ED");
		$(initial).removeClass("expand").addClass("collapse");
		$(initial).next(".body").children("dl").fadeIn("fast");
		toggleSectionState( $(initial).attr("name") );
	}else {
		// open all
		$(".head").each( function() {
			if( $(this).next(".body").is(":hidden") ) {
				$(this).next(".body").show();
				$(this).css("background-color", "#B8D9ED");
				$(this).removeClass("expand").addClass("collapse");
				$(this).next(".body").children("dl").fadeIn("fast");
			}
		});
		$("a#get_all").text( "Collapse All" );	
	} 
	
	$("a#get_all").click( function() {
		if( $(this).text() == "Expand All" ) {
			$(".head").each( function() {
				if( $(this).next(".body").is(":hidden") ) {
					$(this).next(".body").show();
					$(this).css("background-color", "#B8D9ED");
					$(this).removeClass("expand").addClass("collapse");
					$(this).next(".body").children("dl").fadeIn("fast");
				}
			});
			$(this).text( "Collapse All" );
		}else{
			$(".head").each( function() {
				if( !$(this).next(".body").is(":hidden") ) {
					$(this).next(".body").hide();
					$(this).css("background-color", "#DDDDDD");
					$(this).removeClass("collapse").addClass("expand");
					$(this).next(".body").children("dl").fadeOut("normal");
					$(this).next(".body").fadeOut("fast");
				}
			});
			$(this).text( "Expand All" );
		}
	});
	//initToggleAll();	
	initSmoothScroll();	
}


var all_open = false;

function initSmoothScroll() {
	$('a[href*=#]').click( function() {
		if( location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
			&& location.hostname == this.hostname ) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
			if( $target.length) {
				var targetOffset = $target.offset().top - 30;
				if( targetOffset < 0 ) targetOffset = 0;
				$('html,body').animate({scrollTop: targetOffset}, 1000);
				return false;
			}
		}
	});	
}

var dropdownBorder = {
	backgroundColor: "#FFF",
	backgroundImage: "url(/library/style/images/secondaryleftbrdr_s.gif)",
	backgroundRepeat: "no-repeat",
	backgroundPosition: "left -1px"
};

// fix IE6 dropdown bug, select box appears above it
var g_popUpIFrame;

function initDropdown() {
	$("li.dropdown").hover(
		// show dropdown menu
		function() {
			var iFrame = null;
			$(this).css(dropdownBorder);
			// extend height of nav so menu covers anything below
			$("div#secondaryNav").height("500px");
			$("div#secondaryNav").width("1500px");
			// show right graphic of nav item
			$(".rightPost", this).show();
			//$("#buffer", this).show();
			// show the menu
			$(this).css('z-index','100');
			$(this).height("40px");

			if ($(this).position().top != 0)	{
				$(this).css('backgroundImage','none');
			}
			// fix for safari browser, get the width
			var width_this = $(this).width();
			$("div.submenu", this).show();
			var widthsubmenu = $('div.submenu', this).width();
			// fix for safari browser, set the width
			$(this).width(width_this);
			var startingpos =  $(this).position().left;

			var extending = startingpos + widthsubmenu;
			$('div.submenu', this).css("position", "absolute");
			var endingpos = startingpos + $(this).width();
			if (extending > 926 && endingpos < 950 ) {
				var leftadj = (widthsubmenu - $(this).width()) + 15;
				$("div.submenu", this).css("left","-" + leftadj + "px");
			}
			$("div#secondaryNav").width("950px");
			$('div.submenu', this).css("width", widthsubmenu+"px");

			if( isIE6() ) {
				iFrame = document.createElement("IFRAME");
				iFrame.setAttribute("src", "");
				
				//Match iFrame with the dropdown attribute
				var dropdown = $("div.submenu", this);
				var z = dropdown.css("z-index");
				dropdown.css("z-index", z + 10);
				iFrame.id = "iframe";
				iFrame.style.position = "absolute";
				iFrame.style.filter = "alpha(opacity=0)";
				iFrame.style.left = dropdown.css("left");
				iFrame.style.top  = dropdown.css("top");
				iFrame.style.width = dropdown.width() + 15 + "px";
				iFrame.style.height = dropdown.height() + "px";
				iFrame.style.backgroundColor = "#808FFe";
				$(this).append(iFrame);
			}
		},
		// hide dropdown menu
		function() {
			$(this).css('z-index', '20');
			$("div.submenu", this).hide();
			$("div#secondaryNav").height("42px");
			$(".rightPost", this).hide();
			$(this).css("background", "none");
			if( isIE6() ) {
				$(this).remove("#iframe");
				var dropdown = $("div.submenu", this);
				var z = dropdown.css("z-index");
				dropdown.css("z-index", z - 10);
			}
		}
	);
}

function isIE6() {
	return( $.browser.msie && parseInt($.browser.version) == 6 );
}



