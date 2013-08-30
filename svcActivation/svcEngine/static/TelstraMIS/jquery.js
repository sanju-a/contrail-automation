//jQuery Colour Animation Function - Could be removed if needed
/*
(function(d){d.each(["backgroundColor","borderBottomColor","borderLeftColor","borderRightColor","borderTopColor","color","outlineColor"],function(f,e){d.fx.step[e]=function(g){if(!g.colorInit){g.start=c(g.elem,e);g.end=b(g.end);g.colorInit=true}g.elem.style[e]="rgb("+[Math.max(Math.min(parseInt((g.pos*(g.end[0]-g.start[0]))+g.start[0]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[1]-g.start[1]))+g.start[1]),255),0),Math.max(Math.min(parseInt((g.pos*(g.end[2]-g.start[2]))+g.start[2]),255),0)].join(",")+")"}});function b(f){var e;if(f&&f.constructor==Array&&f.length==3){return f}if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}if(e=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)){return[parseFloat(e[1])*2.55,parseFloat(e[2])*2.55,parseFloat(e[3])*2.55]}if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}if(e=/rgba\(0, 0, 0, 0\)/.exec(f)){return a.transparent}return a[d.trim(f).toLowerCase()]}function c(g,e){var f;do{f=d.curCSS(g,e);if(f!=""&&f!="transparent"||d.nodeName(g,"body")){break}e="backgroundColor"}while(g=g.parentNode);return b(f)}var a={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]}})(jQuery);
*/
//** Feature Banner jQuery Plugin **//
/* Requried Options
 * animate: fade, slidevert, slidehoriz, none
 * speed: 0 - inf
 * icons: true / false
 * iconpos: (bottom, left) | (bottom, center) | (bottom, right) | (top, left) | (top, center) | (top, right)}
 * horizarrows: true / false
 * vertarrows: true / false	 
 * socialbuttons: true / false
 * socialbtnpos: (see icon pos)
 * maxwidth: Xpx
 * maxheight: Xpx
 */

/*
 * LICENCE GOES HERE
 * Author:
 */
