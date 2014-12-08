define(
	[
		'jquery',
		'signals',
		'tweenmax',
		'modules/contentBlocks/contentBlock',
		'text!templates/music-player.html'
	],

	function(
		$,
		signals,
		TweenMax,
		ContentBlock,
		content
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
			_this.els.$contentBlock = _this.els.$contents.find('.content_block');
			_this.els.$title = _this.els.$contents.find('.content_title');
			_this.els.$player = _this.els.$contents.find('.musicplayer');
			_this.els.$contentsBackground = _this.els._$parent.find('.content_background');

			// Dynamically loaded images
			_this.images = [
				'images/background-music.jpg'
			];

			_this.tracks = [
				"//api.soundcloud.com/tracks/13692671"
			];

			_this.script = '//w.soundcloud.com/player/api.js';

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

				_loadSoundCloudScript();
			};

			function _loadSoundCloudScript() {
				$.getScript(_this.script, _onScriptLoaded);
			};

			function _onScriptLoaded() {
                var tag = document.createElement('script');
                tag.src = _this.script;
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                _initialisePlayer();
			};

			function _initialisePlayer() {
				_this.els.$player.html($(content));

				_this.widget = SC.Widget(_this.els.$player.find('iframe')[0]);
				_this.widget.bind(SC.Widget.Events.READY, _onWidgetReady);
			};

			function _onWidgetReady() {
				_this.widget.unbind(SC.Widget.Events.READY, _onWidgetReady);

				_this.signals.loaded.dispatch(_this);
			};

/////////////
//////////////// PUBLIC METHODS
///
			_this.resize = function resize() {
				var boxHeight = _this.els._$parent.height();
				var titleHeight = _this.els.$title.outerHeight();
				var playerHeight = boxHeight - titleHeight - _this.els.$contentBlock.css('bottom').replace('px', '') * 2;

				_this.els.$player.css({
					height: playerHeight + 'px'
				});
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