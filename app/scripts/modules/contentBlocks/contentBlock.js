define(
	[
		'jquery',
		'signals',
		'tweenmax'
	],

	function(
		$,
		signals,
		TweenMax
	) {

		'use strict';

		function ContentBlock(app, el) {
			if (arguments.length == 0) return;
			
			var app = app;
			var _this = this;

			_this.signals = {};
			_this.signals.loaded = new signals.Signal();
		}

		return ContentBlock;
	}
);