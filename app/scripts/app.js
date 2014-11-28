define(
	[
		'jquery',
		'signals',
		'fastclick',
		'tweenmax',
		'modules/primary-nav',
		'modules/block-hero'
	],

	function(
		$,
		signals,
		fastclick,
		TweenMax,
		PrimaryNav,
		HeroBlock
	) {

		'use strict';

		function App() {

			// Initialising FastClick
			fastclick.attach(document.body);

			var _this = this;
			var $window = $(window);

			// Global app elements
			_this.els = {};
			_this.els.$appHeader = $('#appHeader');
			_this.els.$appFooter = $('#appFooter');
			_this.els.$body = $('#body');

			// Signals
			_this.signals = {};
			_this.signals.appResized = new signals.Signal();

			var heroBlock;
			var primaryNav;

			var scrollingContent = false;

			function _init() {
				primaryNav = new PrimaryNav(_this, $('#primaryNav'));
				primaryNav.signals.selected.add(_scrollWindowToContentBlock);
				
				heroBlock = new HeroBlock(_this, $('#hero'));
				heroBlock.signals.heroResized.add(_resizeBody);
				heroBlock.signals.navbarClicked.add(_onNavbarSelected);

				// Handle app scrolling
				$window.on("scroll", _onScroll);

				// Handle the app resizing
				$window.on('resize', _resize);
				setTimeout(function() {_resize();}, 100);
			};

			function _resize() {
				// Sending out a signal
				_this.signals.appResized.dispatch();
			};

			function _resizeBody() {
				// Resize the body according to the dimensions of the hero block
				_this.els.$body.css({
					top: heroBlock.getHeight() + _this.els.$appHeader.height()
				});

				// TO DO - refactor this later!
				$('.content').css({
					height: window.innerHeight - _this.els.$appHeader.height() - _this.els.$appFooter.height() + 'px'
				});
			};

			/**
		     * [scrollWindowTo description]
		     * @param  {[type]} positionY [description]
		     * @return {[type]}           [description]
		    */
		    function _scrollWindowTo(positionY) {
		        scrollingContent = true;
		        window.sp = $window.scrollTop();
		        TweenMax.to(window, 0.6, {sp: positionY, ease: Quart.easeInOut, onUpdate: function(){
		            window.scrollTo(0, window.sp);
		        }, onComplete: function(){
		        	window.setTimeout(function(){
		        		scrollingContent = false;
		        	}, 1000);
		        }});

		    };

		    function _onNavbarSelected() {
		    	primaryNav.selectButton(0);
		    };

		    function _scrollWindowToContentBlock(blockId) {
		    	_scrollWindowTo($('.content:eq(' + blockId + ')').offset().top - _this.els.$appHeader.height());
		    };

		    /**
		     * Handle the window scroll event
		    */
		    function _onScroll(e) {
		        if(!scrollingContent) {
		        	// Handling the user scrolling
			        var scrollDirection;
			        var scrollPosition = $window.scrollTop();
			        var scrollOffset = _this.els.$appHeader.height() * 1.2;

			        if(scrollPosition < $('.content:eq(' + 0 + ')').offset().top - scrollOffset * 2) {
			        	primaryNav.activateButton(-1);
			        } else {
				        for (var i = 2; i >= 0; i--) {
				        	if((scrollPosition >= $('.content:eq(' + i + ')').offset().top - scrollOffset) && primaryNav.getSelected() !== i) {
								primaryNav.activateButton(i);
					        	break;
					        }
				        }
				    }
		        }
		    };

			// Self initialising
			$(_init());
		}

		return App;
	}
);