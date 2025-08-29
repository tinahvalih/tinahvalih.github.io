(function ( $ ) {
	'use strict';
	$( window ).on(
		'elementor/frontend/init',
		function () {
			qodefAddonsPremiumElementor.init();
		}
	);

	var qodefAddonsPremiumElementor = {
		init: function () {
			var isEditMode = Boolean( elementorFrontend.isEditMode() );

			if ( isEditMode ) {
				for ( var key in qodefAddonsPremiumCore.shortcodes ) {
					for ( var keyChild in qodefAddonsPremiumCore.shortcodes[key] ) {
						qodefAddonsPremiumElementor.reInitShortcode(
							key,
							keyChild
						);
					}
				}
			}
		},
		reInitShortcode: function ( key, keyChild ) {
			elementorFrontend.hooks.addAction(
				'frontend/element_ready/' + key + '.default',
				function ( e ) {
					// Check if object doesn't exist and print the module where is the error
					if ( typeof qodefAddonsPremiumCore.shortcodes[key][keyChild] === 'undefined' ) {
						console.log( keyChild );
					} else if ( typeof qodefAddonsPremiumCore.shortcodes[key][keyChild].initSlider === 'function' && e.find( '.qodef-qi-swiper-container' ).length ) {
						var $sliders = e.find( '.qodef-qi-swiper-container' );
						if ( $sliders.length ) {
							$sliders.each(
								function () {
									qodefAddonsPremiumCore.shortcodes[key][keyChild].initSlider( $( this ) );
								}
							);
						}
					} else if ( typeof qodefAddonsPremiumCore.shortcodes[key][keyChild].initItem === 'function' && e.find( '.qodef-shortcode' ).length ) {
						qodefAddonsPremiumCore.shortcodes[key][keyChild].initItem( e.find( '.qodef-shortcode' ) );
					} else {
						qodefAddonsPremiumCore.shortcodes[key][keyChild].init();
					}
				}
			);
		},
	};

})( jQuery );
