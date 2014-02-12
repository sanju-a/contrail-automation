jQuery(function(){

	// Setup tooltips
	$('.tooltip').each(function(i){

		var display_tooltip, remove_tooltip;
		$('<span tabindex="0" class="tooltip-trigger"></span>').insertBefore($(this))
		.mouseover(display_tooltip = function(e){
			var trigger = $(this);
			if(e.type == 'keydown' && e.keyCode != 13 && e.keyCode != 10 && e.keyCode != 32){
				return true;
			}
			$('#tooltip-hover').remove();

			var is_telstra = ($('#pagewidth')[0]) ? true : false;

			var tooltip = $('<div id="tooltip-hover"></div>')
			.html('<div>'+$(this.nextSibling).html()+'</div>')
			.prependTo('body')
			.css({
				top: $(this).offset().top,
				left: $(this).offset().left,
				'z-index': 32768
			}).attr('tabindex', '0');

			if(parseInt(tooltip.css('left')) + tooltip.width() > $(window).width()){
				$('#tooltip-hover').css({
					left: $(this).offset().left - tooltip.width() - 24
				});
			}

			return false;
		})
		.keydown(display_tooltip)
		.mouseout(remove_tooltip = function(){
			/* TODO: check if moving onto tooltip */
			$('#tooltip-hover').remove();
			return true;
		});
	})
	.hide();

});
