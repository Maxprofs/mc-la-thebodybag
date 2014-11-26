define(
	[
		'jquery',
		'signals',
		'fastclick',
		'modules/block-hero'
	],

	function(
		$,
		signals,
		fastclick,
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

			// Self initialising
			$(_init());
		}

		return App;
	}
);