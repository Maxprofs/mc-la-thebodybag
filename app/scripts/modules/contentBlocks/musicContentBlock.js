define(
	[
		'jquery',
		'signals',
		'tweenmax',
		'modules/contentBlocks/contentBlock'
	],

	function(
		$,
		signals,
		TweenMax,
		ContentBlock
	) {

		'use strict';

		function MusicContentBlock(app, el) {
			ContentBlock.apply(this, arguments);

			if (!$(el).length) {
				return
			};

			var _this = this;
			_this.app = app;
			
			// Signals
			_this.signals = _this.signals || {};

			// View elements
			_this.els = {};
			_this.els._$parent = el;
			_this.els.$contents = _this.els._$parent.find('.content_body');
			_this.els.$contentsBackground = _this.els._$parent.find('.content_background');

			// Dynamically loaded images
			_this.images = [
				'images/background-music.jpg'
			];

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				_preloadImages();
			};

			function _preloadImages() {
				_this.app.imagePreloader.preload(_this.images, function() {_onImagesPreloaded();});
			};

			function _onImagesPreloaded() {
				_this.els.$contentsBackground.css({
					'background-image': 'url(' + _this.images[0] + ')'
				});

				_this.signals.loaded.dispatch(_this);
			};

/////////////
//////////////// PUBLIC METHODS
///
			_this.resize = function resize() {
				
			};

			_this.load = function load() {
				_init();
			};
		}

		MusicContentBlock.prototype = new ContentBlock();
		MusicContentBlock.prototype.constructor = MusicContentBlock;

		return MusicContentBlock;
	}
);