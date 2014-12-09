define(
	[
		'jquery',
		'signals',
		'tweenmax',
		'modules/contentBlocks/heroContentBlock',
		'modules/contentBlocks/musicContentBlock',
		'modules/contentBlocks/videosContentBlock',
		'modules/contentBlocks/photosContentBlock'
	],

	function(
		$,
		signals,
		TweenMax,
		HeroContentBlock,
		MusicContentBlock,
		VideosContentBlock,
		PhotosContentBlock
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
			_this.signals.heroVideoFinished = new signals.Signal();
			_this.signals.contentBlockActivated = new signals.Signal();
			_this.signals.contentBlockLoadStarted = new signals.Signal();
			_this.signals.ready = new signals.Signal();
			_this.signals.loaded = new signals.Signal();

			_this.$window = $(window);
			_this.activeContentBlockId = 0;
			_this.scrollingContent = false;

			_this.contentBlocks = [];

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				// Content blocks
				_this.heroContentBlock = new HeroContentBlock(_this.app, $('#heroContentBlock'));
				_this.heroContentBlock.signals.videoFinished.add(_onHeroVideoFinished);
				_this.heroContentBlock.signals.loaded.add(_onContentBlockLoaded);
				_this.contentBlocks.push(_this.heroContentBlock);
			
				_this.musicContentBlock = new MusicContentBlock(_this.app, $('#musicContentBlock'));
				_this.musicContentBlock.signals.loaded.add(_onContentBlockLoaded);
				_this.contentBlocks.push(_this.musicContentBlock);

				_this.videosContentBlock = new VideosContentBlock(_this.app, $('#videosContentBlock'));
				_this.videosContentBlock.signals.loaded.add(_onContentBlockLoaded);
				_this.videosContentBlock.signals.videoPlayed.add(_onVideoViewBoxPlayed);
				_this.contentBlocks.push(_this.videosContentBlock);
	
				_this.photosContentBlock = new PhotosContentBlock(_this.app, $('#photosContentBlock'));
				_this.photosContentBlock.signals.loaded.add(_onContentBlockLoaded);
				_this.contentBlocks.push(_this.photosContentBlock);

				// Signal handlers
				_this.app.signals.appScrolled.add(function() {
					_onScrolled();
				});
				_this.app.signals.appResized.add(function() {
					_onResized();
				});

				// Start preloading the contents
				_setPreloadingMessage(_this.heroContentBlock);
				_this.heroContentBlock.load();
			};

			function _setPreloadingMessage(contentBlock) {
				if(contentBlock === _this.heroContentBlock) {
					_this.signals.contentBlockLoadStarted.dispatch('Hozom az intrót');
				} else if(contentBlock === _this.musicContentBlock) {
					_this.signals.contentBlockLoadStarted.dispatch('Rakom az ütemeket');
				} else if(contentBlock === _this.videosContentBlock) {
					_this.signals.contentBlockLoadStarted.dispatch('Vágom a videókat');
				} else if(contentBlock === _this.photosContentBlock) {
					_this.signals.contentBlockLoadStarted.dispatch('Lövöm a képeket');
				}
			};

			function _onContentBlockLoaded(contentBlock) {
				if(contentBlock === _this.heroContentBlock) {
					_this.musicContentBlock.load();
					_setPreloadingMessage(_this.musicContentBlock);
				} else if(contentBlock === _this.musicContentBlock) {
					_this.videosContentBlock.load();
					_setPreloadingMessage(_this.videosContentBlock);
				} else if(contentBlock === _this.videosContentBlock) {
					_this.photosContentBlock.load();
					_setPreloadingMessage(_this.photosContentBlock);
				} else if(contentBlock === _this.photosContentBlock) {
					_this.signals.loaded.dispatch('Kész vagyok haver!');
				}
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
				_this.musicContentBlock.resize();
				_this.videosContentBlock.resize();
				_this.photosContentBlock.resize();

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
							if(typeof _this.heroContentBlock !== 'undefined') {
								_this.setHeroVideoState(i);
							}
				        	break;
				        }
			        }
		        }
			};

			/**
		     * Handle the hero video finished playing
		    */
			function _onHeroVideoFinished() {
				_this.signals.heroVideoFinished.dispatch();
			};

			function _onVideoViewBoxPlayed() {
				_this.musicContentBlock.stopPlaying();
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
		    	if(typeof _this.els.$contents[id] !== 'undefined') {
		    		return $(_this.els.$contents[id]).offset().top - _this.app.els.$appHeader.height();
		    	} else {
		    		return 0;
		    	}
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

				if(typeof _this.heroContentBlock !== 'undefined') {
					_this.setHeroVideoState(id);
				}
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