define(
	[
		'jquery',
		'signals',
		'fastclick',
		'tweenmax',
		'modules/block-hero'
	],

	function(
		$,
		signals,
		fastclick,
		TweenMax,
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

			function _init() {
				heroBlock = new HeroBlock(_this, $('#hero'));
				heroBlock.signals.heroResized.add(_resizeBody);
				heroBlock.signals.navbarClicked.add(_scrollWindowToContents);

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
			};

			/**
		     * [scrollWindowTo description]
		     * @param  {[type]} positionY [description]
		     * @return {[type]}           [description]
		    */
		    function _scrollWindowTo(positionY) {
		        window.sp = $window.scrollTop();
		        TweenMax.to(window, 1.2, {sp: positionY, ease: Quart.easeInOut, onUpdate: function(){
		            window.scrollTo(0, window.sp);
		        }});

		    };

		    function _scrollWindowToContents() {
		    	_scrollWindowTo(_this.els.$body.offset().top - _this.els.$appHeader.height());
		    }

			// Self initialising
			$(_init());
		}

		return App;
	}
);