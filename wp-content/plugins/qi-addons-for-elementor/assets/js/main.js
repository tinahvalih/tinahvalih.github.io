(function ( $ ) {
	'use strict';

	window.qodefAddonsCore     = {};
	qodefAddonsCore.shortcodes = {};

	qodefAddonsCore.body         = $( 'body' );
	qodefAddonsCore.html         = $( 'html' );
	qodefAddonsCore.windowWidth  = $( window ).width();
	qodefAddonsCore.windowHeight = $( window ).height();
	qodefAddonsCore.scroll       = 0;

	$( document ).ready(
		function () {
			qodefAddonsCore.scroll = $( window ).scrollTop();
			qodefIOSTouchClass.init();
			qodefSwiper.init();
			qodefLightboxPopup.init();
		}
	);

	$( window ).resize(
		function () {
			qodefAddonsCore.windowWidth  = $( window ).width();
			qodefAddonsCore.windowHeight = $( window ).height();
		}
	);

	$( window ).scroll(
		function () {
			qodefAddonsCore.scroll = $( window ).scrollTop();
		}
	);

	$( window ).on(
		'load',
		function () {
			qodefAppear.init();
		}
	);

	/**
	 * Init swiper slider
	 */
	var qodefSwiper = {
		init: function ( settings ) {
			this.holder = $( '.qodef-qi-swiper-container' );

			// Allow overriding the default config.
			$.extend(
				this.holder,
				settings
			);

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefSwiper.initSlider( $( this ) );
					}
				);
			}
		},
		initSlider: function ( $currentItem ) {
			var options = qodefSwiper.getOptions( $currentItem ),
				events  = qodefSwiper.getEvents(
					$currentItem,
					options
				);

			// if optimized assets loading option in Elementor is enabled, we need to change swiper call, recommends for Elementor itself.
			if ( elementorFrontend.config.experimentalFeatures.e_optimized_assets_loading ) {
				// setinterval is needed here since elementorFrontend.utils property is not available on dom ready, also Elementor docs says to be careful since it is not available.
				var checkSwiperObject = setInterval(
					function () {
						if ( 'undefined' !== elementorFrontend.utils.swiper ) {
							const asyncSwiper = elementorFrontend.utils.swiper;

							new asyncSwiper(
								$currentItem[0],
								Object.assign( options, events )
							).then(
								( newSwiperInstance ) => {
									// phpcs:ignore PEAR.Functions.FunctionCallSignature.Indent
									var $swiper = newSwiperInstance;
								}
							);

							clearInterval( checkSwiperObject );
						}
					},
					200
				);

			} else {
				var $swiper = new Swiper(
					$currentItem[0],
					Object.assign(
						options,
						events
					)
				);
			}

			if ( elementorFrontend.isEditMode() ) {
				elementor.channels.editor.on(
					'change',
					function () {
						$currentItem[0].swiper.update();
					}
				);
			}
		},
		getOptions: function ( $holder ) {
			var sliderOptions       = typeof $holder.data( 'options' ) !== 'undefined' ? $holder.data( 'options' ) : {},
				direction           = sliderOptions.direction !== undefined && sliderOptions.direction !== '' ? sliderOptions.direction : 'horizontal',
				partialValue        = sliderOptions.partialValue !== undefined && sliderOptions.partialValue !== '' ? parseFloat( sliderOptions.partialValue ) : 0,
				disablePartialValue = sliderOptions.disablePartialValue !== undefined && sliderOptions.disablePartialValue !== '' ? parseInt( sliderOptions.disablePartialValue ) : 'never',
				spaceBetween        = sliderOptions.spaceBetween !== undefined && sliderOptions.spaceBetween !== '' ? sliderOptions.spaceBetween : 0,
				spaceBetweenTablet  = sliderOptions.spaceBetweenTablet !== undefined && sliderOptions.spaceBetweenTablet !== '' ? sliderOptions.spaceBetweenTablet : 0,
				spaceBetweenMobile  = sliderOptions.spaceBetweenMobile !== undefined && sliderOptions.spaceBetweenMobile !== '' ? sliderOptions.spaceBetweenMobile : 0,
				slidesPerView       = sliderOptions.slidesPerView !== undefined && sliderOptions.slidesPerView !== '' ? 'auto' === sliderOptions.slidesPerView ? 'auto' : parseInt( sliderOptions.slidesPerView ) + partialValue : 1 + partialValue,
				centeredSlides      = sliderOptions.centeredSlides !== undefined && sliderOptions.centeredSlides !== '' ? sliderOptions.centeredSlides : false,
				sliderScroll        = sliderOptions.sliderScroll !== undefined && sliderOptions.sliderScroll !== '' ? sliderOptions.sliderScroll : false,
				effect              = sliderOptions.effect !== undefined && sliderOptions.effect !== '' ? sliderOptions.effect : 'slide',
				loop                = sliderOptions.loop !== undefined && sliderOptions.loop !== '' ? sliderOptions.loop : true,
				autoplay            = sliderOptions.autoplay !== undefined && sliderOptions.autoplay !== '' ? sliderOptions.autoplay : true,
				speed               = sliderOptions.speed !== undefined && sliderOptions.speed !== '' ? parseInt(
					sliderOptions.speed,
					10
				) : 5000,
				speedAnimation      = sliderOptions.speedAnimation !== undefined && sliderOptions.speedAnimation !== '' ? parseInt(
					sliderOptions.speedAnimation,
					10
				) : 800,
				customStages        = sliderOptions.customStages !== undefined && sliderOptions.customStages !== '' ? sliderOptions.customStages : false,
				outsideNavigation   = sliderOptions.outsideNavigation !== undefined && sliderOptions.outsideNavigation === 'yes',
				nextNavigation      = outsideNavigation ? '.swiper-button-next-' + sliderOptions.unique : ($holder.find( '.swiper-button-next' ).length ? $holder.find( '.swiper-button-next' )[0] : null),
				prevNavigation      = outsideNavigation ? '.swiper-button-prev-' + sliderOptions.unique : ($holder.find( '.swiper-button-prev' ).length ? $holder.find( '.swiper-button-prev' )[0] : null),
				outsidePagination   = sliderOptions.outsidePagination !== undefined && sliderOptions.outsidePagination === 'yes',
				pagination          = outsidePagination ? '.swiper-pagination-' + sliderOptions.unique : ($holder.find( '.swiper-pagination' ).length ? $holder.find( '.swiper-pagination' )[0] : null),
				grabCursor          = sliderOptions.direction === 'horizontal',
				parallax            = sliderOptions.parallax !== undefined && sliderOptions.parallax === 'yes'

			if ( autoplay !== false && speed !== 5000 ) {
				autoplay = {
					delay: speed,
					disableOnInteraction: false
				};
			} else if ( autoplay !== false ) {
				autoplay = {
					disableOnInteraction: false
				};
			}

			var slidesPerView1680 = sliderOptions.slidesPerView1680 !== undefined && sliderOptions.slidesPerView1680 !== '' ? parseInt(
				sliderOptions.slidesPerView1680,
				10
			) + partialValue : 'auto' === sliderOptions.slidesPerView ? 'auto' : 5 + partialValue,
				slidesPerView1440 = sliderOptions.slidesPerView1440 !== undefined && sliderOptions.slidesPerView1440 !== '' ? parseInt(
					sliderOptions.slidesPerView1440,
					10
				) + partialValue : 'auto' === sliderOptions.slidesPerView ? 'auto' : 5 + partialValue,
				slidesPerView1366 = sliderOptions.slidesPerView1366 !== undefined && sliderOptions.slidesPerView1366 !== '' ? parseInt(
					sliderOptions.slidesPerView1366,
					10
				) + partialValue : 'auto' === sliderOptions.slidesPerView ? 'auto' : 4 + partialValue,
				slidesPerView1024 = sliderOptions.slidesPerView1024 !== undefined && sliderOptions.slidesPerView1024 !== '' ? parseInt(
					sliderOptions.slidesPerView1024,
					10
				) + partialValue : 'auto' === sliderOptions.slidesPerView ? 'auto' : 3 + partialValue,
				slidesPerView768  = sliderOptions.slidesPerView768 !== undefined && sliderOptions.slidesPerView768 !== '' ? parseInt(
					sliderOptions.slidesPerView768,
					10
				) + partialValue : 'auto' === sliderOptions.slidesPerView ? 'auto' : 2 + partialValue,
				slidesPerView680  = sliderOptions.slidesPerView680 !== undefined && sliderOptions.slidesPerView680 !== '' ? parseInt(
					sliderOptions.slidesPerView680,
					10
				) + partialValue : 'auto' === sliderOptions.slidesPerView ? 'auto' : 1 + partialValue,
				slidesPerView480  = sliderOptions.slidesPerView480 !== undefined && sliderOptions.slidesPerView480 !== '' ? parseInt(
					sliderOptions.slidesPerView480,
					10
				) + partialValue : 'auto' === sliderOptions.slidesPerView ? 'auto' : 1 + partialValue;

			if ( ! customStages ) {
				if ( slidesPerView < 2 ) {
					slidesPerView1680 = slidesPerView;
					slidesPerView1440 = slidesPerView;
					slidesPerView1366 = slidesPerView;
					slidesPerView1024 = slidesPerView;
					slidesPerView768  = slidesPerView;
				} else if ( slidesPerView < 3 ) {
					slidesPerView1680 = slidesPerView;
					slidesPerView1440 = slidesPerView;
					slidesPerView1366 = slidesPerView;
					slidesPerView1024 = slidesPerView;
				} else if ( slidesPerView < 4 ) {
					slidesPerView1680 = slidesPerView;
					slidesPerView1440 = slidesPerView;
					slidesPerView1366 = slidesPerView;
				} else if ( slidesPerView < 5 ) {
					slidesPerView1680 = slidesPerView;
					slidesPerView1440 = slidesPerView;
				}
			}

			if ( 'never' !== disablePartialValue ) {
				switch ( disablePartialValue ) {
					case 1024:
						slidesPerView1024 = Math.floor( slidesPerView1024 );
					case 768:
						slidesPerView768 = Math.floor( slidesPerView768 );
					case 680:
						slidesPerView680 = Math.floor( slidesPerView680 );
					case 480:
						slidesPerView480 = Math.floor( slidesPerView480 );
						break;
				}
			}

			var options = {
				direction: direction,
				slidesPerView: slidesPerView,
				centeredSlides: centeredSlides,
				sliderScroll: sliderScroll,
				loopedSlides: '12',
				spaceBetween: spaceBetween,
				effect: effect,
				autoplay: autoplay,
				loop: loop,
				speed: speedAnimation,
				navigation: { nextEl: nextNavigation, prevEl: prevNavigation },
				pagination: { el: pagination, clickable: true },
				grabCursor: grabCursor,
				parallax: parallax,
				breakpoints: {
					// when window width is < 481px.
					0: {
						slidesPerView: slidesPerView480,
						spaceBetween: spaceBetweenMobile
					},
					// when window width is >= 481px.
					481: {
						slidesPerView: slidesPerView680,
						spaceBetween: spaceBetweenMobile
					},
					// when window width is >= 681px.
					681: {
						slidesPerView: slidesPerView768,
						spaceBetween: spaceBetweenTablet
					},
					// when window width is >= 769px.
					769: {
						slidesPerView: slidesPerView1024,
						spaceBetween: spaceBetweenTablet
					},
					// when window width is >= 1025px.
					1025: {
						slidesPerView: slidesPerView1366
					},
					// when window width is >= 1367px.
					1367: {
						slidesPerView: slidesPerView1440
					},
					// when window width is >= 1441px.
					1441: {
						slidesPerView: slidesPerView1680
					},
					// when window width is >= 1681px.
					1681: {
						slidesPerView: slidesPerView
					}
				},
			};

			return Object.assign(
				options,
				qodefSwiper.getSliderDatas( $holder )
			);
		},
		getSliderDatas: function ( $holder ) {
			var dataList    = $holder.data(),
				returnValue = {};

			for ( var property in dataList ) {
				if ( dataList.hasOwnProperty( property ) ) {
					// It's required to be different from data options because da options are all options from shortcode element.
					if ( property !== 'options' && typeof dataList[property] !== 'undefined' && dataList[property] !== '' ) {
						returnValue[property] = dataList[property];
					}
				}
			}

			return returnValue;
		},
		getEvents: function ( $holder, options ) {
			return {
				on: {
					beforeInit: function () {
						if ( options.direction === 'vertical' ) {
							var height        = 0;
							var currentHeight = 0;
							var $item         = $holder.find( '.qodef-e' );

							if ( $item.length ) {
								$item.each(
									function () {
										currentHeight = $( this ).outerHeight();

										if ( currentHeight > height) {
											height = currentHeight;
										}
									}
								);
							}

							if ( options.slidesPerView === 1 ) {
								$holder.css( 'height', height );
								$item.css( 'height', height );
							}
						}
					},
					init: function () {
						$holder.addClass( 'qodef-swiper--initialized' );

						if ( options.sliderScroll ) {
							var scrollStart = false;

							$holder.off().on(
								'wheel',
								function ( e ) {
									e.preventDefault();

									if ( ! scrollStart ) {
										scrollStart = true;

										if ( e.originalEvent.deltaY > 0 ) {
											$holder[0].swiper.slideNext();
										} else {
											$holder[0].swiper.slidePrev();
										}

										setTimeout(
											function () {
												scrollStart = false;
											},
											1000
										);
									}
								}
							);
						}

						qodefAddonsCore.body.trigger(
							'qodefAddons_trigger_after_swiper_init',
							[$holder, options]
						);
					}
				}
			};
		}
	};

	qodefAddonsCore.qodefSwiper = qodefSwiper;

	if ( typeof Object.assign !== 'function' ) {
		Object.assign = function ( target ) {

			if ( target === null || typeof target === 'undefined' ) {
				throw new TypeError( 'Cannot convert undefined or null to object' );
			}

			target = Object( target );

			// phpcs:ignore Squiz.PHP.DisallowSizeFunctionsInLoops.Found
			for ( var index = 1; index < arguments.length; index++ ) {
				var source = arguments[index];

				if ( source !== null ) {
					for ( var key in source ) {
						if ( Object.prototype.hasOwnProperty.call(
							source,
							key
						) ) {
							target[key] = source[key];
						}
					}
				}
			}

			return target;
		};
	}

	/**
	 * Init fslightbox popup galleries
	 */
	var qodefLightboxPopup = {
		init: function () {
			this.holder = $( '.qodef-qi-fslightbox-popup' );

			if ( this.holder.length ) {
				refreshFsLightbox();

				if ( typeof qodefGlobal !== 'undefined' ) {
					qodefQiAddonsGlobal.vars.iconArrowLeft  = qodefGlobal.vars.iconArrowLeft !== undefined ? qodefGlobal.vars.iconArrowLeft : qodefQiAddonsGlobal.vars.iconArrowLeft;
					qodefQiAddonsGlobal.vars.iconArrowRight = qodefGlobal.vars.iconArrowRight !== undefined ? qodefGlobal.vars.iconArrowRight : qodefQiAddonsGlobal.vars.iconArrowRight;
					qodefQiAddonsGlobal.vars.iconClose      = qodefGlobal.vars.iconClose !== undefined ? qodefGlobal.vars.iconClose : qodefQiAddonsGlobal.vars.iconClose;
				}

				for ( const instance in fsLightboxInstances ) {

					fsLightboxInstances[instance].props.onInit = function () {
						var $fsLightboxHolder = fsLightboxInstances[instance].elements.container,
							$prevHolder       = $fsLightboxHolder.querySelectorAll( '.fslightbox-slide-btn-container-previous > .fslightbox-slide-btn' ),
							$nextHolder       = $fsLightboxHolder.querySelectorAll( '.fslightbox-slide-btn-container-next > .fslightbox-slide-btn' ),
							$closeHolder      = $fsLightboxHolder.querySelectorAll( '[title="Close"]' );

						$prevHolder[0].innerHTML  = qodefQiAddonsGlobal.vars.iconArrowLeft;
						$nextHolder[0].innerHTML  = qodefQiAddonsGlobal.vars.iconArrowRight;
						$closeHolder[0].innerHTML = qodefQiAddonsGlobal.vars.iconClose;
					};
				}
			}
		},
	};

	qodefAddonsCore.qodefLightboxPopup = qodefLightboxPopup;

	/**
	 * Init animation on appear
	 */
	var qodefAppear = {
		init: function () {
			this.holder = $( '.qodef-qi--has-appear:not(.qodef-qi--appeared)' );

			function getRandomArbitrary( min, max ) {
				return Math.floor( Math.random() * (max - min) + min );
			}

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						var holder      = $( this ),
							randomNum   = getRandomArbitrary(
								10,
								400
							),
							appearDelay = $( this ).attr( 'data-appear-delay' );

						if ( ! appearDelay ) {

							qodefAddonsCore.qodefIsInViewport.check(
								holder,
								function () {
									holder.addClass( 'qodef-qi--appeared' );
								}
							);
						} else {
							appearDelay = (appearDelay === 'random') ? randomNum : appearDelay;

							qodefAddonsCore.qodefIsInViewport.check(
								holder,
								function () {
									setTimeout(
										function () {
											holder.addClass( 'qodef-qi--appeared' );
										},
										appearDelay
									);
								}
							);
						}
					}
				);
			}
		},
	};

	qodefAddonsCore.qodefAppear = qodefAppear;

	var qodefIsInViewport = {
		check: function ( $element, callback, onlyOnce ) {
			if ( $element.length ) {
				// When item is 15% in the viewport.
				var offset   = typeof $element.data( 'viewport-offset' ) !== 'undefined' ? $element.data( 'viewport-offset' ) : 0.15;
				var observer = new IntersectionObserver(
					function ( entries ) {
						// isIntersecting is true when element and viewport are overlapping.
						// isIntersecting is false when element and viewport don't overlap.
						if ( entries[0].isIntersecting === true ) {
							callback.call( $element );
							// Stop watching the element when it's initialize.
							if ( onlyOnce !== false ) {
								observer.disconnect();
							}
						}
					},
					{ threshold: [offset] }
				);

				observer.observe( $element[0] );
			}
		},
	};

	qodefAddonsCore.qodefIsInViewport = qodefIsInViewport;

	/**
	 * Check element images to loaded
	 */
	var qodefWaitForImages = {
		check: function ( $element, callback ) {
			if ( $element.length ) {
				var images = $element.find( 'img' );

				if ( images.length ) {
					var counter = 0;

					// phpcs:ignore Squiz.PHP.DisallowSizeFunctionsInLoops.Found
					for ( var index = 0; index < images.length; index++ ) {
						var img = images[index];

						if ( img.complete ) {
							counter++;
							if ( counter === images.length ) {
								callback.call( $element );
							}
						} else {
							var image = new Image();

							image.addEventListener(
								'load',
								function () {
									counter++;
									if ( counter === images.length ) {
										callback.call( $element );
										return false;
									}
								},
								false
							);
							image.src = img.src;
						}
					}
				} else {
					callback.call( $element );
				}
			}
		},
	};

	qodefAddonsCore.qodefWaitForImages = qodefWaitForImages;

	var qodefScroll = {
		disable: function () {
			if ( window.addEventListener ) {
				window.addEventListener(
					'wheel',
					qodefScroll.preventDefaultValue,
					{ passive: false }
				);
			}

			document.onkeydown = qodefScroll.keyDown;
		},
		enable: function () {
			if ( window.removeEventListener ) {
				window.removeEventListener(
					'wheel',
					qodefScroll.preventDefaultValue,
					{ passive: false }
				);
			}
			window.onmousewheel = document.onmousewheel = document.onkeydown = null;
		},
		preventDefaultValue: function ( e ) {
			e = e || window.event;
			if ( e.preventDefault ) {
				e.preventDefault();
			}
			e.returnValue = false;
		},
		keyDown: function ( e ) {
			var keys = [37, 38, 39, 40];
			for ( var i = keys.length; i--; ) {
				if ( e.keyCode === keys[i] ) {
					qodefScroll.preventDefaultValue( e );
					return;
				}
			}
		}
	};

	qodefAddonsCore.qodefScroll = qodefScroll;

	var qodefSwiperElementorCheck = {
		init: function ( functionName, $currentItem ) {
			var $swiperAll = $currentItem.find( '.qodef-qi-swiper-container' );

			// setinterval is needed here since elementorFrontend.utils property is not available on dom ready, also Elementor docs says to be careful since it is not available.
			var checkSwiperObject = setInterval(
				function () {
					var clearAll = true;

					$swiperAll.each(
						function () {
							var $currentSwiper = $( this );
							if ( typeof $currentSwiper[0].swiper === 'undefined' ) {
								clearAll = false;
							}
						}
					);
					if ( clearAll ) {
						functionName( $currentItem );
						clearInterval( checkSwiperObject );
					}
				},
				200
			);
		},
	};

	qodefAddonsCore.qodefSwiperElementorCheck = qodefSwiperElementorCheck;

	// this function is created because wp_is_mobile is no longer detects iPad devices, so we need to make sure the right class is added to body.
	var qodefIOSTouchClass = {
		init: function () {
			if ( qodefIOSTouchClass.iOSCheck() ) {
				qodefAddonsCore.body.removeClass( 'qodef-qi--touch qodef-qi--no-touch' );
				qodefAddonsCore.body.addClass( 'qodef-qi--touch' );
			}
		},
		iOSCheck: function () {
			return [
					'iPad Simulator',
					'iPhone Simulator',
					'iPod Simulator',
					'iPad',
					'iPhone',
					'iPod'
				].includes( navigator.platform )
				// iPad on iOS 13 detection.
				|| (navigator.userAgent.includes( 'Mac' ) && 'ontouchend' in document);
		}
	};

	qodefAddonsCore.qodefIOSTouchClass = qodefIOSTouchClass;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefMasonryLayout.init();
		}
	);

	$( window ).resize(
		function () {
			qodefMasonryLayout.reInit();
		}
	);

	$( window ).on(
		'elementor/frontend/init',
		function () {
			if ( elementorFrontend.isEditMode() ) {
				elementor.channels.editor.on(
					'change',
					function () {
						qodefMasonryLayout.reInit();
					}
				);
			}
		}
	);

	/**
	 * Init masonry layout
	 */
	var qodefMasonryLayout = {
		init: function ( settings ) {
			this.holder = $( '.qodef-layout--qi-masonry' );

			// Allow overriding the default config.
			$.extend(
				this.holder,
				settings
			);

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefMasonryLayout.createMasonry( $( this ) );
					}
				);
			}
		},
		reInit: function ( settings ) {
			this.holder = $( '.qodef-layout--qi-masonry' );

			// Allow overriding the default config.
			$.extend(
				this.holder,
				settings
			);

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						var $masonry            = $( this ).find( '.qodef-grid-inner' ),
							$masonryItem        = $masonry.find( '.qodef-grid-item' ),
							$masonryItemSize    = $masonry.find( '.qodef-qi-grid-masonry-sizer' ).width(),
							$masonryItemSizeGap = parseInt( $masonry.css( 'column-gap' ) );

						$masonryItem.css(
							'width',
							$masonryItemSize
						);

						if ( typeof $masonry.isotope === 'function' && undefined !== $masonry.data( 'isotope' ) ) {

							if ( $( this ).hasClass( 'qodef-items--fixed' ) ) {

								qodefMasonryLayout.setFixedImageProportionSize(
									$masonry,
									$masonryItem,
									$masonryItemSize,
									$masonryItemSizeGap
								);
							}

							$masonry.isotope(
								{
									layoutMode: 'packery',
									itemSelector: '.qodef-grid-item',
									percentPosition: true,
									packery: {
										columnWidth: '.qodef-qi-grid-masonry-sizer',
										gutter: $masonryItemSizeGap,
									}
								}
							);
						}
					}
				);
			}
		},
		createMasonry: function ( $holder ) {
			var $masonry            = $holder.find( '.qodef-grid-inner' ),
				$masonryItem        = $masonry.find( '.qodef-grid-item' ),
				$masonryItemSize    = $masonry.find( '.qodef-qi-grid-masonry-sizer' ).width(),
				$masonryItemSizeGap = parseInt( $masonry.css( 'column-gap' ) );

			$masonryItem.css(
				'width',
				$masonryItemSize
			);

			qodefAddonsCore.qodefWaitForImages.check(
				$masonry,
				function () {
					if ( typeof $masonry.isotope === 'function' && ! $masonry.hasClass( 'qodef--masonry-init' ) ) {

						if ( $holder.hasClass( 'qodef-items--fixed' ) ) {

							qodefMasonryLayout.setFixedImageProportionSize(
								$masonry,
								$masonryItem,
								$masonryItemSize,
								$masonryItemSizeGap
							);
						}

						$masonry.isotope(
							{
								layoutMode: 'packery',
								itemSelector: '.qodef-grid-item',
								percentPosition: true,
								packery: {
									columnWidth: '.qodef-qi-grid-masonry-sizer',
									gutter: $masonryItemSizeGap,
								}
							}
						);
					}

					$masonry.addClass( 'qodef--masonry-init' );
				}
			);
		},
		setFixedImageProportionSize: function ( $holder, $item, size, $gap ) {

			var $squareItem     = $holder.find( '.qodef-item--square' ),
				$landscapeItem  = $holder.find( '.qodef-item--landscape' ),
				$portraitItem   = $holder.find( '.qodef-item--portrait' ),
				$hugeSquareItem = $holder.find( '.qodef-item--huge-square' ),
				isMobileScreen  = qodefAddonsCore.windowWidth <= 680;

			if ( ! $holder.parent().hasClass( 'qodef-col-num--1' ) ) {

				$item.css(
					{
						'height': size,
					}
				);

				if ( $landscapeItem.length ) {
					$landscapeItem.css(
						{
							'width': Math.round( (2 * size) + $gap ),
						}
					);
				}

				if ( $portraitItem.length ) {
					$portraitItem.css(
						{
							'height': Math.round( (2 * size) + $gap ),
						}
					);
				}

				if ( $hugeSquareItem.length ) {
					$hugeSquareItem.css(
						{
							'height': Math.round( (2 * size) + $gap ),
							'width': Math.round( (2 * size) + $gap ),
						}
					);
				}

				if ( isMobileScreen ) {

					if ( $landscapeItem.length ) {
						$landscapeItem.css(
							{
								'height': Math.round( size / 2 ),
								'width': Math.round( size ),
							}
						);
					}

					if ( $hugeSquareItem.length ) {
						$hugeSquareItem.css(
							{
								'height': Math.round( size ),
								'width': Math.round( size ),
							}
						);
					}
				}
			} else {

				$item.css(
					{
						'height': size,
					}
				);

				if ( $squareItem.length ) {
					$squareItem.css(
						{
							'width': size,
						}
					);
				}

				if ( $landscapeItem.length ) {
					$landscapeItem.css(
						{
							'height': Math.round( size / 2 ),
						}
					);
				}

				if ( $portraitItem.length ) {
					$portraitItem.css(
						{
							'height': Math.round( (2 * size) ),
						}
					);
				}

				if ( $hugeSquareItem.length ) {
					$hugeSquareItem.css(
						{
							'width': size,
						}
					);
				}
			}
		}
	};

	qodefAddonsCore.qodefMasonryLayout = qodefMasonryLayout;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_accordion = {};

	$( document ).ready(
		function () {
			qodefAccordion.init();
		}
	);

	var qodefAccordion = {
		init: function () {
			this.holder = $( '.qodef-qi-accordion' );
			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefAccordion.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef-behavior--accordion' ) ) {
				qodefAccordion.initAccordion( $currentItem );
			}

			if ( $currentItem.hasClass( 'qodef-behavior--toggle' ) ) {
				qodefAccordion.initToggle( $currentItem );
			}

			$currentItem.addClass( 'qodef--init' );
		},
		initAccordion: function ( $accordion ) {
			var heightStyle = 'auto';

			if ( $accordion.hasClass( 'qodef-height--content' ) ) {
				heightStyle = 'content';
			}
			$accordion.accordion(
				{
					animate: 'swing',
					collapsible: true,
					active: 0,
					icons: '',
					heightStyle: heightStyle,
				}
			);
		},
		initToggle: function ( $toggle ) {
			var $toggleAccordionTitle   = $toggle.find( '.qodef-e-title-holder' ),
				$toggleAccordionContent = $toggleAccordionTitle.next();

			$toggle.addClass( 'accordion ui-accordion ui-accordion-icons ui-widget ui-helper-reset' );
			$toggleAccordionTitle.addClass( 'ui-accordion-header ui-state-default ui-corner-top ui-corner-bottom' );
			$toggleAccordionContent.addClass( 'ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom' ).hide();

			$toggleAccordionTitle.each(
				function () {
					var $thisTitle = $( this );

					$thisTitle.hover(
						function () {
							$thisTitle.toggleClass( 'ui-state-hover' );
						}
					);

					$thisTitle.on(
						'click',
						function () {
							$thisTitle.toggleClass( 'ui-accordion-header-active ui-state-active ui-state-default ui-corner-bottom' );
							$thisTitle.next().toggleClass( 'ui-accordion-content-active' ).slideToggle( 400 );
						}
					);
				}
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_accordion.qodefAccordion = qodefAccordion;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_animated_text = {};

	$( document ).ready(
		function () {
			qodefAnimatedText.init();
		}
	);

	var qodefAnimatedText = {
		init: function () {
			this.holder = $( '.qodef-qi-animated-text.qodef--animated-by-letter' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefAnimatedText.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $words = $currentItem.find( '.qodef-e-word-holder' );

			$words.each(
				function () {
					var $word       = $( this ).text(),
						$wordCount	= $word.length,
						$split_word = ''

					for (var i = 0; i < $wordCount; i++) {
						$split_word += '<span class="qodef-e-character">' + $word.charAt( i ) + '</span>';
					}

					$( this ).html( $split_word );
				}
			);

			var $characters = $currentItem.find( '.qodef-e-character' );

			$characters.each(
				function (index) {
					var $character         = $( this ),
						transitionModifier = $currentItem.hasClass( 'qodef--appear-from-left' ) ? 40 : 60,
						transitionDelay    = (index * transitionModifier) + 'ms';

					$character.css( 'transition-delay', transitionDelay );
				}
			);
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_animated_text.qodefAppear       = qodefAddonsCore.qodefAppear;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_animated_text.qodefAnimatedText = qodefAnimatedText;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_button = {};

	$( document ).ready(
		function () {
			qodefButton.init();
		}
	);

	$( window ).on(
		'elementor/frontend/init',
		function () {
			if ( elementorFrontend.isEditMode() ) {
				elementor.channels.editor.on(
					'change',
					function ( e ) {
						if ( typeof e.$el === 'object' && e.$el.hasClass( 'elementor-control-button_padding' ) && typeof e.options.element.$el === 'object' ) {
							var $item = e.options.element.$el.find( '.qodef-qi-button' );

							if ( $item.length ) {
								qodefButton.initItem( $item );
							}
						}
					}
				);
			}
		}
	);

	var qodefButton = {
		init: function () {
			this.holder = $( '.qodef-qi-button' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefButton.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			$currentItem.each(
				function () {
					var $item = $( this );

					if ( $item.hasClass( 'qodef-type--icon-boxed' ) ) {
						var $buttonIcon = $item.find( '.qodef-m-icon' ),
							height      = $item.find( '.qodef-m-text' ).outerHeight();

						$buttonIcon.css(
							'width',
							height
						);
					}
				}
			);
		},
	};

	qodefAddonsCore.qodefButton = qodefButton;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_button.qodefButton = qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_call_to_action = {};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_call_to_action.qodefButton = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_cards_gallery = {};

	$( document ).ready(
		function () {
			qodefCardsGallery.init();
		}
	);

	var qodefCardsGallery = {
		init: function () {
			this.holder = $( '.qodef-qi-cards-gallery' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefCardsGallery.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $holder ) {
			var $cards      = $holder.find( '.qodef-m-card' ),
				orientation = $holder.data( 'orientation' ),
				marginValue;

			switch (orientation) {
				case 'left':
					marginValue = '0 0 0 20%';
					break;
				case 'right':
					marginValue = '0 20% 0 0';
					break;
			}

			$( $cards.get().reverse() ).each(
				function () {
					var $card = $( this );

					$card.on(
						'click',
						function () {
							if ( ! $cards.last().is( $card ) ) {

								if ( 'both' === orientation ) {
									if ( $card.index() % 2 ) {
										marginValue = '0 0 0 20%';
									} else {
										marginValue = '0 0 0 -20%';
									}
								}

								$card.addClass( 'qodef-out' ).animate(
									{
										margin: marginValue
									},
									200,
									'swing',
									function () {
										$card.detach();
										$card.insertAfter( $cards.last() ).animate(
											{
												margin: '0'
											},
											200,
											'swing',
											function () {
												$card.removeClass( 'qodef-out' );
											}
										);
										$cards = $holder.find( '.qodef-m-card' );
									}
								);
								return false;
							}
						}
					);
				}
			);
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_cards_gallery.qodefCardsGallery = qodefCardsGallery;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_banner = {};

	$( document ).ready(
		function () {
			qodefInitBanner.init();
		}
	);

	var qodefInitBanner = {
		init: function () {
			this.holder = $( '.qodef-qi-banner' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefInitBanner.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $buttonItem = $currentItem.find( '.qodef-qi-button' );

			if ( $buttonItem.hasClass( 'qodef-type--icon-boxed' ) ) {
				var $buttonIcon = $buttonItem.find( '.qodef-m-icon' ),
					height      = $buttonItem.find( '.qodef-m-text' ).outerHeight();

				$buttonIcon.css(
					'width',
					height
				);
			}
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_banner.qodefInitBanner = qodefInitBanner;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_charts = {};

	$( document ).ready(
		function () {
			qodefCharts.init();
		}
	);

	/**
	 * Init charts shortcode functionality
	 */
	var qodefCharts = {
		init: function () {
			this.holder = $( '.qodef-qi-charts' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefCharts.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {

			qodefAddonsCore.qodefIsInViewport.check(
				$currentItem,
				function () {
					qodefCharts.generateChartData( $currentItem );
				}
			);
		},
		generateChartData: function ( thisChart ) {

			var type = thisChart.data( 'type' );
			if ( type ) {
				type = 'pie';
			} else {
				type = 'doughnut';
			}
			var values                = thisChart.data( 'values' );
			var labels                = thisChart.data( 'labels' );
			var backgroundColors      = thisChart.data( 'background-colors' );
			var hoverBackgroundColors = thisChart.data( 'hover-background-colors' );
			var borderColors          = thisChart.data( 'border-colors' );
			var hoverBorderColors     = thisChart.data( 'hover-border-colors' );
			var borderWidth           = thisChart.data( 'border-width' );
			var hoverBorderWidth      = thisChart.data( 'hover-border-width' );
			var enableLegend          = thisChart.data( 'enable-legend' );
			var legendPosition        = thisChart.data( 'legend-position' );
			var legendAlignment       = thisChart.data( 'legend-alignment' );
			var legendBarWidth        = thisChart.data( 'legend-bar-width' );
			var legendBarHeight       = thisChart.data( 'legend-bar-height' );
			var legendBarMargin       = thisChart.data( 'legend-bar-margin' );
			var legendLabelColor      = thisChart.data( 'legend-label-color' );
			var legendLabelFont       = thisChart.data( 'legend-label-font' );
			var legendLabelFontSize   = thisChart.data( 'legend-label-font-size' );
			var legendLabelFontWeight = thisChart.data( 'legend-label-font-weight' );
			var legendLabelLineHeight = thisChart.data( 'legend-label-line-height' );
			var asceptRatio           = thisChart.data( 'aspect-ratio' );

			var patterns         = thisChart.data( 'pattern-images' );
			var hasPatternImages = false;
			var chart;

			var chartOptions = {
				type: type,
				data: {
					datasets: [{
						data: values,
						backgroundColor: backgroundColors,
						hoverBackgroundColor: hoverBackgroundColors,
						borderColor: borderColors,
						hoverBorderColor: hoverBorderColors,
						borderWidth: borderWidth,
						hoverBorderWidth: hoverBorderWidth,
						borderAlign: 'center',
						pattern: patterns,
					}],
					labels: labels
				},
				options: {
					responsive: true,
					aspectRatio: asceptRatio,
					animation: {
						animateScale: true,
						animateRotate: true
					},
					plugins: {
						legend: {
							display: enableLegend,
							position: legendPosition,
							align: legendAlignment,
							labels: {
								boxWidth: legendBarWidth,
								boxHeight: legendBarHeight,
								padding: legendBarMargin,
								color: legendLabelColor,
								font: {
									family: legendLabelFont,
									size: legendLabelFontSize,
									weight: legendLabelFontWeight,
									lineHeight: legendLabelLineHeight,
								}
							}
						},
						tooltip: {
							titleFont: {
								size: 13,
							},
							displayColors: false,
							cornerRadius: 5,
							caretSize: 6,
						}
					},
				}
			};

			thisChart.addClass( 'qodef--init' );

			patterns.forEach(
				function ( item, index ) {
					if ( item ) {
						hasPatternImages = true;
						var img          = new Image();
						img.src          = patterns[index];

						img.onload = function () {
							var ctx                      = thisChart.find( 'canvas' )[0].getContext( '2d' );
							var fillPattern              = ctx.createPattern(
								img,
								'repeat'
							);
							backgroundColors[index]      = fillPattern;
							hoverBackgroundColors[index] = fillPattern;

							chart = new Chart(
								ctx,
								chartOptions
							);
						};
					}
				}
			);

			if ( ! hasPatternImages ) {
				var ctx = thisChart.find( 'canvas' );

				chart = new Chart(
					ctx,
					chartOptions
				);
			}
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_charts.qodefCharts = qodefCharts;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_before_after = {};

	$( document ).ready(
		function () {
			qodefBeforeAfter.init();
		}
	);

	var qodefBeforeAfter = {
		init: function () {
			this.holder = $( '.qodef-qi-before-after' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefBeforeAfter.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $currentHolder = $currentItem.find( '.qodef-before-after-image-holder' ),
				offset         = $currentHolder.data( 'offset' ) / 100,
				orientation    = 'horizontal',
				dragText       = $currentHolder.siblings( '.qodef-handle-text' ),
				dragHolder;

			if ( $currentHolder.parents( '.qodef-qi-before-after' ).hasClass( 'qodef--vertical' ) ) {
				orientation = 'vertical';
			}

			qodefAddonsCore.qodefWaitForImages.check(
				$currentHolder,
				function () {

					$currentHolder.css(
						'visibility',
						'visible'
					);

					$currentHolder.twentytwenty(
						{
							orientation: orientation,
							default_offset_pct: offset
						}
					);

					if ( dragText.length ) {
						dragHolder = $currentHolder.find( '.twentytwenty-handle' );
						dragHolder.prepend( dragText );
					}
				}
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_before_after.qodefBeforeAfter = qodefBeforeAfter;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_countdown = {};

	$( document ).ready(
		function () {
			qodefCountdown.init();
		}
	);

	var qodefCountdown = {
		init: function () {
			this.countdowns = $( '.qodef-qi-countdown' );

			if ( this.countdowns.length ) {
				this.countdowns.each(
					function () {
						qodefCountdown.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $countdownElement = $currentItem.find( '.qodef-m-date' ),
				options           = qodefCountdown.generateOptions( $currentItem );

			qodefCountdown.initCountdown(
				$countdownElement,
				options
			);
		},
		generateOptions: function ( $countdown ) {
			var options  = {};
			options.date = typeof $countdown.data( 'date' ) !== 'undefined' ? $countdown.data( 'date' ) : null;
			options.hide = typeof $countdown.data( 'hide' ) !== 'undefined' ? $countdown.data( 'hide' ) : null;

			options.monthLabel        = typeof $countdown.data( 'month-label' ) !== 'undefined' ? $countdown.data( 'month-label' ) : 'Month';
			options.monthLabelPlural  = typeof $countdown.data( 'month-label-plural' ) !== 'undefined' ? $countdown.data( 'month-label-plural' ) : 'Months';
			options.dayLabel          = typeof $countdown.data( 'day-label' ) !== 'undefined' ? $countdown.data( 'day-label' ) : 'Day';
			options.dayLabelPlural    = typeof $countdown.data( 'day-label-plural' ) !== 'undefined' ? $countdown.data( 'day-label-plural' ) : 'Days';
			options.hourLabel         = typeof $countdown.data( 'hour-label' ) !== 'undefined' ? $countdown.data( 'hour-label' ) : 'Hour';
			options.hourLabelPlural   = typeof $countdown.data( 'hour-label-plural' ) !== 'undefined' ? $countdown.data( 'hour-label-plural' ) : 'Hours';
			options.minuteLabel       = typeof $countdown.data( 'minute-label' ) !== 'undefined' ? $countdown.data( 'minute-label' ) : 'Minute';
			options.minuteLabelPlural = typeof $countdown.data( 'minute-label-plural' ) !== 'undefined' ? $countdown.data( 'minute-label-plural' ) : 'Minutes';
			options.secondLabel       = typeof $countdown.data( 'second-label' ) !== 'undefined' ? $countdown.data( 'second-label' ) : 'Second';
			options.secondLabelPlural = typeof $countdown.data( 'second-label-plural' ) !== 'undefined' ? $countdown.data( 'second-label-plural' ) : 'Seconds';

			return options;
		},
		initCountdown: function ( $countdownElement, options ) {
			var countDownDate = new Date( options.date ).getTime();

			// Update the count down every 1 second.
			var x = setInterval(
				function () {

					// Get today's date and time.
					var now = new Date().getTime();

					// Find the distance between now and the count-down date.
					var distance = countDownDate - now;

					// Time calculations for days, hours, minutes and seconds.
					var months  = Math.floor( distance / (1000 * 60 * 60 * 24 * 30) );
					var days    = Math.floor( (distance % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24) );
					var hours   = Math.floor( (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60) );
					var minutes = Math.floor( (distance % (1000 * 60 * 60)) / (1000 * 60) );
					var seconds = Math.floor( (distance % (1000 * 60)) / 1000 );

					if ( 'mon' === options.hide ) {
						days = Math.floor( distance / (1000 * 60 * 60 * 24) );
					}

					var $monthsHolder  = $countdownElement.find( '.qodef-months' );
					var $daysHolder    = $countdownElement.find( '.qodef-days' );
					var $hoursHolder   = $countdownElement.find( '.qodef-hours' );
					var $minutesHolder = $countdownElement.find( '.qodef-minutes' );
					var $secondsHolder = $countdownElement.find( '.qodef-seconds' );

					$monthsHolder.find( '.qodef-label' ).text( ( 1 === months ) ? options.monthLabel : options.monthLabelPlural );
					$daysHolder.find( '.qodef-label' ).text( ( 1 === days ) ? options.dayLabel : options.dayLabelPlural );
					$hoursHolder.find( '.qodef-label' ).text( ( 1 === hours ) ? options.hourLabel : options.hourLabelPlural );
					$minutesHolder.find( '.qodef-label' ).text( ( 1 === minutes ) ? options.minuteLabel : options.minuteLabelPlural );
					$secondsHolder.find( '.qodef-label' ).text( ( 1 === seconds ) ? options.secondLabel : options.secondLabelPlural );

					months  = (months < 10) ? '0' + months : months;
					days    = (days < 10) ? '0' + days : days;
					hours   = (hours < 10) ? '0' + hours : hours;
					minutes = (minutes < 10) ? '0' + minutes : minutes;
					seconds = (seconds < 10) ? '0' + seconds : seconds;

					$monthsHolder.find( '.qodef-digit' ).text( months );
					$daysHolder.find( '.qodef-digit' ).text( days );
					$hoursHolder.find( '.qodef-digit' ).text( hours );
					$minutesHolder.find( '.qodef-digit' ).text( minutes );
					$secondsHolder.find( '.qodef-digit' ).text( seconds );

					// If the count down is finished, write some text.
					if ( distance < 0 ) {
						clearInterval( x );
						$monthsHolder.find( '.qodef-label' ).text( options.monthLabelPlural );
						$daysHolder.find( '.qodef-label' ).text( options.dayLabelPlural );
						$hoursHolder.find( '.qodef-label' ).text( options.hourLabelPlural );
						$minutesHolder.find( '.qodef-label' ).text( options.minuteLabelPlural );
						$secondsHolder.find( '.qodef-label' ).text( options.secondLabelPlural );

						$monthsHolder.find( '.qodef-digit' ).text( '00' );
						$daysHolder.find( '.qodef-digit' ).text( '00' );
						$hoursHolder.find( '.qodef-digit' ).text( '00' );
						$minutesHolder.find( '.qodef-digit' ).text( '00' );
						$secondsHolder.find( '.qodef-digit' ).text( '00' );
					}
				},
				1000
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_countdown.qodefCountdown = qodefCountdown;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_clients_slider             = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_clients_slider.qodefSwiper = qodefAddonsCore.qodefSwiper;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_device_carousel = {};

	$( document ).ready(
		function () {
			qodefDeviceCarousel.init();
		}
	);

	var qodefDeviceCarousel = {
		init: function () {
			this.sliders = $( '.qodef-qi-device-carousel' );

			if ( this.sliders.length ) {
				this.sliders.each(
					function () {
						qodefDeviceCarousel.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			// setInterval function is because of the duplicate slides which are not available if main swiper is not initialized (mainly - elementor assets loading).
			var waitForMainSwiperInit = setInterval(
				function () {
					// if main swiper is initialized - go to inner swipers and clearInterval.
					if ( $currentItem.children( '.qodef-qi-swiper-container' ).hasClass( 'qodef-swiper--initialized' ) ) {
						const $deviceSliders = $currentItem.find( '.qodef-device-carousel-device .qodef-qi-swiper-container' );

						$deviceSliders.each(
							function () {
								var $deviceSlider = $( this );

								// check if swiper is already initialized - if not, initialize it, if yes - restart autoplay so they are in sync.
								if ( ! $deviceSlider.hasClass( 'qodef-swiper--initialized' ) ) {
									qodefAddonsCore.qodefSwiper.initSlider( $deviceSlider );
								} else {
									$deviceSlider[0].swiper.autoplay.stop();
									$deviceSlider[0].swiper.autoplay.start();
								}
							}
						);

						clearInterval( waitForMainSwiperInit );
					}
				},
				200
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_device_carousel.qodefSwiper         = qodefAddonsCore.qodefSwiper;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_device_carousel.qodefDeviceCarousel = qodefDeviceCarousel;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_faq = {};

	$( document ).ready(
		function () {
			qodefFAQ.init();
		}
	);

	var qodefFAQ = {
		init: function () {
			this.holder = $( '.qodef-qi-faq.qodef-behavior--accordion' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefFAQ.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef-behavior--accordion' ) ) {
				var active = 0;

				if ( $currentItem.hasClass( 'qodef-closed' ) ) {
					active = false;
				}

				$currentItem.accordion(
					{
						animate: 'swing',
						collapsible: true,
						active: active,
						icons: '',
						heightStyle: 'content',
					}
				);
				$currentItem.addClass( 'qodef--init' );
			}
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_faq.qodefFAQ = qodefFAQ;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_cards_slider = {};

	$( document ).ready(
		function () {
			qodefCardsSlider.init();
		}
	);

	var qodefCardsSlider = {
		init: function () {
			this.holder = $( '.qodef-qi-cards-slider' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefCardsSlider.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $holder ) {
			qodefCardsSlider.sliderLoop( $holder );
		},
		isInView: function ( $holder ) {
			// When item is 15% in the viewport.
			var offset   = 0.15;
			var observer = new IntersectionObserver(
				function ( entries ) {
					// isIntersecting is true when element and viewport are overlapping.
					// isIntersecting is false when element and viewport don't overlap.
					if ( entries[0].isIntersecting === true ) {
						$holder.addClass( 'qodef-in-view' );
					} else {
						$holder.removeClass( 'qodef-in-view' );
					}
				},
				{ threshold: [offset] }
			);
			observer.observe( $holder[0] );
			document.addEventListener(
				'visibilitychange',
				function () {
					if ( document.visibilityState === 'visible' ) {
						$holder.addClass( 'qodef-in-view' );
					} else {
						$holder.removeClass( 'qodef-in-view' );
					}
				}
			);
		},
		sliderLoop: function ( $holder, isPaused ) {
			var $cards      = $holder.find( '.qodef-m-card' ),
				orientation = $holder.data( 'orientation' ),
				$navNext    = $holder.find( '.qodef--next' ),
				$navPrev    = $holder.find( '.qodef--prev' ),
				marginValue,
				loopInterval;

			switch (orientation) {
				case 'left':
					marginValue = '-10%';
					break;
				case 'right':
					marginValue = '10%';
					break;
			}

			// without opacity.
			function nextItem() {
				var $currentCard = $cards.last(),
					$lastCard    = $cards.first();

				if ( ! $currentCard.hasClass( 'qodef-out' ) ) {
					$currentCard.addClass( 'qodef-out' ).animate(
						{
							right: marginValue
						},
						350,
						'swing',
						function () {
							$currentCard.detach().insertBefore( $lastCard ).animate(
								{
									right: '0%'
								},
								450,
								'swing',
								function () {
									setTimeout(
										function () {
											$currentCard.removeClass( 'qodef-out' );
										},
										10
									);
								}
							);
							$cards = $holder.find( '.qodef-m-card' );
						}
					);
				}
			}

			function prevItem() {
				var $currentCard = $cards.last(),
					$lastCard    = $cards.first();

				if ( ! $lastCard.hasClass( 'qodef-in' ) ) {
					$holder.addClass( 'qodef-backwards' );
					$lastCard.addClass( 'qodef-in' ).animate(
						{
							right: marginValue
						},
						350,
						'swing',
						function () {
							$lastCard.detach().insertAfter( $currentCard ).animate(
								{
									right: '0'
								},
								450,
								'swing',
								function () {
									$lastCard.removeClass( 'qodef-in' );
									$holder.removeClass( 'qodef-backwards' );
								}
							);
							$cards = $holder.find( '.qodef-m-card' );
						}
					);
				}
			}

			loopInterval = setInterval(
				function () {
					if ( ! isPaused && $holder.hasClass( 'qodef-in-view' ) ) {
						nextItem();
					}
				},
				3000
			);

			qodefCardsSlider.isInView( $holder );

			if ( qodefAddonsCore.windowWidth > 1024 ) {
				$holder.on(
					'mouseenter',
					function () {
						isPaused = true;
					}
				).on(
					'mouseleave',
					function () {
						isPaused = false;
					}
				);
			} else {
				$holder.on(
					'touchstart',
					function () {
						isPaused = true;
					}
				).on(
					'touchend',
					function () {
						setTimeout(
							function () {
								isPaused = false;
							},
							2000
						);
					}
				);
			}

			$navNext.on(
				'click',
				nextItem
			);

			$navPrev.on(
				'click',
				prevItem
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_cards_slider.qodefCardsSlider = qodefCardsSlider;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_graphs = {};

	$( document ).ready(
		function () {
			qodefGraphs.init();
		}
	);

	/**
	 * Init graphs shortcode functionality
	 */
	var qodefGraphs = {
		init: function () {
			this.holder = $( '.qodef-qi-graphs' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefGraphs.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {

			qodefAddonsCore.qodefIsInViewport.check(
				$currentItem,
				function () {
					$currentItem.addClass( 'qodef--init' );

					var ctx = $currentItem.find( 'canvas' );

					var data = qodefGraphs.generateChartData(
						$currentItem,
						ctx
					);

					var chart = new Chart(
						ctx,
						data
					);
				}
			);
		},
		generateChartData: function ( thisChart, ctx ) {
			var type = thisChart.data( 'type' );
			if ( type ) {
				type = 'line';
			} else {
				type = 'bar';
			}
			var ticks                 = thisChart.data( 'ticks' );
			var fill                  = thisChart.data( 'fill' );
			var linear                = thisChart.data( 'linear' );
			var values                = thisChart.data( 'values' );
			var item_labels           = thisChart.data( 'item-labels' );
			var labels                = thisChart.data( 'labels' );
			var backgroundColors      = thisChart.data( 'background-colors' );
			var hoverBackgroundColors = thisChart.data( 'hover-background-colors' );
			var borderColors          = thisChart.data( 'border-colors' );
			var hoverBorderColors     = thisChart.data( 'hover-border-colors' );
			var borderWidth           = thisChart.data( 'border-width' );
			var hoverBorderWidth      = thisChart.data( 'hover-border-width' );
			var barSize               = thisChart.data( 'bar-size' );
			var catSize               = thisChart.data( 'cat-size' );
			var enableLegend          = thisChart.data( 'enable-legend' );
			var legendPosition        = thisChart.data( 'legend-position' );
			var legendAlignment       = thisChart.data( 'legend-alignment' );
			var legendBarWidth        = thisChart.data( 'legend-bar-width' );
			var legendBarHeight       = thisChart.data( 'legend-bar-height' );
			var legendBarMargin       = thisChart.data( 'legend-bar-margin' );
			var legendLabelColor      = thisChart.data( 'legend-label-color' );
			var legendLabelFont       = thisChart.data( 'legend-label-font' );
			var legendLabelFontSize   = thisChart.data( 'legend-label-font-size' );
			var legendLabelFontWeight = thisChart.data( 'legend-label-font-weight' );

			var datasets = [];

			values.forEach(
				function ( item, index ) {
					var dataset_item = {};

					dataset_item.data                      = values[index].split( ',' );
					dataset_item.label                     = item_labels[index];
					dataset_item.backgroundColor           = backgroundColors[index];
					dataset_item.hoverBackgroundColor      = hoverBackgroundColors[index];
					dataset_item.borderColor               = borderColors[index];
					dataset_item.hoverBorderColor          = hoverBorderColors[index];
					dataset_item.borderWidth               = borderWidth;
					dataset_item.hoverBorderWidth          = hoverBorderWidth;
					dataset_item.pointBackgroundColor      = 'rgba(0,0,0,0)';
					dataset_item.pointBorderColor          = 'rgba(0,0,0,0)';
					dataset_item.pointHoverBackgroundColor = 'rgba(0,0,0,0)';
					dataset_item.pointHoverBorderColor     = 'rgba(0,0,0,0)';
					dataset_item.cubicInterpolationMode    = 'default';
					dataset_item.fill                      = fill[index];
					dataset_item.barPercentage 			   = barSize;
					dataset_item.categoryPercentage 	   = catSize;
					dataset_item.tension 				   = linear[index];

					datasets.push( dataset_item );
				}
			);

			if ( qodefAddonsCore.windowWidth <= 480 ) {
				enableLegend = false;
			}

			var data_temp = {
				type: type,
				data: {
					labels: labels,
					datasets: datasets
				},
				options: {
					responsive: true,
					aspectRatio: 1.7,
					hover: {
						mode: 'nearest',
						intersect: true
					},
					plugins: {
						legend: {
							display: enableLegend,
							position: legendPosition,
							align: legendAlignment,
							labels: {
								boxWidth: legendBarWidth,
								boxHeight: legendBarHeight,
								padding: legendBarMargin,
								color: legendLabelColor,
								font: {
									family: legendLabelFont,
									size: legendLabelFontSize,
									weight: legendLabelFontWeight,
								},
							}
						},
						tooltip: {
							mode: 'nearest',
							intersect: false,
							titleFont: {
								size: 13,
							},
							displayColors: false,
							cornerRadius: 5,
							caretSize: 6,
						},
					},
					scales: {
						x: {
							display: true,
							scaleLabel: {
								display: true,
							},
							ticks: {
								color: '#c4c4c4',
								font: {
									family: '"DM Sans"',
									size: 16
								},
								padding: 10,
							},
							grid: {
								color: '#dbdbdb',
								tickLength: 30,
							}
						},
						y: {
							display: true,
							scaleLabel: {
								display: true,
							},
							suggestedMax: ticks.max,
							suggestedMin: ticks.min,
							ticks: {
								stepSize: ticks.step,
								color: '#c4c4c4',
								font: {
									family: '"DM Sans"',
									size: 16
								},
								padding: 10,
							},
							gridLines: {
								color: '#dbdbdb',
								tickMarkLength: 30,
							}
						}
					}
				}
			};

			return data_temp;
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_graphs.qodefGraphs = qodefGraphs;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_highlight             = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_highlight.qodefAppear = qodefAddonsCore.qodefAppear;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_counter = {};

	$( document ).ready(
		function () {
			qodefCounter.init();
		}
	);

	var qodefCounter = {
		init: function () {
			this.counters = $( '.qodef-qi-counter' );

			if ( this.counters.length ) {
				this.counters.each(
					function () {
						qodefCounter.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $counterElement = $currentItem.find( '.qodef-m-digit' ),
				options         = qodefCounter.generateOptions( $currentItem );

			qodefAddonsCore.qodefIsInViewport.check(
				$currentItem,
				function () {
					qodefCounter.counterScript(
						$counterElement,
						options
					);
				}
			);
		},
		generateOptions: function ( $counter ) {
			var options   = {};
			options.start = typeof $counter.data( 'start-digit' ) !== 'undefined' && $counter.data( 'start-digit' ) !== '' ? $counter.data( 'start-digit' ) : 0;
			options.end   = typeof $counter.data( 'end-digit' ) !== 'undefined' && $counter.data( 'end-digit' ) !== '' ? $counter.data( 'end-digit' ) : null;
			options.step  = typeof $counter.data( 'step-digit' ) !== 'undefined' && $counter.data( 'step-digit' ) !== '' ? $counter.data( 'step-digit' ) : 1;
			options.delay = typeof $counter.data( 'step-delay' ) !== 'undefined' && $counter.data( 'step-delay' ) !== '' ? parseInt(
				$counter.data( 'step-delay' ),
				10
			) : 100;
			options.txt   = typeof $counter.data( 'digit-label' ) !== 'undefined' && $counter.data( 'digit-label' ) !== '' ? String( $counter.data( 'digit-label' ) ) : '';

			return options;
		},
		counterScript: function ( $counterElement, options ) {
			var defaults = {
				start: 0,
				end: null,
				step: 1,
				delay: 50,
				txt: '',
			};

			var settings = $.extend(
				defaults,
				options || {}
			);
			var nb_start = settings.start;
			var nb_end   = settings.end;

			$counterElement.text( nb_start + settings.txt );

			// Timer.
			// Launches every "settings.delay".
			var counterInterval = setInterval(
				function () {
					// Definition of conditions of arrest.
					if ( nb_end !== null && nb_start >= nb_end ) {
						return;
					}
					// incrementation.
					nb_start = nb_start + settings.step;
					// Check is ended.
					if ( nb_start >= nb_end ) {
						nb_start = nb_end;
						clearInterval( counterInterval );
					}
					// display.
					$counterElement.text( nb_start + settings.txt );
				},
				settings.delay
			);

			var counter = function () {
				// Definition of conditions of arrest.
				if ( nb_end !== null && nb_start >= nb_end ) {
					return;
				}
				// incrementation.
				nb_start = nb_start + settings.step;

				if ( nb_start >= nb_end ) {
					nb_start = nb_end;
				}
				// display.
				$counterElement.text( nb_start + settings.txt );
			};
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_counter.qodefCounter = qodefCounter;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery                    = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery.qodefLightboxPopup = qodefAddonsCore.qodefLightboxPopup;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_device_slider             = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_device_slider.qodefSwiper = qodefAddonsCore.qodefSwiper;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_icon_with_text             = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_icon_with_text.qodefAppear = qodefAddonsCore.qodefAppear;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_icon_with_text.qodefButton = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery_pinterest                    = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery_pinterest.qodefMasonryLayout = qodefAddonsCore.qodefMasonryLayout;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery_pinterest.qodefLightboxPopup = qodefAddonsCore.qodefLightboxPopup;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery_masonry                    = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery_masonry.qodefMasonryLayout = qodefAddonsCore.qodefMasonryLayout;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_gallery_masonry.qodefLightboxPopup = qodefAddonsCore.qodefLightboxPopup;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_info_cards = {};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_info_cards.qodefButton = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_interactive_banner = {};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_interactive_banner.qodefButton = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_info_button = {};

	$( document ).ready(
		function () {
			qodefInfoButton.init();
		}
	);

	$( window ).on(
		'elementor/frontend/init',
		function () {
			if ( elementorFrontend.isEditMode() ) {
				elementor.channels.editor.on(
					'change',
					function () {
						qodefInfoButton.init();
					}
				);
			}
		}
	);

	var qodefInfoButton = {
		init: function () {
			this.holder = $( '.qodef-qi-info-button' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefInfoButton.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef-type--icon-boxed' ) ) {
				var $buttonIcon = $currentItem.find( '.qodef-m-icon' ),
					height      = $currentItem.find( '.qodef-m-text-holder' ).outerHeight();

				$buttonIcon.css(
					'width',
					height
				);
			}
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_info_button.qodefInfoButton = qodefInfoButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_message_box = {};

	$( document ).ready(
		function () {
			qodefMessageBoxList.init();
		}
	);

	var qodefMessageBoxList = {
		init: function () {
			this.holder = $( '.qodef-qi-message-box' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefMessageBoxList.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $boxHolder = $currentItem.closest( '.elementor-element' );
			$boxHolder.addClass( 'q-message-box-holder' );

			$currentItem.find( '.qodef-m-close-icon' ).on(
				'click',
				function ( e ) {
					$( this ).parent().addClass( 'qodef-hidden' );
					$boxHolder.addClass( 'qodef-hidden' );
					$boxHolder.animate( {height: 0},{queue: false} );
				}
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_message_box.qodefMessageBoxList = qodefMessageBoxList;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_interactive_link_showcase = {};

	$( document ).ready(
		function () {
			qodefInteractiveLinkShowcase.init();
		}
	);

	var qodefInteractiveLinkShowcase = {
		init: function () {
			this.holder = $( '.qodef-qi-interactive-link-showcase' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefInteractiveLinkShowcase.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $images = $currentItem.find( '.qodef-e-image' ),
				$links  = $currentItem.find( '.qodef-m-item' );

			$images.eq( 0 ).addClass( 'qodef--active' );
			$links.eq( 0 ).addClass( 'qodef--active' );

			$links.on(
				'touchstart mouseenter',
				function ( e ) {
					var $thisLink = $( this );

					if ( ! qodefAddonsCore.body.hasClass( 'qodef-qi--touch' ) || ( ! $thisLink.hasClass( 'qodef--active' ) && qodefAddonsCore.windowWidth > 680) ) {
						e.preventDefault();
						$images.removeClass( 'qodef--active' ).eq( $thisLink.index() ).addClass( 'qodef--active' );
						$links.removeClass( 'qodef--active' ).eq( $thisLink.index() ).addClass( 'qodef--active' );
					}
				}
			).on(
				'touchend mouseleave',
				function () {
					var $thisLink = $( this );

					if ( ! qodefAddonsCore.body.hasClass( 'qodef-qi--touch' ) || ( ! $thisLink.hasClass( 'qodef--active' ) && qodefAddonsCore.windowWidth > 680) ) {
						$links.removeClass( 'qodef--active' ).eq( $thisLink.index() ).addClass( 'qodef--active' );
						$images.removeClass( 'qodef--active' ).eq( $thisLink.index() ).addClass( 'qodef--active' );
					}
				}
			);
			$currentItem.addClass( 'qodef--init' );
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_interactive_link_showcase.qodefInteractiveLinkShowcase = qodefInteractiveLinkShowcase;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_item_showcase             = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_item_showcase.qodefAppear = qodefAddonsCore.qodefAppear;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_slider                    = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_slider.qodefSwiper        = qodefAddonsCore.qodefSwiper;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_image_slider.qodefLightboxPopup = qodefAddonsCore.qodefLightboxPopup;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_parallax_images = {};

	$( document ).ready(
		function () {
			qodefParallaxImages.init();
		}
	);

	var qodefParallaxImages = {
		init: function () {
			this.images = $( '.qodef-qi-parallax-images' );

			if ( this.images.length ) {
				$( window ).on(
					'load',
					function () {
						qodefParallaxImages.initParallaxElements();
					}
				);

				this.images.each(
					function () {
						qodefParallaxImages.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			qodefParallaxImages.parallaxElements( $currentItem );
		},
		parallaxElements: function ( $image ) {
			var itemImage                  = $image.find( '.qodef-m-images' ),
				imagesParallax             = itemImage.find( '.qodef-e-parallax-image' ),
				imgZoom                    = itemImage.find( '.qodef-e-main-image img' ),
				imgZoomCustomParallaxLevel = itemImage.find( '.qodef-e-main-image' ).attr( 'data-parallax-main' ),
				imgZoomParallaxLevel       = 40,
				imgParallaxLevel           = -50,
				imgZoomSmoothness          = 30,
				imgParallaxSmoothness      = 15

			if ( qodefAddonsCore.windowWidth > 1024 ) {
				if (typeof imgZoomCustomParallaxLevel !== 'undefined' && imgZoomCustomParallaxLevel !== false) {
					imgZoomParallaxLevel = imgZoomCustomParallaxLevel;
					imgZoomSmoothness    = Math.abs( parseInt( imgZoomParallaxLevel / .9, 10 ) );
				}

				imgZoom.attr(
					'data-parallax',
					'{"y" : ' + imgZoomParallaxLevel + ' , "smoothness": ' + imgZoomSmoothness + '}'
				);

				imagesParallax.each(
					function () {
						var imgParallaxHolder      = $( this ),
							imgParallax            = imgParallaxHolder.find( 'img' ),
							imgCustomParallaxLevel = imgParallaxHolder.attr( 'data-parallax' );

						if (typeof imgCustomParallaxLevel !== 'undefined' && imgCustomParallaxLevel !== false) {
							imgParallaxLevel      = imgCustomParallaxLevel;
							imgParallaxSmoothness = Math.abs( parseInt( imgParallaxLevel / 2.5, 10 ) );
						}

						imgParallax.attr(
							'data-parallax',
							'{"y" : ' + imgParallaxLevel + ' , "smoothness": ' + imgParallaxSmoothness + '}'
						);
					}
				)
			}
		},
		initParallaxElements: function () {
			var parallaxInstances = $( '.qodef-qi-parallax-images [data-parallax]' );

			if ( parallaxInstances.length ) {
				// initialization removed from plugin js file to have it run only on non-touch devices.
				ParallaxScroll.init();
			}
		}
	};

	$( window ).on(
		'load',
		function () {
			this.images = $( '.qodef-qi-parallax-images' );

			if ( this.images.length ) {
				qodefParallaxImages.initParallaxElements();

				setTimeout(
					function () {
						if ( qodefAddonsCore.body.hasClass( 'e--ua-firefox' ) ) {
							qodefParallaxImages.initParallaxElements();
						}
					},
					300
				);
			}
		}
	);

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_parallax_images.qodefParallaxImages = qodefParallaxImages;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_preview_slider = {};

	$( document ).ready(
		function () {
			qodefPreviewSlider.init();
		}
	);

	var qodefPreviewSlider = {
		init: function () {
			this.sliders = $( '.qodef-qi-preview-slider' );

			if ( this.sliders.length ) {
				this.sliders.each(
					function () {
						qodefPreviewSlider.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			qodefAddonsCore.qodefSwiperElementorCheck.init( qodefPreviewSlider.initSwiperReinit, $currentItem );
		},
		initSwiperReinit: function ( $currentItem ) {
			var $activeSlide  = $currentItem.find( '> .qodef-qi-swiper-container .swiper-slide-active' ),
				$deviceHolder = $currentItem.find( '.qodef-preview-slider-device-holder' ),
				$mainSlider   = $currentItem.find( '> .qodef-qi-swiper-container' ),
				$deviceSlider = $currentItem.find( '.qodef-preview-slider-device-holder .qodef-qi-swiper-container' ),
				deviceSliderOptions,
				numItemsMain,
				autoPlay;

			$deviceHolder.width( $activeSlide.width() );
			$deviceHolder.css(
				'top',
				$activeSlide.height()
			);

			numItemsMain        = $mainSlider.find( '.swiper-slide' ).length;
			deviceSliderOptions = $deviceSlider[0].swiper.params;

			// real number of slides should be the same on both sides because of controller.
			deviceSliderOptions['loopedSlides'] = numItemsMain;
			deviceSliderOptions ['autoplay']    = 'false';
			autoPlay 						    = $mainSlider[0].swiper.params['autoplay']['enabled'];

			$mainSlider[0].swiper.autoplay.stop();
			$deviceSlider[0].swiper.destroy();

			var $swiperDeviceNew = new Swiper( $deviceSlider[0], Object.assign( deviceSliderOptions ) );

			$mainSlider[0].swiper.controller.control = $swiperDeviceNew;
			$mainSlider[0].swiper.controller.by      = 'slide';
			$mainSlider[0].swiper.controller.inverse = true;
			$swiperDeviceNew.controller.control      = $mainSlider[0].swiper;

			if ( autoPlay ) {
				$mainSlider[0].swiper.autoplay.start();
			}
			$currentItem.addClass( 'qodef--visible' );
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_preview_slider.qodefSwiper        = qodefAddonsCore.qodefSwiper;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_preview_slider.qodefPreviewSlider = qodefPreviewSlider;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_progress_bar_circle = {};

	$( document ).ready(
		function () {
			qodefProgressBar.init();
		}
	);

	/**
	 * Init progress bar - circle shortcode functionality
	 */
	var qodefProgressBar = {
		init: function () {
			this.holder = $( '.qodef-qi-progress-bar-circle' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefProgressBar.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {

			qodefAddonsCore.qodefIsInViewport.check(
				$currentItem,
				function () {
					$currentItem.addClass( 'qodef--init' );

					var $container = $currentItem.find( '.qodef-m-canvas' ),
						data       = qodefProgressBar.generateBarData( $currentItem ),
						number     = $currentItem.data( 'number' ) / 100;

					qodefProgressBar.initCircleBar(
						$container,
						data,
						number
					);
				}
			);
		},
		generateBarData: function ( $thisBar ) {
			var activeWidth   = $thisBar.data( 'active-line-width' );
			var activeColor   = $thisBar.data( 'active-line-color' );
			var inactiveWidth = $thisBar.data( 'inactive-line-width' );
			var inactiveColor = $thisBar.data( 'inactive-line-color' );
			var easing        = 'linear';
			var duration      = typeof $thisBar.data( 'duration' ) !== 'undefined' && $thisBar.data( 'duration' ) !== '' ? parseInt(
				$thisBar.data( 'duration' ),
				10
			) : 1200;
			var textColor     = $thisBar.data( 'text-color' );
			var progressWidth = $thisBar.width();

			return {
				color: activeColor,
				strokeWidth: activeWidth * 100 / progressWidth,
				trailColor: inactiveColor,
				trailWidth: inactiveWidth * 100 / progressWidth,
				svgStyle: {
					display: 'block',
					width: '100%',
				},
				text: {
					className: 'qodef-m-value',
					style: {
						color: textColor
					},
					autoStyleContainer: false
				},
				easing: easing,
				duration: duration,
				from: {
					color: inactiveColor
				},
				to: {
					color: activeColor
				},
				step: function ( state, bar ) {
					bar.setText( Math.round( bar.value() * 100 ) + '<sup class="qodef-m-percentage">%</sup>' );
				},
			};
		},
		initCircleBar: function ( $container, data, number ) {
			if ( qodefProgressBar.checkBar( $container ) ) {
				var $bar = new ProgressBar.Circle(
					$container[0],
					data
				);

				$bar.animate( number );
			}
		},
		checkBar: function ( $container ) {
			// check if svg is already in container, elementor fix.
			if ( $container.find( 'svg' ).length ) {
				return false;
			}

			return true;
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_progress_bar_circle.qodefProgressBar = qodefProgressBar;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_pricing_list = {};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_pricing_list.qodefButton = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_progress_bar_horizontal = {};

	$( document ).ready(
		function () {
			qodefProgressBar.init();
		}
	);

	/**
	 * Init progress bar - horizontal shortcode functionality
	 */
	var qodefProgressBar = {
		init: function () {
			this.holder = $( '.qodef-qi-progress-bar-horizontal' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefProgressBar.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {

			qodefAddonsCore.qodefIsInViewport.check(
				$currentItem,
				function () {
					$currentItem.addClass( 'qodef--init' );

					var $container = $currentItem.find( '.qodef-m-canvas' ),
						data       = qodefProgressBar.generateBarData( $currentItem ),
						number     = $currentItem.data( 'number' ) / 100;

					qodefProgressBar.initHorizontalBar(
						$container,
						data,
						number,
						$currentItem
					);
				}
			);
		},
		generateBarData: function ( $thisBar ) {
			var activeWidth    = $thisBar.data( 'active-line-width' );
			var activeColor    = $thisBar.data( 'active-line-color' );
			var inactiveWidth  = $thisBar.data( 'inactive-line-width' );
			var inactiveColor  = $thisBar.data( 'inactive-line-color' );
			var easing         = 'easeInOut';
			var duration       = typeof $thisBar.data( 'duration' ) !== 'undefined' && $thisBar.data( 'duration' ) !== '' ? parseInt(
				$thisBar.data( 'duration' ),
				10
			) : 1200;
			var percentageType = $thisBar.data( 'percentage-type' );
			var progressWidth  = $thisBar.width();

			return {
				color: activeColor,
				strokeWidth: activeWidth * 100 / progressWidth,
				trailColor: inactiveColor,
				trailWidth: inactiveWidth * 100 / progressWidth,
				svgStyle: {
					display: 'block',
					width: '100%',
				},
				easing: easing,
				duration: duration,
				from: {
					color: inactiveColor
				},
				to: {
					color: activeColor
				},
				step: function ( state, bar ) {
					var val = Math.round( bar.value() * 100 );
					$thisBar.find( '.qodef-m-value-inner' ).html( val + '<span class="qodef-m-percentage">%</span>' );

					if ( 'floating-above' === percentageType || 'floating-on' === percentageType ) {
						$thisBar.find( '.qodef-m-value' )[0].style.left = (val + '%');
					}
				},
			};
		},
		initHorizontalBar: function ( $container, data, number, thisBar ) {
			if ( qodefProgressBar.checkBar( $container ) ) {

				var $bar = new ProgressBar.Line(
					$container[0],
					data
				);

				var enableGradient = thisBar.data( 'gradient-fill' );
				if ( enableGradient === 'yes' ) {
					qodefProgressBar.generateGradient( thisBar );
				}

				var patternImage = thisBar.data( 'pattern' );
				if ( undefined !== patternImage ) {
					thisBar.find( 'svg' ).css(
						'background-image',
						'url("' + patternImage + '")'
					);
				}

				$bar.animate( number );
			}
		},
		checkBar: function ( $container ) {
			// check if svg is already in container, elementor fix.
			if ( $container.find( 'svg' ).length ) {
				return false;
			}

			return true;
		},
		generateGradient: function ( thisBar ) {

			var svgns    = 'http://www.w3.org/2000/svg';
			var defs     = document.createElementNS(
				svgns,
				'defs'
			);
			var gradient = document.createElementNS(
				svgns,
				'linearGradient'
			);
			var stops    = [
				{ 'color': thisBar.data( 'gradient-start' ), 'offset': '0%', },
				{ 'color': thisBar.data( 'gradient-end' ), 'offset': '100%', },
			];

			for ( var i = 0, length = stops.length; i < length; i++ ) {
				var stop = document.createElementNS(
					svgns,
					'stop'
				);
				stop.setAttribute(
					'offset',
					stops[i].offset
				);
				stop.setAttribute(
					'stop-color',
					stops[i].color
				);
				gradient.appendChild( stop );
			}

			gradient.id = 'Gradient-' + thisBar.data( 'rand-id' );
			gradient.setAttribute(
				'gradientUnits',
				'userSpaceOnUse'
			);
			gradient.setAttribute(
				'x1',
				'0'
			);
			gradient.setAttribute(
				'x2',
				thisBar.data( 'number' ) + '%'
			);
			gradient.setAttribute(
				'y1',
				'0'
			);
			gradient.setAttribute(
				'y2',
				'0'
			);
			defs.appendChild( gradient );

			thisBar[0].querySelector( '.qodef-m-canvas svg' ).appendChild( defs );
			thisBar[0].querySelector( '.qodef-m-canvas svg path:nth-child(2)' ).setAttribute(
				'stroke',
				'url(#Gradient-' + thisBar.data( 'rand-id' ) + ')'
			);
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_progress_bar_horizontal.qodefProgressBar = qodefProgressBar;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_pricing_table = {};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_pricing_table.qodefButton = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_progress_bar_vertical = {};

	$( document ).ready(
		function () {
			qodefProgressBar.init();
		}
	);

	/**
	 * Init progress bar - vertical shortcode functionality
	 */
	var qodefProgressBar = {
		init: function () {
			this.holder = $( '.qodef-qi-progress-bar-vertical' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefProgressBar.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {

			qodefAddonsCore.qodefIsInViewport.check(
				$currentItem,
				function () {
					$currentItem.addClass( 'qodef--init' );

					var $container = $currentItem.find( '.qodef-m-canvas' ),
						data       = qodefProgressBar.generateBarData( $currentItem ),
						number     = $currentItem.data( 'number' ) / 100;

					qodefProgressBar.initVerticalBar(
						$container,
						data,
						number,
						$currentItem
					);

					if ( $currentItem.hasClass( 'qodef-percentage--floating-top' ) ) {
						$currentItem.find( '.qodef-m-inner' ).width( $currentItem.find( '.qodef-m-canvas svg' ).width() );
					}
				}
			);
		},
		generateBarData: function ( $thisBar ) {
			var barHeight      = $thisBar.data( 'bar-height' );
			var activeWidth    = $thisBar.data( 'active-line-width' );
			var activeColor    = $thisBar.data( 'active-line-color' );
			var inactiveWidth  = $thisBar.data( 'inactive-line-width' );
			var inactiveColor  = $thisBar.data( 'inactive-line-color' );
			var easing         = 'linear';
			var duration       = typeof $thisBar.data( 'duration' ) !== 'undefined' && $thisBar.data( 'duration' ) !== '' ? parseInt(
				$thisBar.data( 'duration' ),
				10
			) : 1200;
			var percentageType = $thisBar.data( 'percentage-type' );

			return {
				color: activeColor,
				strokeWidth: activeWidth * 100 / barHeight,
				trailColor: inactiveColor,
				trailWidth: inactiveWidth * 100 / barHeight,
				svgStyle: {
					display: 'block',
					height: barHeight + 'px',
					transform: 'scaleY(-1)'
				},
				easing: easing,
				duration: duration,
				from: {
					color: inactiveColor
				},
				to: {
					color: activeColor
				},
				step: function ( state, bar ) {
					var val = Math.round( bar.value() * 100 );
					$thisBar.find( '.qodef-m-value' ).html( val + '<span class="qodef-m-percentage">%</span>' );

					if ( 'floating-top' === percentageType ) {
						$thisBar.find( '.qodef-m-value' )[0].style.bottom = (val + '%');
						$thisBar.find( '.qodef-m-title' )[0].style.bottom = (val + '%');
					}
				},
			};
		},
		initVerticalBar: function ( $container, data, number, thisBar ) {
			if ( qodefProgressBar.checkBar( $container ) ) {

				var $bar = new ProgressBar.Line(
					$container[0],
					data
				);

				var enableGradient = thisBar.data( 'gradient-fill' );
				if ( enableGradient === 'yes' ) {
					qodefProgressBar.generateGradient( thisBar );
				}

				var svg          = thisBar[0].querySelector( '.qodef-m-canvas svg' ),
					inactivePath = thisBar[0].querySelector( '.qodef-m-canvas svg path:first-of-type' ),
					activePath   = thisBar[0].querySelector( '.qodef-m-canvas svg path:last-of-type' );

				var strokeWidth = activePath.getAttribute( 'stroke-width' );

				svg.setAttribute(
					'viewBox',
					'0 0 ' + strokeWidth + ' 100'
				);
				inactivePath.setAttribute(
					'd',
					'M ' + strokeWidth / 2 + ',0 L ' + strokeWidth / 2 + ',100'
				);
				activePath.setAttribute(
					'd',
					'M ' + strokeWidth / 2 + ',0 L ' + strokeWidth / 2 + ',100'
				);

				var patternImage = thisBar.data( 'pattern' );
				if ( undefined !== patternImage ) {
					thisBar.find( 'svg' ).css(
						'background-image',
						'url("' + patternImage + '")'
					);
				}

				$bar.animate( number );
			}
		},
		checkBar: function ( $container ) {
			// check if svg is already in container, elementor fix.
			if ( $container.find( 'svg' ).length ) {
				return false;
			}

			return true;
		},
		generateGradient: function ( thisBar ) {

			var svgns    = 'http://www.w3.org/2000/svg';
			var defs     = document.createElementNS(
				svgns,
				'defs'
			);
			var gradient = document.createElementNS(
				svgns,
				'linearGradient'
			);
			var stops    = [
				{ 'color': thisBar.data( 'gradient-start' ), 'offset': '0%' },
				{ 'color': thisBar.data( 'gradient-end' ), 'offset': '100%' }
			];

			for ( var i = 0, length = stops.length; i < length; i++ ) {
				var stop = document.createElementNS(
					svgns,
					'stop'
				);
				stop.setAttribute(
					'offset',
					stops[i].offset
				);
				stop.setAttribute(
					'stop-color',
					stops[i].color
				);
				gradient.appendChild( stop );
			}

			gradient.id = 'Gradient-' + thisBar.data( 'rand-id' );
			gradient.setAttribute(
				'gradientUnits',
				'userSpaceOnUse'
			);
			gradient.setAttribute(
				'x1',
				'0'
			);
			gradient.setAttribute(
				'x2',
				'0'
			);
			gradient.setAttribute(
				'y1',
				'0'
			);
			gradient.setAttribute(
				'y2',
				thisBar.data( 'number' ) + '%'
			);
			defs.appendChild( gradient );

			thisBar[0].querySelector( '.qodef-m-canvas svg' ).appendChild( defs );
			thisBar[0].querySelector( '.qodef-m-canvas svg path:nth-child(2)' ).setAttribute(
				'stroke',
				'url(#Gradient-' + thisBar.data( 'rand-id' ) + ')'
			);
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_progress_bar_vertical.qodefProgressBar = qodefProgressBar;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_section_title = {};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_section_title.qodefButton = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_process             = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_process.qodefAppear = qodefAddonsCore.qodefAppear;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_table_of_contents = {};

	$( document ).ready(
		function () {
			qodefTableOfContents.init();
		}
	);

	var qodefTableOfContents = {
		init: function () {
			this.holder = $( '.qodef-qi-table-of-contents' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefTableOfContents.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var selector       = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
				$contentHolder = $currentItem.find( '.qodef-m-table-content' ),
				exclude_tags   = typeof $contentHolder.data( 'excluded-tags' ) !== 'undefined' ? $contentHolder.data( 'excluded-tags' ) : '',
				exclude_cid    = typeof $contentHolder.data( 'excluded-cids' ) !== 'undefined' ? $contentHolder.data( 'excluded-cids' ) : '',
				listType       = typeof $contentHolder.data( 'type' ) !== 'undefined' ? $contentHolder.data( 'type' ) : 'ul',
				$contentTable  = $currentItem.find( '.qodef-m-table-content > ' + listType ),
				ids            = '',
				$allObjects    = {},
				$links         = {},
				$removables    = ['.qodef-e-number', '.qodef-e-mark'],
				$headings;

			// if only main content set - include elementor class for content.
			if ( $currentItem.hasClass( 'qodef--only-content' ) ) {
				selector = selector.map(
					function ( element ) {
						return '.elementor ' + element
					}
				);
			}
			// prepare needed headings according to excluded tags and classes and ids.
			$headings = qodefTableOfContents.prepareHeadings( exclude_tags, exclude_cid, selector );

			if ($headings.length) {
				$headings.each(
					function (e) {
						var $this  = $( this ),
							$title = $this.clone(),
							$Ids;

						// get ids for check purposes and finalIds that are added to items.
						$Ids = qodefTableOfContents.prepareId( $removables, $title, ids );

						// add ids for check purposes.
						ids += $Ids.id + ';';

						// add finalId and tagname for item - needed for climbing up the tree.
						$allObjects[e] = {
							id: $Ids.finalID,
							tag: $this.prop( 'tagName' ).replace( 'H', '' ),
						};

						// check position of the item if not first.
						if ( e > 0 ) {
							var currentTag  = $this.prop( 'tagName' ).replace( 'H', '' ),
								previousTag = $allObjects[e - 1].tag;

							if ( currentTag > previousTag ) {
								// if tag of current item is higher then previous tag (h4 > h3) then append new ul tag, and set item to it.
								// afterwards set $contentTable variable to current ul used so new items that are equal to it are added to same ul.
								var $previousItem = $contentTable.find( 'a[href=#' + $allObjects[e - 1].id + ']' ).parent();

								$previousItem.append( '<' + listType + '>' );
								$contentTable = $previousItem.find( listType ).first();

							} else if ( currentTag < previousTag ) {
								// if tag of current item is lower then previous tag (h2 > h4) then find previous item that has the same tag or lower.
								// afterwards set $contentTable variable to sibling parent, so current item is added to it.
								var siblingID = qodefTableOfContents.findSiblings( currentTag, e, $allObjects ),
									$sibling  = $contentTable.parents( '.qodef-m-table-content' ).find( 'a[href=#' + siblingID + ']' ).parent();

								$contentTable = $sibling.parents( listType ).first();
							}
						}

						// add id attribute to item, and add item title and link to list.
						$this.attr( 'id', $Ids.finalID );
						$contentTable.append( '<li><a href="#' + $Ids.finalID + '">' + $title.text() + '</a></li>' );
					}
				);

				$links = $contentHolder.find( 'li > a' );

				$links.each(
					function () {
						$( this ).on(
							'click',
							function (e) {
								e.preventDefault();

								var $this = $( this ),
									id    = $this.attr( 'href' );

								qodefTableOfContents.animateAnchor( $this, id );
							}
						);
					}
				);
			}
		},
		prepareHeadings: function ( tags, cids, selector ) {
			var $headings,
				$toRemove = [],
				tag_array,
				cid_array,
				cid_not   = '';

			// first remove tags from selector.
			if ( 0 < tags.length ) {
				tag_array = tags.split( ',' );

				// phpcs:ignore Squiz.PHP.DisallowSizeFunctionsInLoops.Found
				for ( var i = 0; i < tag_array.length; i++ ) {
					if ( -1 !== selector.indexOf( tag_array[i] ) ) {
						selector.splice( selector.indexOf( tag_array[i] ), 1 );
					}
				}
			}

			// prepare class and ids string selectors.
			if ( 0 < cids.length ) {
				cid_array = cids.split( ',' );

				// phpcs:ignore Squiz.PHP.DisallowSizeFunctionsInLoops.Found
				for ( var i = 0; i < cid_array.length; i++ ) {
					cid_not += ':not(' + cid_array[i] + ')';
				}
			}

			// join selectors with exclude_cid selector, glue them together and add exclude_cid to end.
			selector = selector.join( cid_not + ', ' ) + cid_not;

			// create $headings.
			$headings = $( selector );

			// find $headings that have some of the parents classes or ids, and add its index in $toRemove array.
			if ($headings.length) {
				$headings.each(
					function ( e ) {
						var $this = $( this ),
							add   = true;

						// phpcs:ignore Squiz.PHP.DisallowSizeFunctionsInLoops.Found
						for ( var i = 0; i < cid_array.length; i++ ) {
							var $parent = $this.parents( cid_array[i] );

							if ( $parent.length ) {
								$toRemove.push( e );
								return;
							}
						}
					}
				);
			}

			// remove excluded $headings by their index.
			for ( var i = $toRemove.length - 1; i >= 0; i-- ) {
				$headings.splice( $toRemove[i], 1 );
			}

			return $headings;
		},
		prepareId: function ( $removables, $title, ids ) {
			var $Ids = {};

			// remove items that are in h-tag, but not used for title.
			$removables.forEach(
				function ( e ) {
					var $item = $title.find( e );

					$item.remove();
				}
			);

			$Ids.id = $title.text().trim().replaceAll( ' ', '_' ).replaceAll( /[^a-zA-Z_]+/g , '' );

			// calculate finalId depending on whether are same ids.
			if ( 0 !== ids.length ) {
				// get all ids (separated by ; in ids variable.
				var regExp      = new RegExp( $Ids.id + ';', 'g' ),
					count       = ids.match( regExp ),
					countLength = 0;

				// if there are items found, set how many.
				if ( null !== count ) {
					countLength = count.length;
				}

				// if there are items with the same title, add '___' string and current count of elements.
				if ( 0 !== countLength ) {
					countLength += 1;
					$Ids.finalID = $Ids.id + '____' + countLength;
				} else {
					$Ids.finalID = $Ids.id;
				}
			} else {
				$Ids.finalID = $Ids.id;
			}

			return $Ids;
		},
		findSiblings: function ( currentTag, currentIndex, $allHeadings ) {
			if ( 0 === currentIndex ) {
				return $allHeadings[0].id;
			} else {
				var previousIndex = currentIndex - 1;

				if ( $allHeadings[previousIndex].tag > currentTag ) {
					return qodefTableOfContents.findSiblings( currentTag, previousIndex, $allHeadings );
				} else {
					return $allHeadings[previousIndex].id;
				}
			}
		},
		animateAnchor: function ( $link, id ) {
			var startPos = window.scrollY,
				newPos   = $( id ).offset().top,
				change   = startPos > newPos ? -1 : 1,
				step     = 50,
				animationFrameId,
				admin    = $( '#wpadminbar' );

			if ( admin.length ) {
				newPos -= admin.height();
			}

			var startAnimation = function () {
				if ( startPos === newPos ) {
					return;
				}

				if ( Math.abs( startPos - newPos ) <= 100 ) {
					step = 8;
				}

				if ( ( -1 === change && startPos < newPos ) || ( 1 === change && startPos > newPos ) ) {
					startPos = newPos;
				}

				var ease = qodefTableOfContents.easingFunction( (startPos - newPos) / startPos );
				$( 'html, body' ).scrollTop( startPos - (startPos - newPos) * ease );

				startPos = startPos + change * step;

				animationFrameId = requestAnimationFrame( startAnimation );
			};
			startAnimation();
			$( window ).one(
				'wheel touchstart',
				function () {
					cancelAnimationFrame( animationFrameId );
				}
			);
		},
		easingFunction: function ( n ) {
			return 0 == n ? 0 : Math.pow( 1024, n - 1 );
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_table_of_contents.qodefTableOfContents = qodefTableOfContents;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_tabs_vertical = {};

	$( document ).ready(
		function () {
			qodefTabsVertical.init();
		}
	);

	var qodefTabsVertical = {
		init: function () {
			this.holder = $( '.qodef-qi-tabs-vertical' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefTabsVertical.initItems( $( this ) );
					}
				);
			}
		},
		initItems: function ( $tabs ) {
			$tabs.children( '.qodef-tabs-vertical-content' ).each(
				function ( index ) {
					index = index + 1;

					var $that    = $( this ),
						link     = $that.attr( 'id' ),
						$navItem = $that.parent().find( '.qodef-tabs-vertical-navigation li:nth-child(' + index + ') a' ),
						navLink  = $navItem.attr( 'href' );

					link = '#' + link;

					if ( link.indexOf( navLink ) > -1 ) {
						$navItem.attr(
							'href',
							link
						);
					}
				}
			);

			$tabs.addClass( 'qodef--init' ).tabs();
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_tabs_vertical.qodefTabsVertical = qodefTabsVertical;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_slider_switch = {};

	$( document ).ready(
		function () {
			qodefSliderSwitch.init();
		}
	);

	var qodefSliderSwitch = {
		init: function () {
			this.sliders = $( '.qodef-qi-slider-switch' );

			if ( this.sliders.length ) {
				this.sliders.each(
					function () {
						qodefSliderSwitch.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			qodefAddonsCore.qodefSwiperElementorCheck.init( qodefSliderSwitch.initSwiperReinit, $currentItem );
		},
		initSwiperReinit: function ( $currentItem ) {
			var $activeSlide  = $currentItem.find( '.qodef-m-main-slider > .qodef-qi-swiper-container .swiper-slide-active' ),
				$deviceHolder = $currentItem.find( '.qodef-slider-switch-device-holder' ),
				$mainSlider   = $currentItem.find( '.qodef-m-main-slider > .qodef-qi-swiper-container' ),
				$deviceSlider = $currentItem.find( '.qodef-slider-switch-device-holder .qodef-qi-swiper-container' ),
				$textSlider   = $currentItem.find( '.qodef-m-main-text .qodef-qi-swiper-container' ),
				deviceSliderOptions,
				textSliderOptions,
				numItemsMain,
				autoplayDelay;

			$deviceHolder.width( $activeSlide.width() );
			$deviceHolder.css(
				'top',
				$activeSlide.height()
			);

			numItemsMain        = $mainSlider.find( '.swiper-slide' ).length;
			deviceSliderOptions = $deviceSlider[0].swiper.params;
			// real number of slides should be the same on both sides because of controller.
			deviceSliderOptions['loopedSlides'] = numItemsMain;
			deviceSliderOptions['autoplay']     = false;
			textSliderOptions                   = $textSlider[0].swiper.params;
			textSliderOptions['grabCursor']     = false;
			// real number of slides should be the same on both sides because of controller.
			textSliderOptions['loopedSlides']   = numItemsMain;
			textSliderOptions['autoplay']       = false;
			textSliderOptions['effect']         = 'fade';
			textSliderOptions['allowTouchMove'] = false;
			$textSlider[0].swiper.update();

			autoplayDelay = $deviceSlider.data()['options']['autoplayDelay'];

			var autoplayEnabled = $mainSlider[0].swiper.autoplay.running;

			$mainSlider[0].swiper.autoplay.stop();
			$deviceSlider[0].swiper.destroy();
			$textSlider[0].swiper.destroy();

			var $swiperDeviceNew = new Swiper(
				$deviceSlider[0],
				Object.assign( deviceSliderOptions )
			);
			var $swiperTextNew   = new Swiper(
				$textSlider[0],
				Object.assign( textSliderOptions )
			);

			$mainSlider[0].swiper.controller.control = $swiperDeviceNew;
			$mainSlider[0].swiper.controller.by      = 'slide';
			$mainSlider[0].swiper.controller.inverse = true;
			$swiperDeviceNew.controller.control      = $mainSlider[0].swiper;

			if ( autoplayEnabled ) {
				if ( autoplayDelay !== '' ) {
					setTimeout(
						function () {
							$mainSlider[0].swiper.autoplay.start();
						},
						autoplayDelay
					);
				} else {
					$mainSlider[0].swiper.autoplay.start();
				}
			}

			$currentItem.addClass( 'qodef--visible' );

			$swiperDeviceNew.on(
				'slideChange',
				function () {
					var index_deviceSlide = $swiperDeviceNew.realIndex;
					var index_textSlide   = $swiperTextNew.realIndex;

					if ( index_deviceSlide != index_textSlide ) {
						$swiperTextNew.slideTo(
							index_deviceSlide,
							1000,
							false
						);
					}
				}
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_slider_switch.qodefSwiper       = qodefAddonsCore.qodefSwiper;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_slider_switch.qodefSliderSwitch = qodefSliderSwitch;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_tabs_horizontal = {};

	$( document ).ready(
		function () {
			qodefTabsHorizontal.init();
		}
	);

	var qodefTabsHorizontal = {
		init: function () {
			this.holder = $( '.qodef-qi-tabs-horizontal' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefTabsHorizontal.initItems( $( this ) );
					}
				);
			}
		},
		initItems: function ( $tabs ) {
			$tabs.children( '.qodef-tabs-horizontal-content' ).each(
				function ( index ) {
					index = index + 1;

					var $that    = $( this ),
						link     = $that.attr( 'id' ),
						$navItem = $that.parent().find( '.qodef-tabs-horizontal-navigation li:nth-child(' + index + ') a' ),
						navLink  = $navItem.attr( 'href' );

					link = '#' + link;

					if ( link.indexOf( navLink ) > -1 ) {
						$navItem.attr(
							'href',
							link
						);
					}
				}
			);

			$tabs.addClass( 'qodef--init' ).tabs();
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_tabs_horizontal.qodefTabsHorizontal = qodefTabsHorizontal;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_typeout_text = {};

	$( document ).ready(
		function () {
			qodefTypeoutText.init();
		}
	);

	$( window ).on(
		'elementor/frontend/init',
		function () {
			if ( elementorFrontend.isEditMode() ) {
				elementor.channels.editor.on(
					'change',
					function () {
						qodefTypeoutText.init();
					}
				);
			}
		}
	);

	/**
	 * Init charts shortcode functionality
	 */
	var qodefTypeoutText = {
		init: function () {
			this.holder = $( '.qodef-qi-typeout-text' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefTypeoutText.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			var $qodefTypeout = $currentItem.find( '.qodef-typeout' ),
				strings       = $currentItem.data( 'strings' ),
				cursor        = typeof $currentItem.data( 'cursor' ) !== 'undefined' ? $currentItem.data( 'cursor' ) : '';

			$qodefTypeout.each(
				function () {
					var $this   = $( this ),
						options = {
							strings: strings,
							typeSpeed: 90,
							backDelay: 700,
							loop: true,
							contentType: 'text',
							loopCount: false,
							cursorChar: cursor
					};

					if ( ! $this.hasClass( 'qodef--initialized' ) ) {

						var typed = new Typed(
							$this[0],
							options
						);
						$this.addClass( 'qodef--initialized' );
					}
				}
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_typeout_text.qodefTypeoutText = qodefTypeoutText;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_testimonials_slider             = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_testimonials_slider.qodefSwiper = qodefAddonsCore.qodefSwiper;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_timeline = {};
	var initialHeight = qodefAddonsCore.windowHeight,
		timeout;

	$( document ).ready(
		function () {
			qodefTimeline.init();
		}
	);

	$( window ).resize(
		function () {
			clearTimeout( timeout );

			timeout = setTimeout(
				() => {
					// check if there is more than 100px change and then initiate resize.
					if ( Math.abs( qodefAddonsCore.windowHeight - initialHeight ) > 100 ) {
						qodefTimeline.init();
					}

					// update for next change.
					initialHeight = qodefAddonsCore.windowHeight;
				},
				200
			);

		}
	);

	var qodefTimeline = {
		init: function () {
			this.holder = $( '.qodef-qi-timeline' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefTimeline.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef-timeline--horizontal' ) ) {
				var $items        = $currentItem.find( '.qodef-e-item' ),
					$gridHolder   = $currentItem.find( '.qodef-grid-inner' ),
					holderWidth   = $currentItem.width(),
					numberOfItems = $items.length,
					width         = 0,
					fullWidth     = 0,
					options       = $currentItem.data( 'options' );

				if ( numberOfItems > 1 ) {

					// calculate width for element in dependency of selected number of columns for that stage.
					if ( qodefAddonsCore.windowWidth > 1440 ) {
						width = holderWidth / options.colNum;
					} else if ( qodefAddonsCore.windowWidth > 1366 ) {
						width = holderWidth / options.colNum1440;
					} else if ( qodefAddonsCore.windowWidth > 1024 ) {
						width = holderWidth / options.colNum1366;
					} else if ( qodefAddonsCore.windowWidth > 768 ) {
						width = holderWidth / options.colNum1024;
					} else if ( qodefAddonsCore.windowWidth > 680 ) {
						width = holderWidth / options.colNum768;
					} else if ( qodefAddonsCore.windowWidth > 480 ) {
						width = holderWidth / options.colNum680;
					} else {
						width = holderWidth / options.colNum480;
					}

					// fullwidth of grid is width of element * number of all elements.
					fullWidth = width * numberOfItems;

					// set movement step to width of one element.
					$currentItem.data(
						'movement',
						width
					);

					// set already moved value to 0 (important for reinit also).
					$currentItem.data(
						'moved',
						0
					);

					$gridHolder.width( fullWidth );
					$gridHolder.css( 'transform', 'translateX(0)' );

					qodefAddonsCore.body.trigger(
						'qi_addons_for_elementor_trigger_timeline_before_init_movement',
						[$currentItem, $items]
					);

					qodefTimeline.initMovement( $currentItem );
				}
			}
		},
		initMovement: function ( $currentItem ) {
			var movement    = $currentItem.data( 'movement' ),
				$grid       = $currentItem.find( '.qodef-grid-inner' ),
				holderWidth = $currentItem.width(),
				gridWidth   = $grid.width(),
				$prev       = $currentItem.find( '.qodef-nav-prev' ),
				$next       = $currentItem.find( '.qodef-nav-next' );

			$prev.off().on(
				'click',
				function ( e ) {
					e.preventDefault();

					var currentMovement = parseFloat( $currentItem.data( 'moved' ) );

					// currentMovement is negative if timeline is already moved.
					if ( currentMovement < -1 ) {
						var newMovement = currentMovement + movement;
						$grid.css(
							'transform',
							'translateX( ' + newMovement + 'px)'
						);
						$currentItem.data(
							'moved',
							newMovement
						);
					}
				}
			);

			$next.off().on(
				'click',
				function ( e ) {
					e.preventDefault();

					var currentMovement = parseFloat( $currentItem.data( 'moved' ) );

					// gridWidth - holderWidth + 1(for partial px) is allowed movement,
					// currentMovement is how much is grid already moved, movement is step for movement.
					// timeline can not move any more to the right if allowed movement is smaller than planned movement for that step.
					if ( gridWidth - holderWidth + 1 > -currentMovement + movement ) {
						var newMovement = currentMovement - movement;
						$grid.css(
							'transform',
							'translateX( ' + newMovement + 'px)'
						);
						$currentItem.data(
							'moved',
							newMovement
						);
					}
				}
			);
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_timeline.qodefTimeline = qodefTimeline;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_timeline.qodefAppear   = qodefAddonsCore.qodefAppear;

})( jQuery );

(function ( $ ) {
	'use strict';

	var shortcode = 'qi_addons_for_elementor_blog_list';

	qodefAddonsCore.shortcodes[shortcode] = {};

	qodefAddonsCore.shortcodes[shortcode].qodefLightboxPopup = qodefAddonsCore.qodefLightboxPopup;
	qodefAddonsCore.shortcodes[shortcode].qodefMasonryLayout = qodefAddonsCore.qodefMasonryLayout;
	qodefAddonsCore.shortcodes[shortcode].qodefButton        = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	var shortcode = 'qi_addons_for_elementor_blog_slider';

	qodefAddonsCore.shortcodes[shortcode] = {};

	qodefAddonsCore.shortcodes[shortcode].qodefSwiper        = qodefAddonsCore.qodefSwiper;
	qodefAddonsCore.shortcodes[shortcode].qodefLightboxPopup = qodefAddonsCore.qodefLightboxPopup;
	qodefAddonsCore.shortcodes[shortcode].qodefButton        = qodefAddonsCore.qodefButton;
})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefNotice.init();
			qodefReviewNotice.init();
			qodefDeactivationModal.init();
		}
	);

	var qodefNotice = {
		init: function () {
			this.noticeHolder = $( '.qodef-admin-notice' );

			if ( this.noticeHolder.length ) {
				this.handleNotice();
			}
		},
		handleNotice: function () {
			var submitButton = this.noticeHolder.find( '.qodef-statistics-button' ),
				nonceHolder  = this.noticeHolder.find( '#qi-addons-for-elementor-notice-nonce' );

			if ( submitButton.length ) {
				submitButton.each(
					function () {
						var thisSubmitButton = $( this ),
							noticeAction     = thisSubmitButton.hasClass( 'qodef-statistics--allowed' ) ? 'allowed' : 'disallowed';

						thisSubmitButton.on(
							'click',
							function ( e ) {
								e.preventDefault();

								$.ajax(
									{
										type: 'POST',
										data: {
											action: 'qi_addons_for_elementor_notice',
											notice_action: noticeAction,
											nonce: nonceHolder.val()
										},
										url: ajaxurl,
										success: function ( data ) {
											var response = $.parseJSON( data );

											if ( response.status === 'success' ) {
												qodefNotice.noticeHolder.slideUp( 'fast' );
											}
										}
									}
								);
							}
						);
					}
				);
			}
		}
	};

	var qodefReviewNotice = {
		init: function () {
			this.noticeHolder = $( '.qodef-admin-review-notice' );

			if ( this.noticeHolder.length ) {
				this.handleReviewNotice();
			}
		},
		handleReviewNotice: function () {
			var submitButton = this.noticeHolder.find( '.qodef-review-button' ),
				nonceHolder  = this.noticeHolder.find( '#qi-addons-for-elementor-review-notice-nonce' );

			if ( submitButton.length ) {
				submitButton.each(
					function () {
						var thisSubmitButton = $( this ),
							reviewAction;

						thisSubmitButton.on(
							'click',
							function ( e ) {

								if ( thisSubmitButton.hasClass( 'qodef-review--already-reviewed-action' ) ) {
									reviewAction = 'already-reviewed';
								} else if ( thisSubmitButton.hasClass( 'qodef-review--maybe-later-action' ) ) {
									reviewAction = 'maybe-later';
								} else {
									reviewAction = 'review';
								}

								if ( reviewAction !== 'review' ) {
									e.preventDefault();
								}

								$.ajax(
									{
										type: 'POST',
										data: {
											action: 'qi_addons_for_elementor_review_notice',
											review_action: reviewAction,
											nonce: nonceHolder.val()
										},
										url: ajaxurl,
										success: function ( data ) {
											var response = $.parseJSON( data );

											if ( response.status === 'success' ) {
												qodefReviewNotice.noticeHolder.slideUp( 'fast' );
											}
										}
									}
								);
							}
						);
					}
				);
			}
		}
	};

	var qodefDeactivationModal = {
		init: function () {
			this.deactivationLink  = $( '#the-list' ).find( '[data-slug="qi-addons-for-elementor"] span.deactivate a' );
			this.deactivationModal = $( '#qi-addons-for-elementor-deactivation-modal' );

			if ( this.deactivationLink.length && this.deactivationModal.length ) {
				this.initModal();
			}
		},
		initModal: function () {
			this.deactivationLink.on(
				'click',
				function ( e ) {
					e.preventDefault();
					qodefDeactivationModal.deactivationModal.fadeIn( 'fast' );
				}
			);

			this.enableModalCloseFunctionality();
			this.initSubmitFunctionality();
			this.initSkipFunctionality();
		},
		initSubmitFunctionality: function () {
			var submitButton = this.deactivationModal.find( '.qodef-deactivation-modal-button-submit' ),
				skipButton   = this.deactivationModal.find( '.qodef-deactivation-modal-button-skip' ),
				nonceHolder  = this.deactivationModal.find( '#qi-addons-for-elementor-deactivation-nonce' );

			if ( submitButton.length ) {
				submitButton.on(
					'click',
					function ( e ) {
						e.preventDefault();
						submitButton.addClass( 'qodef--processing' );
						skipButton.addClass( 'qodef--disabled' );

						var reason = qodefDeactivationModal.deactivationModal.find( 'input[name="reason_key"]:checked' ).val(),
							additionalInfo;

						switch (reason) {
							case 'found_a_better_plugin':
								additionalInfo = qodefDeactivationModal.deactivationModal.find( 'input[name="reason_found_a_better_plugin"]' ).val();
								break;
							case 'other':
								additionalInfo = qodefDeactivationModal.deactivationModal.find( 'input[name="reason_other"]' ).val();
								break;
							default:
								additionalInfo = '';
						}

						$.ajax(
							{
								type: 'POST',
								data: {
									action: 'qi_addons_for_elementor_deactivation',
									reason: reason,
									additionalInfo: additionalInfo,
									nonce: nonceHolder.val()
								},
								url: ajaxurl,
								success: function () {
									qodefDeactivationModal.deactivatePlugin();
								}
							}
						);
					}
				);
			}
		},
		initSkipFunctionality: function () {
			var submitButton = this.deactivationModal.find( '.qodef-deactivation-modal-button-submit' ),
				skipButton   = this.deactivationModal.find( '.qodef-deactivation-modal-button-skip' );

			if ( skipButton.length ) {
				skipButton.on(
					'click',
					function ( e ) {
						e.preventDefault();
						skipButton.addClass( 'qodef--processing' );
						submitButton.addClass( 'qodef--disabled' );
						qodefDeactivationModal.deactivatePlugin();
					}
				);
			}
		},
		deactivatePlugin: function () {
			location.href = this.deactivationLink.attr( 'href' );
		},
		enableModalCloseFunctionality: function () {
			var closeButton = this.deactivationModal.find( '.qodef-deactivation-modal-close' );

			if ( closeButton.length ) {
				closeButton.on(
					'click',
					function ( e ) {
						e.preventDefault();
						qodefDeactivationModal.deactivationModal.fadeOut( 'fast' );
					}
				);
			}
		}
	};

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_add_to_cart_button = {};

	$( document ).ready(
		function () {
			changeViewCart.init();
		}
	);

	var changeViewCart = {
		init: function () {
			this.holder = $( '.qodef-qi-woo-shortcode-add-to-cart' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						changeViewCart.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			qodefAddonsCore.shortcodes.qi_addons_for_elementor_button.qodefButton.init( $currentItem );

			$( 'body' ).on(
				'added_to_cart',
				function () {
					var $viewButton = $currentItem.find( '.added_to_cart:not(.qodef-qi-button)' );

					if ( $viewButton.length ) {
						var $addButton      = $viewButton.siblings( '.add_to_cart_button' ),
							classesToRemove = ['button', 'product_type_simple', 'add_to_cart_button', 'ajax_add_to_cart', 'added'],
							classesCount    = classesToRemove.length,
							classes         = $addButton.attr( 'class' ),
							$border         = $addButton.find( '.qodef-m-border' ),
							$innerBorder    = $addButton.find( '.qodef-m-inner-border' ),
							$icon           = $addButton.find( '.qodef-m-icon' );

						for ( var i = 0; i < classesCount; i++ ) {
							classes = classes.replace( classesToRemove[i], '' );
						}

						$viewButton.addClass( classes );
						$viewButton.wrapInner( '<span class="qodef-m-text">' );

						if ( $border.length ) {
							var $duplicateBorder = $border.clone();

							$viewButton.append( $duplicateBorder );
						}

						if ( $icon.length ) {
							var $duplicateIcon = $icon.clone();

							$viewButton.append( $duplicateIcon );
						}

						if ( $innerBorder.length ) {
							var $duplicateInner = $innerBorder.clone();

							$viewButton.append( $duplicateInner );
						}
					}
				}
			);
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_add_to_cart_button.changeViewCart = changeViewCart;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_category_list                    = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_category_list.qodefMasonryLayout = qodefAddonsCore.qodefMasonryLayout;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_category_list.qodefButton        = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	var shortcode = 'qi_addons_for_elementor_product_list';

	qodefAddonsCore.shortcodes[shortcode]                    = {};
	qodefAddonsCore.shortcodes[shortcode].qodefLightboxPopup = qodefAddonsCore.qodefLightboxPopup;
	qodefAddonsCore.shortcodes[shortcode].qodefMasonryLayout = qodefAddonsCore.qodefMasonryLayout;

	$( document ).ready(
		function () {
			changeViewCart.init();
		}
	);

	var changeViewCart = {
		init: function () {
			this.holder = $( '.qodef-qi-woo-shortcode-product-list' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						changeViewCart.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			qodefAddonsCore.shortcodes.qi_addons_for_elementor_add_to_cart_button.changeViewCart.initItem( $currentItem );
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_list.changeViewCart = changeViewCart;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_list.qodefButton    = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_slider             = {};
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_slider.qodefSwiper = qodefAddonsCore.qodefSwiper;

	$( document ).ready(
		function () {
			changeViewCart.init();
		}
	);

	var changeViewCart = {
		init: function () {
			this.holder = $( '.qodef-qi-woo-shortcode-product-slider' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						changeViewCart.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			qodefAddonsCore.shortcodes.qi_addons_for_elementor_add_to_cart_button.changeViewCart.initItem( $currentItem );
		}
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_slider.changeViewCart = changeViewCart;
	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_slider.qodefButton    = qodefAddonsCore.qodefButton;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefInteractiveBannerFromBottom.init();
		}
	);

	var qodefInteractiveBannerFromBottom = {
		init: function () {
			this.holder = $( '.qodef-qi-interactive-banner' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefInteractiveBannerFromBottom.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef-layout--from-bottom' ) ) {
				var $text      = $currentItem.find( '.qodef-m-text-holder' ),
					$content   = $currentItem.find( '.qodef-m-movement' ),
					textHeight = $text.outerHeight( true );

				$content.css(
					'transform',
					'translateY(' + textHeight + 'px) translateZ(0)'
				);
				setTimeout(
					function () {
						$currentItem.addClass( 'qodef--visible' );
					},
					400
				);
			}
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_interactive_banner.qodefInteractiveBannerFromBottom = qodefInteractiveBannerFromBottom;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefInteractiveBannerReveal.init();
		}
	);

	var qodefInteractiveBannerReveal = {
		init: function () {
			this.holder = $( '.qodef-qi-interactive-banner' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefInteractiveBannerReveal.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef-layout--revealing' ) ) {
				var $text      = $currentItem.find( '.qodef-m-content-inner > .qodef-m-text' ),
					$button    = $currentItem.find( '.qodef-m-button' ),
					textHeight = $text.outerHeight( true );

				$button.css(
					'transform',
					'translateY(-' + textHeight + 'px) translateZ(0)'
				);
				setTimeout(
					function () {
						$currentItem.addClass( 'qodef--visible' );
					},
					400
				);
			}
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_interactive_banner.qodefInteractiveBannerReveal = qodefInteractiveBannerReveal;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).on(
		'qi_addons_for_elementor_trigger_timeline_before_init_movement',
		function ( e, $holder, $items ) {
			if ( $holder.hasClass( 'qodef-timeline-layout--horizontal-alternating' ) ) {
				qodefTimelineAlternating.init( $items );
			}
		}
	);

	var qodefTimelineAlternating = {
		init: function ( $items ) {
			var height = 0;

			if ( $items.length ) {
				// calculate maximum height of half of the element (top and bottom).
				// and set it on all elements afterwards.
				$items.each(
					function () {
						var $thisItem     = $( this ),
							$thisContent  = $thisItem.find( '.qodef-e-content-holder' ),
							$thisImage    = $thisItem.find( '.qodef-e-top-holder' ),
							currentHeight = $thisContent.height();

						if ( currentHeight < $thisImage.height() ) {
							currentHeight = $thisImage.height();
						}

						if ( currentHeight > height ) {
							height = currentHeight;
						}
					}
				);

				$items.each(
					function () {
						var $thisItem    = $( this ),
							$thisContent = $thisItem.find( '.qodef-e-content-holder' ),
							$thisImage   = $thisItem.find( '.qodef-e-top-holder' );

						$thisImage.height( height );
						$thisContent.height( height );
					}
				);
			}
		},
	};

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).on(
		'qi_addons_for_elementor_trigger_timeline_before_init_movement',
		function ( e, $holder, $items ) {
			if ( $holder.hasClass( 'qodef-timeline-layout--horizontal-standard' ) ) {
				qodefTimelineStandard.init( $holder, $items );
			}
		}
	);

	var qodefTimelineStandard = {
		init: function ( $holder,  $items ) {
			var imageHeight   = 0,
				contentHeight = 0,
				padding		  = parseInt( $items.find( '.qodef-e-top-holder' ).css( 'paddingBottom' ) ),
				$navigation	  = $holder.find( '.qodef-nav-prev, .qodef-nav-next' );

			if ( $items.length ) {
				// calculate maximum height of top and bottom items separately.
				// and set it on all elements afterwards.
				$items.each(
					function () {
						var $thisItem            = $( this ),
							currentContentHeight = $thisItem.find( '.qodef-e-content-holder' ).height(),
							currentImageHeight   = $thisItem.find( '.qodef-e-top-holder' ).height();

						if ( currentImageHeight > imageHeight ) {
							imageHeight = currentImageHeight;
						}
						if ( currentContentHeight > contentHeight ) {
							contentHeight = currentContentHeight;
						}
					}
				);

				$items.each(
					function () {
						var $thisItem    = $( this ),
							$thisContent = $thisItem.find( '.qodef-e-content-holder' ),
							$thisImage   = $thisItem.find( '.qodef-e-top-holder' ),
							$lineHolder  = $thisItem.find( '.qodef-e-line-holder' );

						$thisImage.height( imageHeight );
						$thisContent.height( contentHeight );

						$lineHolder.css( 'top', imageHeight + padding );
					}
				)

				$navigation.css( 'top', imageHeight + padding );
			}
		},
	};

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefProductListSwap.init();
		}
	);

	var qodefProductListSwap = {
		init: function () {
			this.holder = $( '.qodef-qi-woo-shortcode-product-list' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefProductListSwap.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef-item-layout--info-below-swap' ) ) {
				var $items = $currentItem.find( '.qodef-grid-item' );

				if ( $items.length ) {
					$items.each(
						function () {
							var $this       = $( this ),
								$swapHolder = $this.find( '.qodef-e-swap-holder' ),
								$price      = $swapHolder.find( '.qodef-woo-product-price' ),
								$button     = $swapHolder.find( '.qodef-e-to-swap .qodef-qi-button' ),
								width       = $button.outerWidth(),
								height      = $button.outerHeight(),
								maxWidth    = Math.ceil(
									Math.max(
										width,
										$price.width()
									)
								) + 'px',
								maxHeight   = Math.ceil(
									Math.max(
										height,
										$price.height()
									)
								) + 'px';

							$this.css(
								{
									'--qodef-max-width': maxWidth,
									'--qodef-max-height': maxHeight,
								}
							);

							$swapHolder.addClass( 'qodef--initialized' );
						}
					);
				}
			}
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_list.qodefProductListSwap = qodefProductListSwap;

})( jQuery );

(function ( $ ) {
	'use strict';

	$( document ).ready(
		function () {
			qodefProductSliderSwap.init();
		}
	);

	var qodefProductSliderSwap = {
		init: function () {
			this.holder = $( '.qodef-qi-woo-shortcode-product-slider' );

			if ( this.holder.length ) {
				this.holder.each(
					function () {
						qodefProductSliderSwap.initItem( $( this ) );
					}
				);
			}
		},
		initItem: function ( $currentItem ) {
			if ( $currentItem.hasClass( 'qodef-item-layout--info-below-swap' ) ) {
				var $items = $currentItem.find( '.qodef-e' );

				if ( $items.length ) {
					$items.each(
						function () {
							var $this       = $( this ),
								$swapHolder = $this.find( '.qodef-e-swap-holder' ),
								$price      = $swapHolder.find( '.qodef-woo-product-price' ),
								$button     = $swapHolder.find( '.qodef-e-to-swap .qodef-qi-button' ),
								width       = $button.outerWidth(),
								height      = $button.outerHeight(),
								maxWidth    = Math.ceil(
									Math.max(
										width,
										$price.width()
									)
								) + 'px',
								maxHeight   = Math.ceil(
									Math.max(
										height,
										$price.height()
									)
								) + 'px';

							$this.css(
								{
									'--qodef-max-width': maxWidth,
									'--qodef-max-height': maxHeight,
								}
							);

							$swapHolder.addClass( 'qodef--initialized' );
						}
					);
				}
			}
		},
	};

	qodefAddonsCore.shortcodes.qi_addons_for_elementor_product_slider.qodefProductSliderSwap = qodefProductSliderSwap;

})( jQuery );
