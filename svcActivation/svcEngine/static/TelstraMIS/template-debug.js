// Misc. template debugging methods
$(function(){
	$(document).keydown(function(e){

		// Ctrl+Shift+G - display grid overlay
		if(e.ctrlKey && e.shiftKey && e.keyCode === 71){
			TelstraGlobal.show_grid();
			e.preventDefault();
		}

		// Ctrl+Shift+C - display container classes
		if(e.ctrlKey && e.shiftKey && e.keyCode === 67){
			TelstraGlobal.show_container_classes();
			e.preventDefault()
		}
	});
});

// Display grid overlay
TelstraGlobal.show_grid = function(){
	if($('#v10-debug-grid').length){
		$('#v10-debug-grid').remove();
		return false;
	}
	var grid_html = '<div class="container_18" id="v10-debug-grid" style="text-align:center;font-size:3em;color:#000;position:absolute;top:0;left:'+($('#page-body').offset().left + 5)+'px;height:'+($(document).height())+'px;z-index:32768;">';
	for(var i = 0; i < 18; i++){
		grid_html += '<div class="grid_1" style="height:100%;background:red;opacity:0.333;">'+(i+1)+'</div>';
	}
	grid_html += '</div>';
	$(grid_html).appendTo('body');
};

// Display container classes
TelstraGlobal.show_container_classes = function(){
	if($('#v10-debug-container-classes').length){
		$('#v10-debug-container-classes').remove();
		return false;
	}
	$('<style id="v10-debug-container-classes">.container::before{position:absolute;border:1px dotted #666;background:yellow;padding:4px;content:attr(class);opacity:0.666;}.container:hover{outline:1px dashed red;}.container:hover::before{opacity:1}</style>').appendTo('head');
};
