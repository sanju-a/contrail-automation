//function for Lightbox, which populating rel attribute of Lightbox links and set the width/height of the Lightbox window
(function($){
	$.fn.updateLighboxLinks = function(){		
	    //just for inline Lightbox
		$("a[href^='#lightbox-']").each(function (i) { 
		
		  var hrefAttr = $(this).attr("href");
       	  $(this).attr("rel", "lightbox");        	
       	  var targetId=hrefAttr.substring(1);
		  targetId=jQuery.trim(targetId);
       	         	        	  
       	  var targetDiv="div[id='";
       	  targetDiv+=targetId+"']";
       	  
       	  var foundDiv=$(targetDiv); 
       	  if(foundDiv && foundDiv!=null && foundDiv.length>0){ 
       	  		var lb_width = foundDiv.attr("lbwidth");
       	  		var lb_height=foundDiv.findCorrectHeight(foundDiv);
				$(this).click( function(event) {									
					if(lb_width && lb_width!=null)
						oB.settings.inlineWidth=lb_width;
					if(lb_height!=0)
						oB.settings.inlineHeight=lb_height;			
				});  
       	  }
       	           	        	   
		});
		
		//just for external Lightbox
		$("a[href*='?lightbox-']").each(function (i) {
       	  
		  var hrefAttr = $(this).attr("href");
       	  $(this).attr("rel", "lightbox");
       	  var targetId=hrefAttr.substring(hrefAttr.lastIndexOf("?")+1); 
		  targetId=jQuery.trim(targetId);
       	  
       	  var targetSpan="span[id='";
       	  targetSpan+=targetId+"']";       	  
       	  
       	  var foundSpan=$(targetSpan);
       	  if(foundSpan && foundSpan!=null && foundSpan.length>0){
       		 var linkTarget = foundSpan.attr("title");
       		 if(linkTarget && linkTarget!=null && linkTarget.length>0){
       		 	$(this).attr("href", linkTarget+"?iframe");
       		}
       		     		
       		var lb_width = foundSpan.attr("lbwidth");
       		var lb_height=foundSpan.findCorrectHeight(foundSpan);       		
			$(this).click( function(event) {				
				if(lb_width && lb_width!=null)
					oB.settings.iframeWidth=lb_width;
				if(lb_height!=0)
					oB.settings.iframeHeight=lb_height;					
			});
       	  }
       	           	        	   
		});
	};
	
	$.fn.findCorrectHeight = function(spanOrDiv){
       	var lb_height = spanOrDiv.attr("lbheight");
       	var calcHeight=0;
       	if(!lb_height && lb_height==null)
       		return calcHeight;
       	
       	var height_number = lb_height.substring(0,lb_height.indexOf("-"));
       	var height_unit = lb_height.substring(lb_height.indexOf("-")+1);       	
		if(height_unit=="px"){	
			var windowsHeight=$(window).height();
			var correct_height=windowsHeight*(0.75);
			calcHeight=height_number;
			if(	correct_height < calcHeight){
				 calcHeight=correct_height;
			}			    		
		}
	    else if(height_unit=="pr"){
			var correct_height=0.75;
			calcHeight=(height_number/100);
			if(	correct_height < calcHeight){
				  calcHeight=correct_height;
			}				    		
		}
		else if(height_unit=="auto"){
			calcHeight=0.75;	    		
		}        		
		return calcHeight;
	};
	
})(jQuery);

//function call to update Lightbox links
$(function(){	
	$('a').updateLighboxLinks();	
	TelstraGlobal.initialise_omniture();
});
