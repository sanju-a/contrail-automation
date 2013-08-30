/*
	Content Accordion
	Author: Aaron Isaac
	Created: 28/04/2011
	Usage:
		HTML:
			<element class="yourClass"></element>
			<div>Hidden Content</div>
		JavaScript:
			<script type="text/javascript" language="javascript" src="/global/javascript/jquery.1.4.4.min.js"></script>
			<script type="text/javascript" language="javascript" src="/help/brochures-guides/javascript/jquery.contentAccordion.js"></script>
			<script type="text/javascript">
				jQuery( '.yourClass' ).contentAccordion();
			</script>
	Options:
		multipleOpen ([boolean]): Can multiple content sections be open at once? (Default: false.)
		slideSpeed ('slow'/'med'/'fast'/[int]): How fast the content is hidden/revealed by slide. (Default: 'fast'.)
		groupName ([string]): Group multiple accordions on one page (Default: null.)
		activeClass ([string]): Class name for active h2 state. (Default: 'contentAccordionActive'.)
		containerClass ([string]): Class name for div containing hidden content. (Default: 'contentAccordion'.)
*/

(function( $ ) {

	$.fn.contentAccordion = function( options ) {

		var settings = {
			'multipleOpen' : true,
			'slideSpeed' : 'fast',
			'groupName' : '',
			'activeClass' : 'contentAccordionActive',
			'containerClass' : 'contentAccordion'
		}
		
		return this.each( function() {
								   
			if ( options ) {
				$.extend( settings, options );
			}
						
			$this = $( this );
			
			$this.next( 'div' ).addClass( settings.containerClass ).hide().append( '<div class="' + settings.containerClass + '"></div>' );
			
			if ( window.location.hash && ( $this.text().split( ' ' ).join( '' ).toLowerCase() == window.location.hash.split( '#' )[1].toLowerCase() ) )
				$this.addClass( settings.activeClass ).next( 'div' ).stop( true, true ).slideDown( settings.slideSpeed );
			
			$this.append( '<a href="#" title="' + $this.text() + '" style="text-decoration: none;">&nbsp;</a>' );
			
			if ( settings.groupName != '' ) {
				$this.addClass( settings.groupName );
				settings.groupName = '.' + settings.groupName;
			}
						
			// For Omniture tracking
			$this.addClass('tracklink');

			$this.click( function() {
				var $header = $( this );
				if ( !settings.multipleOpen ) {
					$( settings.groupName + '.' + settings.activeClass ).not( $header ).removeClass( settings.activeClass ).next( 'div' ).stop( true, true ).slideUp( settings.slideSpeed );
				}
				if ( $header.hasClass( settings.activeClass ) ) {
					$header.removeClass( settings.activeClass ).next( 'div' ).stop( true, true ).slideUp( settings.slideSpeed );
				} else {
					$header.addClass( settings.activeClass ).next( 'div' ).stop( true, true ).slideDown( settings.slideSpeed );
				}
			} );
		
	    } );
	}

} )( jQuery );
