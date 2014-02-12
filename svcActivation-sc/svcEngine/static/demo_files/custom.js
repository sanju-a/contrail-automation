$(document).ready(function(){
$(".planstable > li").hover(function(){
		$(this).addClass("highlight");
		$('.planstable > li').not(this).removeClass("highlight");
	});
$("#network a span").hover(function(){
        $('#network a span').not(this).stop().animate({ opacity: 0 }, 400);
        },function(){
        $('#network a span').not(this).stop().animate({ opacity: 1 }, 400);
        });
		
	$(".quint > li .contain").hover(function(){
        $(this).find(".mask1").animate({left: "-28px"},200);
		$(this).find(".mask2").animate({right: "-27px"},200);
		$(this).find("a").animate({opacity: 1},400);
        },function(){
       $(this).find(".mask1").animate({left: "-140px"},200);
		$(this).find(".mask2").animate({right: "-140px"},200);
		$(this).find("a").animate({opacity: 0},400);
        });
	$(".testimonial li").hover(function(){
		$(this).find(".spinner").css({opacity: 1});
        $(this).find(".spinner").animate({rotate: '+=720deg'}, 500);
		$(this).animate({color: "#111"}, 300);
        },function(){
			$(this).find(".spinner").animate({opacity: 0}, 300);
			$(this).animate({color: "#444"}, 300);
        });
/**
 * Method to animate the news feed
 */
function scrollNews() {
    // If latest news is not being hovered upon
    if (!$('.latestnews').hasClass('hover')) {
        // Get the currently visible update
        var currentUpdate = $('.theupdates').find('p').filter(':visible').first();
        // Get the next update
        var nextUpdate = currentUpdate.next();
        // If there are no next updates
        if (nextUpdate.length === 0) {
            // Get the first update and set it as the next update
            nextUpdate = $('.theupdates').find('p').filter(':first-of-type');
        }
        // Animate the current update out
        currentUpdate.hide('slow',"easeInOutBack", function () {
            // Animate the next update in
            nextUpdate.show('slow',"easeInOutBack", function () {
                // Delay a little bit and then recursively call this method
                window.setTimeout(scrollNews, 5000);
            });
        });
    } else {
        // Delay a little bit and then recursively call this method
        window.setTimeout(scrollNews, 5000);
    }
}
$('.latestnews').on({
    'mouseover': function (e) {
        $(this).addClass('hover');
    },
    'mouseout': function (e) {
        $(this).removeClass('hover');
    }
});

scrollNews();
if ($('ul#nav ul > li ul > li').length %2 != 0){
    // Odd
}else{
    $('ul#nav > li ul > li:nth-last-child(2) a:link, ul#nav > li ul > li:nth-last-child(2) a:visited').css("border", "none");
}
$('ul#nav ul li a').hover(function(){
        $(this).css({ 'paddingLeft' : '30px', 'width' :'104px' });
        },function(){
		$(this).css({ 'paddingLeft' : '10px', 'width' :'123px' });
        });
$("ul#nav ul:not(ul#nav li#contacttrig ul)").css({display: "none"}); // Opera Fix
$("ul#nav > li:not(ul#nav li#contacttrig)").hover(function(){
		$(this).find('ul:first').css({visibility: "visible",display: "none"}).slideDown(400, "easeInOutBack");
		$(this).addClass("drop");
		},function(){
		$(this).find('ul:first').css({visibility: "hidden"});
		$(this).removeClass("drop");
		});
$("ul#nav > li#contacttrig").hover(function(){
		$('.contact_form').css({visibility: "visible",display: "none"}).slideDown(400, "easeInOutBack");
		$('.contact_form ul').css({visibility: "visible",display: "none"}).slideDown(400, "easeInOutBack");
		$(this).addClass("drop");
		},function(){
			$('.contact_form, .contact_form ul').css({visibility: "hidden"});
		$(this).removeClass("drop");
		});
   $('.tabholder').cycle({ 
    fx:     'fade', 
    speed:   500, 
    timeout: 0,
    pause:   1,
	 after: onAfter
});

function onAfter(curr, next, opts, fwd) {
var index = opts.currSlide;
var $ht = $(this).height();
//set the container's height to that of the current slide
$(this).parent().animate({height: $ht});
}

$('#goto1').click(function() { 
    $('.tabholder').cycle(0); 
	$(this).addClass('active'); 
	$('#goto3, #goto2').removeClass('active'); 
    return false; 
}); 
 
$('#goto2').click(function() {  
    $('.tabholder').cycle(1);  
	$(this).addClass('active'); 
		$('#goto3, #goto1').removeClass('active'); 
    return false;  
}); 
$('#goto3').click(function() {  
    $('.tabholder').cycle(2);  
	$(this).addClass('active'); 
		$('#goto1, #goto2').removeClass('active'); 
    return false;  
}); 
$("#services span a").hover(function(){
        $('#services span a').not(this).stop().animate({ opacity: 0 }, 400);
        },function(){
        $('#services span a').not(this).stop().animate({ opacity: 1 }, 400);
        });
	$(".steps > li:not(.showing)").find(".accord").css({display :'none'});
	$(".steps h4").click(function(){
		$(this).parent("li").toggleClass("showing");
		 $(this).parent("li").find(".accord").slideToggle('fast', function() { });
	});
 $(".pricing > li, .pricing-small > li").hover(function(){
		$(this).css("z-index", "999");
		$(this).addClass("highlight");
		$(this).parent("ul").find("li").not(this).removeClass("highlight");
		$(this).stop().animate({boxShadow: '0 0 15px 5px rgba(0,0,0,0.3)'}, "fast");
		},function(){
		$(this).css('z-index', "5");
		$(this).stop().animate({boxShadow: '0  0 2px 2px rgba(0,0,0,0.14)'}, "fast");
		});
 $(".blogbox li").hover(function(){
		$(this).animate({paddingLeft: "25px", backgroundColor: "white"},"fast");
		},function(){
		$(this).animate({paddingLeft: "15px", backgroundColor: "#f6f6f6"},"fast");
		});
 $(".topofpage a").hover(function(){
		$(this).animate({opacity: "1"},"fast");
		},function(){
		$(this).animate({opacity: "0.1"},"fast");
		});
 $(".btons a").hover(function(){
		$(this).animate({backgroundColor: "rgba(0,0,0,0.9)"},"fast");
		},function(){
		$(this).animate({backgroundColor: "rgba(0,0,0,0.7)"},"fast");
		});
 $(".nextslide, .prevslide").hover(function(){
		$(this).animate({backgroundColor: "#666"},"fast");
		},function(){
		$(this).animate({backgroundColor: "#c0c0c0"},"fast");
		});
 $(".infodet li, .postdetails ul li").hover(function(){
		$(this).find(".circle").animate({backgroundColor: "#666"},"fast");
		},function(){
		$(this).find(".circle").animate({backgroundColor: "#aeaeae"},"fast");
		});
$("a[href='#top']").click(function() {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});
$.fn.cycle.transitions.slideCustom = function($cont, $slides, opts) {
	$caption = $('.serverbig')
	$feature = $('.featurehol')
	$heading = $('h2')
	opts.fxFn = function(curr,next,opts,cb,fwd) {
		$feature.stop().animate({ top: '350px' }, 500, opts.easing);
		$heading.stop().animate({ left: '-550px' }, 500, opts.easing);
		$caption.stop().animate({ right: '-550px' }, 500, opts.easing,  function() {
			$(curr).css({ display: 'block', zIndex: "98"}).stop().animate({ opacity: 0 }, 500, opts.easing, function() {
			});			
			$(next).css({ display: 'block', zIndex: "99"}).stop().animate({ opacity: 1 }, 500, opts.easing);
			$feature.stop().animate({ top: '66px' }, 500, opts.easing);
			$heading.stop().animate({ left: '0' }, 500, opts.easing);
			$caption.stop().animate({ right: '0px' }, 500, opts.easing);
			if(cb) cb();
		});
	}
}
 $('.slidern').cycle({ 
    fx:     'fade', 
    timeout: 0, 
    next:   '.nextslide', 
    prev:   '.prevslide',
	easing: 'easeInOutBack',
	slideExpr: '.slide',
});
 $(".blog > li").hover(function(){
		$(this).find("li.readon").stop().animate({right: '3px'}, "fast");
		},function(){
		$(this).find("li.readon").stop().animate({right: '-200px'}, "fast");
});
});