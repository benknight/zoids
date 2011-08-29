/**
 * Zoids jQuery plugin
 * Author: Benjamin Knight
 * 
 * Uses canvas API to draw custom shapes and set them as backgrounds on DOM elements.
 * Sample usage (with defaults):
 *
 *	$(this).zoids({
 *		coords : [ 	// the coordinates that define the shape, drawn in order
 *			{ x : 0, y : 0 },
 *			{ x : a, y : b },
 *			{ x : c, y : d },
 *			// …
 *		],
 *		context_options : {	// options passed directly to the canvas context, see: http://goo.gl/z9K7a
 *			fillStyle		: $(this).css( 'background-color' ),
 *			strokeStyle		: '',
 *			shadowOffsetX	: 0,
 *			shadowOffsetY	: 0,
 *			shadowBlur		: 0,
 *			shadowColor		: ''
 *		},
 *		show_on_hover : false // whether the shape drawn should show on hover, default: false
 *	});
 *	
 */
(function( $ ){

	$.fn.zoids = function( options ) {  

		return this.each(function() {		
			
			options = $.extend( true, { // deep
				coords 			: false,
				context_options	: {
					fillStyle : $(this).css( 'background-color' ),
					strokeStyle : ''
				},
				show_on_hover	: false
			}, options );
			
			// require coords
			if ( ! options.coords )
				return false;
				
			// require Modernizr & canvas support
			if ( ! Modernizr || ! Modernizr.canvas )
				return false;
			
			// create canvas element
			var canvas = $("<canvas></canvas>");
			canvas.attr({
				width  : $(this).outerWidth(),
				height : $(this).outerHeight()
			});
			var context = canvas.get( 0 ).getContext( '2d' );
			
			// IE9 has shadow bugs so let's disable it for now
			if ( $.browser.msie ) {
				$.extend( options.context_options, {
					shadowOffsetX : 0,
					shadowOffsetY : 0,
					shadowBlur : 0,
					shadowColor : ''
				});
			}
			
			// set context options
			for ( x in options.context_options ) {
				context[x] = options.context_options[x]; 
			}

			// Draw the shape
			context.beginPath();
			context.moveTo( options.coords[0].x, options.coords[0].y );
			
			for ( var i = 1; i in options.coords; i++ ) {
				context.lineTo( options.coords[i].x, options.coords[i].y );
			}
			
			// close and fill
			context.closePath();
			context.fill();
			if ( options.context_options.strokeStyle )
				context.stroke();
			
			// set css, unset certain defaults
			var image = canvas.get( 0 ).toDataURL( 'image/png' );
			if ( options.show_on_hover ) {
				$(this).hover(function() {
					$(this).css( { background: "url('" + image + "') no-repeat" } );
				}, function() {
					$(this).css( { background: "" } );
				});
			} else {
				$(this).css({
					'background' : "url('" + image + "') center top no-repeat",
					'-webkit-border-radius' : '0',
					'-moz-border-radius' : '0',
					'border-radius' : '0',
					'-webkit-box-shadow' : 'none',
					'-moz-box-shadow' : 'none',
					'box-shadow' : 'none'
				});
			}
		});
	};
})( jQuery );