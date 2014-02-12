/* 
 * jQuery tabs plugin
 *
 * Author: Lindsay Evans, Boomworks <lindsay@boomworks.com.au>
 * Created: 27/06/2011
 *

Basic usage:

<ul class="tabs">
	<li><a href="#tab-1">Tab 1</a></li>
	<li><a href="#tab-2">Tab 2</a></li>
	<li><a href="#tab-3">Tab 3</a></li>
</ul>

<div id="tab-1">...</div>
<div id="tab-2">...</div>
<div id="tab-3">...</div>

<script>
$('.tabs').tabs();
</script>

*/

/*
 * TODO: 
 * - Fix scrolling issues
 * - Keyboard shortcuts as per http://dev.aol.com/dhtml_style_guide#tabpanel ?
 */

(function($){

	$.fn.tabs = function(options){

		// Merge options & default settings
		var settings = $.extend({}, $.fn.tabs.defaults, options);

		return this.each(function(i){
			var $tabButtons = $(this), $tabButtonLinks,
				currentTabAnchor = window.location.hash || '',
				targetFound = false;

				
			//Start- This var Added by NAZ 24-10-2011
			var $foundedCurrentTab;
			//End- Added by NAZ 24-10-2011
			// Loop over tab buttons
			$tabButtonLinks = $tabButtons
				.addClass(settings.classPrefix + 'buttons')
				.attr('role', 'tablist')
				.find(settings.tabButtonSelector)
				.attr('role', 'tab')
				.each(function(ii){

					var $this = $(this),
						targetID = $this.attr('href').split('#')[1],
						$target = $('#' + targetID, settings.context),
						_tabID = settings.classPrefix + i + '-' + ii;

					$this.attr('id', _tabID);

					// For Omniture tracking
					$this.addClass('tracklink');

					if($target.length){
						// Update ID of target to prevent page scrolling to current tab
						// TODO: should we do this the other way around to prevent scroling before document.ready?
						$target
							.attr('id', $target.attr('id').replace('tab-', 'enabled-' + settings.classPrefix))
							.addClass(settings.classPrefix + 'content')
							.attr('role', 'tabpanel')
							.attr('aria-hidden', 'true')
							.attr('aria-labelledby', _tabID);
					}

					// Check if we've found a bookmarked tab
					if(currentTabAnchor === '#' + targetID){
						targetFound = true;
						$foundedCurrentTab=$this;
					}

				}
			);

			// If there isn't a bookmarked tab found, we'll show the first tab by default
			// TODO: make this configurable?
			if(!targetFound){
				currentTabAnchor = '#' + $($tabButtonLinks[0]).attr('href').split('#')[1];
				$foundedCurrentTab=$($tabButtonLinks[0]);
			}	

           //Start- resolve the issue for IE6 and IE7 to select the default tab initially on opening of the Lightbox window: Added by NAZ 24-10-2011			
			var targetID = 'enabled-ui-' + $foundedCurrentTab.attr('href').split('#')[1],
				$target = $('#' + targetID);								
			$foundedCurrentTab.parents('li').addClass(settings.classPrefix + 'current');
			$target.addClass(settings.classPrefix + 'current').attr('aria-hidden', 'false');
            //End- Added by NAZ 24-10-2011 
			// Bind to click & init events for each tab button
			$tabButtonLinks.bind('click init', function(e){;

				var $this = $(this),
				    targetID = 'enabled-ui-' + $this.attr('href').split('#')[1],
					$target = $('#' + targetID),
					$currentTabButton = $tabButtons.find('.' +settings.classPrefix + 'current a'),
					currentTabID, $currentTab;

				// remvoe current state if it exists
				if($currentTabButton.length){
					currentTabID = 'enabled-ui-' + $currentTabButton.attr('href').split('#')[1];
					$currentTab = $('#' + currentTabID);
					$currentTabButton.parents('li').removeClass(settings.classPrefix + 'current');
					$currentTab.removeClass(settings.classPrefix + 'current');
					$currentTab.attr('aria-hidden', 'true');
				};

				// Add the current state to the selected tab
				$this.parents('li').addClass(settings.classPrefix + 'current');
				$target.addClass(settings.classPrefix + 'current')
					.attr('aria-hidden', 'false');

				// Don't update the location if this is the first run
				if(e.type !== 'init'){
								// TODO: stop from scrolling to top of page etc.
								window.location.hash = '#' + targetID.replace('enabled-ui-', '');
				} else if (window.location.hash !== '') {
								$('html, body').animate({ scrollTop: $(this).parents('li').offset().top - 10 }, 0);
				}


				$tabButtons.trigger('ui-tab:change', [$this]);

				e.preventDefault();

			})

			// Filter down to the initial tab & trigger init event
			.filter('[href="' + currentTabAnchor + '"]')
			.trigger('init');		

			// Bind to hover events on li (for browsers that don't support li:hover)
			$tabButtons.find('li').hover(function(){
				$(this).addClass(settings.classPrefix + 'hover');
			}, function(){
				$(this).removeClass(settings.classPrefix + 'hover');
			});

		});
		
	};

	// Default configuration
	$.fn.tabs.defaults = {
		classPrefix: 'ui-tab-',
		tabButtonSelector: 'li a',
		context: document
	};

})(jQuery);

/* Code - RUTD - 249 - Start */
(function($){
	$.fn.updateLinksToTabs = function(options){	
		var tabHrefValues=new Array();
		var listOfLinks=new Array();
		$(".tabs").each(function (i) {
			$(this).find('li a').each(function(ii){
				var $this = $(this)
				var hrefAttr = $this.attr("href");
				tabHrefValues.push(hrefAttr); 
				listOfLinks.push($this);				
			});
		});
	  $("a[href*=#]").not(".tabs a").each(function (j) {
		var hrefAttr = $(this).attr("href");		  
			for(var k=0;k<tabHrefValues.length;k++){
				var name=tabHrefValues[k];			
				if(hrefAttr.indexOf(name)>-1){						
					var destDivId = name.substring(name.indexOf("#")+1);
					var destLi=listOfLinks[k];				
					$(this).bind('click', function(e){
						
						//find current tab and close it					
						var $currentUL=$(destLi).parents('li').parents('ul');					
						$currentUL.find("li").each(function (m) {
							
							var classAttr=$(this).attr("class");
							if(classAttr=="ui-tab-current"){							
								$(this).removeClass('ui-tab-current');
								$(this).attr('aria-hidden', 'true');
								var currentDivId=$(this).children('a').attr('href');							
								
								currentDivId = currentDivId.substring(currentDivId.indexOf("#")+1);							
								var currentDiv=$('#enabled-ui-' + currentDivId);
								currentDiv.removeClass('ui-tab-current');
							}						
						
						});			
						
						//open founded tab
						var targetID = 'enabled-ui-' + destDivId,
						$target = $('#' + targetID);								
						destLi.parents('li').addClass('ui-tab-current');
						$target.addClass('ui-tab-current').attr('aria-hidden', 'false');
						var currentAdd=window.location.href;
						currentAdd=currentAdd.substring(0,currentAdd.indexOf("#"));
						window.location.hash="#"+destDivId;
						$('html, body').animate({ scrollTop: $(destLi).offset().top - 10 }, 0);
						e.preventDefault();
					});
					break;
				} 
			}     	        	   
		});
	};
	$('a').updateLinksToTabs();	
})(jQuery);
/* Code - RUTD - 249 - End */