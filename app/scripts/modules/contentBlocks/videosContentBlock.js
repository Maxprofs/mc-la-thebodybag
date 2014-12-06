define(
	[
		'jquery',
		'signals',
		'tweenmax',
		'modules/contentBlocks/contentBlock',
		'modules/videoThumbnail',
		'modules/videoViewBox'
	],

	function(
		$,
		signals,
		TweenMax,
		ContentBlock,
		VideoThumbnail,
		VideoViewBox
	) {

		'use strict';

		function VideosContentBlock(app, el) {
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
			_this.els.$thumbnails = _this.els._$parent.find('.thumbnails');

			_this.data = {};
			_this.thumbnails = [];
			
			// Dynamically loaded images
			_this.images = [
				'images/background-videos.jpg'
			];

			_this.loadedThumbnailCount = 0;

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				_loadVideoResources();
			};

			function _loadVideoResources() {
				$.getJSON("resources/videos.json")
					.done(function(data) {
						if(data.videos.length) {
							_this.data = data.videos;
							for(var i = 0; i < data.videos.length; i++) {
								_this.images.push(data.videos[i].thumbnail);
							}
							_preloadImages();
						}
					})
					.fail(function() {
						console.warn('Error while loading JSON');
					});

				$.ajaxSetup({
					cache: true
				});
			};

			function _preloadImages() {
				_this.app.imagePreloader.preload(_this.images, function() {_onImagesPreloaded();});
			};

			function _onImagesPreloaded() {
				_this.els.$contentsBackground.css({
					'background-image': 'url(' + _this.images[0] + ')'
				});
				_addThumbnails();
				_this.signals.loaded.dispatch(_this);
			};

			function _addThumbnails() {
				for(var i = 0; i < _this.data.length; i++) {
					var videoThumbnail = new VideoThumbnail(_this.app, _this.els.$thumbnails, _this.data[i], i);
					_this.thumbnails.push(videoThumbnail);

					videoThumbnail.signals.selected.add(_onThumbnailSelected);
				}
			};

			function _onThumbnailSelected(index) {
				if(typeof _this.videoViewBox === 'undefined') {
					_this.videoViewBox = new VideoViewBox(_this.app, $('#videosContentBlock'));
					_this.videoViewBox.signals.deactivated.add(_onVideoViewBoxDeactivated);
					_this.videoViewBox.activate(_this.data, index);
					_this.resize();
				}
			};

			function _onVideoViewBoxDeactivated() {
				_this.videoViewBox = undefined;
			};

/////////////
//////////////// PUBLIC METHODS
///
			_this.resize = function resize() {
				if(typeof _this.videoViewBox !== 'undefined') {
					_this.videoViewBox.resize();
				}
			};

			_this.load = function load() {
				_init();
			};
		}

		VideosContentBlock.prototype = new ContentBlock();
		VideosContentBlock.prototype.constructor = VideosContentBlock;

		return VideosContentBlock;
	}
);