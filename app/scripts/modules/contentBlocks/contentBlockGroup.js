define(
	[
		'jquery',
		'signals',
		'tweenmax',
		'modules/contentBlocks/heroContentBlock',
		'modules/contentBlocks/videosContentBlock'
	],

	function(
		$,
		signals,
		TweenMax,
		HeroContentBlock,
		VideosContentBlock
	) {

		'use strict';

		function PrimaryNav(app, el) {
			var _this = this;
			_this.app = app;

			// View elements
			_this.els = {};
			_this.els._$parent = el;
			_this.els.$contents = _this.els._$parent.find('.content');

			// Signals
			_this.signals = {};
			_this.signals.heroNavbarSelected = new signals.Signal();
			_this.signals.contentBlockActivated = new signals.Signal();

			_this.$window = $(window);
			_this.activeContentBlockId = 0;
			_this.scrollingContent = false;

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				// Content blocks
				_this.heroContentBlock = new HeroContentBlock(_this.app, $('#heroContentBlock'));
				_this.heroContentBlock.signals.navbarSelected.add(_onNavbarSelected);

				_this.videosContentBlock = new VideosContentBlock(_this.app, $('#videosContentBlock'));

				// Signal handlers
				_this.app.signals.appScrolled.add(function() {
					_onScrolled();
				});
				_this.app.signals.appResized.add(function() {
					_onResized();
				});
			};

			/**
		     * Handle the app resized signal
		    */
			function _onResized() {
				// Resizing all .content blocks
				_this.els.$contents.css({
					height: window.innerHeight - _this.app.els.$appHeader.height() - _this.app.els.$appFooter.height() + 'px'
				});

				_this.heroContentBlock.resize();
				_this.videosContentBlock.resize();

				// Scroll to the active content block when the app is resized
				if(!_this.scrollingContent) {
					_scrollTo(_getContentBlockPosY(_this.getActiveContentBlockId()));
				}
			};

			/**
		     * Handle the app scrolled signal
		    */
			function _onScrolled() {
				if(!_this.scrollingContent) {
		        	// Handling the user scrolling
			        var scrollDirection;
			        var scrollPosition = _this.$window.scrollTop();
			        var scrollOffset = _this.app.els.$appHeader.height();

			        for (var i = _this.els.$contents.length - 1; i >= 0; i--) {
			        	if(scrollPosition >=  (_getContentBlockPosY(i) - scrollOffset)) {
							_this.activeContentBlockId = i;
							_this.signals.contentBlockActivated.dispatch(i);
							_this.setHeroVideoState(i);
				        	break;
				        }
			        }
		        }
			};

			/**
		     * Handle the hero content block navbar selection signal
		    */
			function _onNavbarSelected() {
				_this.signals.heroNavbarSelected.dispatch(1);
			};

			/**
		     * [scrollWindowTo description]
		     * @param  {[type]} positionY [description]
		     * @return {[type]}           [description]
		    */
		    function _scrollTo(positionY) {
		        _this.scrollingContent = true;
		        window.sp = _this.$window.scrollTop();
		        TweenMax.to(window, 0.6, {sp: positionY, ease: Quart.easeInOut, onUpdate: function(){
		            window.scrollTo(0, window.sp);
		        }, onComplete: function(){
		        	_this.scrollingContent = false;
		        }});
		    };

		    /*
		     * Return the requested contentblock's top position
		     */
		    function _getContentBlockPosY(id) {
		    	return $(_this.els.$contents[id]).offset().top - _this.app.els.$appHeader.height();
		    };

/////////////
//////////////// PUBLIC METHODS
///
		    /**
		     * Set the active content and update the scroll position of the contents
		    */
			_this.setActiveContentBlockId = function setActiveContentBlockId(id) {
				_this.activeContentBlockId = id;
				_scrollTo(_getContentBlockPosY(_this.activeContentBlockId));

				_this.setHeroVideoState(id);
			};

			/*
			 * Return the active content block index 
			 */
			_this.getActiveContentBlockId = function getActiveContentBlockId() {
				return _this.activeContentBlockId;
			};

			/**
			 * Stop the hero video when navigating away from it,
			 * and resume when going back to it - if necessary
			 */
			_this.setHeroVideoState = function setHeroVideoState(id) {
				if(id === 0) {
					_this.heroContentBlock.resume();
				} else {
					_this.heroContentBlock.stop();
				}
			};

			$(_init());
		}

		return PrimaryNav;
	}
);