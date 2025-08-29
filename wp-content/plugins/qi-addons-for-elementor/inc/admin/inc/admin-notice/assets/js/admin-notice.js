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
