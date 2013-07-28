
$(function() {
    $.fn.scrollBottom = function() {
        return $(document).height() - this.scrollTop() - this.height();
    };

    var $el = $('#social-share');
    var $window = $(window);

    $window.bind("scroll resize", function() {
        var gap = $window.height() - $el.height() - 250;
      //  var visibleFoot = 157 - $window.scrollBottom();
	if($('#social-share').offset().left == 0){
			  var visibleFoot = 180-$window.scrollBottom();
		}
		else{
		
			  var visibleFoot = 166;
		}
        var scrollTop = $window.scrollTop()
        
        if(scrollTop <  40){
            $el.css({
                top: (5 - scrollTop) + "px",
                bottom: "auto"
            });
        }else if (visibleFoot > gap) {
            $el.css({
                top: "auto",
                bottom: visibleFoot + "px"
            });
        } else {
            $el.css({
                top: 0,
                bottom: "auto"
            });
        }
    });
});

