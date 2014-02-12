//** Standard javaScript Functions

//** jQuery Specific functions

// Test if featureBanner settings have been initted
/*
$(document).ready( function() {
	$('.featureBanner').featureBanner({
		'mode' : 'fade',
		'delay': 5000,
		'speed' : 750,
		'icons' : false,
		'icontype' : 'none',
		'iconPos' : 'br',
		'easing': 'swing',
		'social' : false,
		'iconBorderOff' : '#9E9E9E',
		'iconBorderOn' : '#3A3A3A'
	});
});
*/
$(function(){
	$('.tabs').not('.lightbox-div .tabs').tabs();
});

$(function(){
	$('.contentAccordion').not('.lightbox-div .contentAccordion').contentAccordion();
});