(function( $ ){
	var settings = { 
			'bannerwidth': 'auto',
			'bannerheight': 'auto',
			'mode' : 'fade',
			'speed': 500,
			'delay' : 3000,
			'iconPos' : 'bl',
			'icons' : false,
			'icontype' : 'none',			
			'iconHover': 'showbanner',
			'easing' : ' swing'			
		};
	var internal = {
		setTimer : function(id, options) {		    	
		    //** Function that creates a timer to activate animation
			timers.push(setTimeout(function() {
				internal.showItem(id, options);
	    	},settings.delay));
		},
		
		showItem : function( id, options ) { 
		// ** Core animation function, handles all methods of animation
			$this = $('#' + id);
		    //** Clear the vars
		    var nextBanner = '';
		    var banners = '';
		    var icons = '';
		    var nextBanner = '';
		    var nextIcon = '';
				
		    //** Setup the vars	 
			$this = $('#' + id);
			//** Get the current Active Item
			banners = $this.find(".fbBannerList").children('.active');
			icons = $this.find(".fbIconList").children('.active');
			//** Is there another item? if not - start at beginning
			if ($(banners).next().length > 0) {
				nextBanner = $(banners).next(); 					
			} else {
			   	//** Loop back to start
			   	nextBanner = $(banners).parent().children().first();		    		
			}
			
			//** Fade Active Icons (No options, just fade)
			if ($(icons).next().length > 0) {
				nextIcon = $(icons).next(); 					
			} else {
			   	nextIcon = $(icons).parent().children().first();		    		
			}
			
			methods.showBanner(id, nextIcon.find('a').attr('class'));
		}
	};
	
	var instanceName = '';
	var timers = new Array();
	var methods = {		
		init : function( options ) {
			return this.each(function(){
				var $this = $(this);
				if ( options ) { $.extend( settings, options ); }
				$this.data('featureBanner', {
					target : $(this)
				});
				var thisId = this.id;
				vardata = $this.data('featureBanner');
				var instanceName = $this.attr('id');		
				$this.addClass('featureBanner');
				var timeoutID = '';
				//** Mouse Leave - Entire
				$this.mouseleave(function(e) {});
				//** LI Items Loop Setup
				//** Apply classes and styles, initial setup
				var banners = $this.find(".fbBannerList").children('li');				
				if (settings.icons===true) {
					$this.append("<div class='fbBannerIcons'><ul class='fbIconList'></ul></div>");
				} else {
					$this.append("<div class='fbBannerIcons hidden'><ul class='fbIconList'></ul></div>");
				}
				
				
				//Attempt to get the banner image and size on load
				if (settings.bannerheight=='auto') {
					$('body').append('<div id="FBoffscreen"></div>');
					bannerimgObj = $this.find('img');
					$('#FBoffscreen').html(bannerimgObj.first().clone());
					baseBanner = $('#FBoffscreen').first('img');
					baseHeight = baseBanner.height();
					baseWidth = baseBanner.width();
				} else {
					baseHeight = settings.bannerheight;
					baseWidth = settings.bannerwidth;
				}
				/* Hard code Icon Heights
				$('#FBoffscreen').html(bannerimgObj.last().clone());
				baseIcon = $('#FBoffscreen').first('img');
				iconHeight = baseIcon.height() + 30;
				*/
				
				if (settings.icons === false || banners.length <= 1 ) { 
					iconHeight = 0;
					iconWidth = 0;
					$this.find(".fbIcon").css('display', 'none');
					$this.find(".fbIcon").css('height', 0);
				} else if (settings.icontype=='numeric') {
					if (settings.iconPos == 'innertl' || settings.iconPos == 'innertr' || settings.iconPos == 'innerbl' || settings.iconPos == 'innerbr') {
						iconHeight = 0;
						iconWidth = 15;
					} else {
						iconHeight = 40;
						iconWidth = 15;
					}
				} else if (settings.icontype=='circle') {
					if (settings.iconPos == 'innertl' || settings.iconPos == 'innertr' || settings.iconPos == 'innerbl' || settings.iconPos == 'innerbr') {
						iconHeight = 0;
						iconWidth = 15;
					} else {
						iconHeight = 40;
						iconWidth = 15;
					}
				} else if (settings.icontype=='image') {
					if (settings.iconPos == 'innertl' || settings.iconPos == 'innertr' || settings.iconPos == 'innerbl' || settings.iconPos == 'innerbr') {
						iconHeight = 0;						
					} else {
						iconHeight = 100;
					}
					/*
					bannerimgObj = $this.find('img');
					$('#FBoffscreen').html(bannerimgObj.last().clone());
					baseIcon = $('#FBoffscreen').first('img');
					iconHeight = baseIcon.height() + 30;
					iconWidth = baseIcon.width();
					*/
				}
					
				if ($('#FBoffscreen').length > 0 ) {
					$('#FBoffscreen').remove();
				}
				//** Set the height:				
				totalHeight = (baseHeight + iconHeight) * 1;
				
				//* Apply the total height to the entire container (preserve page layout)
				$this.css('height', totalHeight + 'px');
				//console.log("t" + totalHeight + " - b " + baseHeight + " - i " + iconHeight);
				paddingAmt = 0;
				if (settings.iconPos == 'tl' || settings.iconPos == 'tr' ) {
					if (settings.icontype=='image') {
						paddingAmt = 100;
					} else if (settings.icontype=='circle' || settings.icontype=='numeric') {
						paddingAmt = 40;
					} else {
						paddingAmt = 0;
					}
					$this.find('.fbBannerContainer').css('marginTop', paddingAmt + 'px');
				}
				console.log($this.height());
				//** If there are no more than 1 Banner, Do not make icons or animate!!
				
				$(banners).each( function(index) {
					//** Hide All Banners
					var $thisBanner = $(this);	
					
					bannerW = baseWidth;
					if (settings.mode=='fade') {
						$thisBanner.css("display", "none");
					} else {
						$thisBanner.css("left", -bannerW);
					}
					$thisBanner.addClass('fbPanel-' + (index+1));
					$thisBanner.children('a').attr('tabindex', '-1');
					
					//if (settings.icons===true  && banners.length >= 2) {
						bannerSrc = '';
						bannerSrc = $thisBanner.children('.fbIcon').children('img').attr('src');
					
						$('#' + thisId + " .fbIconList").addClass(settings.iconPos);
						
						if ($thisBanner.find('img').attr('alt').length <= 0 ) {
							bannerTip = "";
						} else {
							bannerTip = $thisBanner.find('img').attr('alt');
						}
						
						if (settings.icontype==='image') {
							$('#' + thisId + " .fbIconList").append("<li class='icon"+(index+1)+" image'><a href='' class='fbIcon-"+(index+1)+"' title='"+bannerTip+"' style='background-image: url("+bannerSrc+");'><div class='fbToolTip'>"+bannerTip+"</div></a></li>");
						} else if (settings.icontype==='numeric') {
							$('#' + thisId + " .fbIconList").append("<li class='icon"+(index+1)+" numeric'><a href='' class='fbIcon-"+(index+1)+"' title='"+bannerTip+"'>"+(index+1)+"</a></li>");
						} else if (settings.icontype==='circle') {
							$('#' + thisId + " .fbIconList").append("<li class='icon"+(index+1)+" circle'><a href='' class='fbIcon-"+(index+1)+"' title='"+bannerTip+"'></a></li>");
						} else {							
							$('#' + thisId + " .fbIconList").append("<li class='icon"+(index+1)+"'><a href='' class='fbIcon-"+(index+1)+"' title='"+bannerTip+"'></a></li>");
						}
						$thisBanner.children('.fbIcon').children('img').remove();						
					//}
					//** Mouse Over
					$thisBanner.mouseover(function(e) {
						for (var i = 0; i < timers.length; i++)	{
							clearTimeout(timers[i]);
						}						
					});
					//** Mouse Leave
					$thisBanner.mouseleave(function(e) {
						internal.setTimer(thisId);
					});
				});
				
				//** Attach click command to icon list
				$('#' + thisId + " .fbIconList").find('a').each(function(i) {
					var thisIndex = '';
					var $thisIcon = '';
					var $icon = $(this); 
					$icon.parent().css('opacity', .5);
					if (banners.length >=2) {
						$icon.click(function() {
							methods.showBanner(thisId, this.className);						
							return false;
						});
					} else {
						$icon.click(function() { return false;});
					}
					//Apply Hover Functions to display tooltip
					$icon.mouseover(function() {						
						if (settings.iconHover=='showtip') {
							iconOff = $icon.offset();
							$icon.siblings('div.fbToolTip').stop(true, true);
							$icon.siblings('div.fbToolTip').fadeIn(150);
							$icon.stop(true, true);
							$icon.animate({
								opacity: 1
							}, 150);
						} else if (settings.iconHover=='showbanner') {
							methods.showBanner(thisId, this.className);
							methods.pause(thisId);							
						}
					});
					$icon.mouseleave(function() {
						if (settings.iconHover=='showtip') {
							$icon.siblings('div.fbToolTip').stop(true, true);
							$icon.siblings('div.fbToolTip').fadeOut(150);
							if ($icon.parent().hasClass('active')) {} else {
								$icon.stop(true, true);
								$icon.animate({
									opacity: .5
								}, 150);
							}
						} else if (settings.iconHover=='showbanner') {
							methods.play(thisId);
							
						}
					});
    			});    	
				
				// Set the location of the icons tooltip
				
				
					if (settings.iconHover=='showbanner') {
						//$('.fbToolTip').css({'position': 'relative', 'fontSize': '1em', 'display': 'inline-block', 'width': 'auto'});
						$('.fbToolTip').css({'fontSize': '.8em', 'display': 'inline-block', 'width': 'auto'});						
						var iToolTipPos = $this.position();
						//$this.find(".fbIconList li .fbToolTip").css('left', iToolTipPos.left);
					} else {
						var iToolTipPos = $this.find(".fbIconList").width();
						$this.find(".fbIconList li .fbToolTip").css('left', iToolTipPos + 20);
					}
					var firstIcon = $this.find(".fbIconList").children('li').first();	
					
					//** Show First Banner
					if (settings.mode=='fade') {
						$(banners).first().show();
					} else {
						$(banners).first().css("left", 0);
						//* Get the height of the first banner					
					}
					$(banners).first().addClass("active");
					$(banners).first().siblings('a').attr('tabindex', '1');
					firstIcon.addClass('active').css('opacity', 1);
					//$('#nav-main').children('ul li').css('position', 'absolute');
					//$('#nav-main').children('ul li').css('z-index', 100);
				
					if($.browser.msie && $.browser.version=="6.0") {
						//$('#navLogo').append("<div style='height: 33px; position: absolute; left: 200px; bottom: 0px; width: 550px; background-color: #A0D6F9; text-align: center;'><strong>Please Note:</strong> You are using Internet Explorer 6 or below.<br /> Elements of this page may not appear correctly, Please consider upgrading your browser.</div>")
					}
					
					//** Start the timer	
			    	if (banners.length >=2) {
						internal.setTimer(this.id, options);
					}
				
			    	$this.show(function() {});
			});
	    },
	    pause : function (options) {
	    	//** Pause the animation
			for (var i = 0; i < timers.length; i++)	{
				//console.log("timer" + i)
				clearTimeout(timers[i]);
			}	
			//clearTimeout(timers[timers.length-1]);
		},
		play : function (id) {
			//** Resume the animation
			timers.push(setTimeout(function() {				
				internal.showItem(id);
	    	},settings.delay));
		},
		showBanner: function (id, iconId) {
			$this = $('#' + id);
			//** Get the current Active Item
			banners = $this.find(".fbBannerList").children('.active');
			icons = $this.find(".fbIconList").children('.active');
			$thisIcon = $('#' + iconId);
			thisIndex = iconId.split('-');
			thisIndex = thisIndex[1];  
			var banners = $('#' + id).find(".fbBannerList").children('.active');
			var nextBanner = $('#' + id + ' .fbPanel-' + thisIndex);
			if (nextBanner.hasClass('active')) {
				return false;
			}
								
			$(banners).stop(true,true);
			nextBanner.stop(true,true);    	    		
			//** Clear all timers in the array
			for (var i = 0; i < timers.length; i++)	{
				clearTimeout(timers[i]);
			}						
			
			//** Show Active Icons (No options, just fade)
			thisIcon = $('#' + id).find('.' + iconId).parent();
			$(icons).removeClass('active');
			$(icons).animate({
				opacity: .5
			}, settings.speed, function() {
			});			
			thisIcon.addClass('active');
			thisIcon.animate({
				opacity: 1
				}, settings.speed, function() {
			});
			//** On click, hide active panel    				
			
			
			
			nextBanner.addClass('active');
			
			var bannerW = settings.bannerwidth;
			if (settings.mode=="fade") {
		    //** Fade Option
			$(banners).css('z-index', '0');
			nextBanner.css('z-index', '1');
			nextBanner.fadeIn(settings.speed, settings.easing, function() {
				$(banners).hide();
				nextBanner.css('z-index', '0');
				$(banners).removeClass('active');  
				timers.push(setTimeout(function() { 
					//console.log(thisId + "id");
					internal.setTimer(id, settings);
					}, (settings.delay)));
				});
			} else {
			//** Slide Option
				//nextBanner.css('left', 0);
				$(banners).animate({
					left: bannerW
					}, settings.speed, settings.easing, function() {
						$(banners).children('a').attr('tabindex', '-1');
						$(banners).removeClass('active');
						$(banners).css('left', -bannerW);	
				});	 		
				nextBanner.addClass('active');
				nextBanner.children('a').attr('tabindex', '0');
				nextBanner.animate({
					left : 0
					},settings.speed, settings.easing, function() {
						internal.setTimer(id, settings);	
				});
				
			}
		}
	};
	$.fn.featureBanner = function( method ) {	    
	//** Method calling logic
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	    } else if ( typeof method === 'object' || ! method ) {
	    	return methods.init.apply( this, arguments );
	    } else {
	    	$.error( 'Method ' +  method + ' does not exist on jQuery.featureBanner' );
	    }    	  
	};
})( jQuery );