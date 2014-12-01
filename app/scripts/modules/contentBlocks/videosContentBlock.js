define(
	[
		'jquery',
		'signals',
		'tweenmax',
		'modules/contentBlocks/contentBlock',
		'modules/videoThumbnail',
		'modules/videoViewer'
	],

	function(
		$,
		signals,
		TweenMax,
		ContentBlock,
		VideoThumbnail,
		VideoViewer
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
			_this.signals = {};

			// View elements
			_this.els = {};
			_this.els._$parent = el;
			_this.els.$contents = _this.els._$parent.find('.content_body');
			_this.els.$thumbnails = _this.els._$parent.find('.thumbnails');

			_this.data = {};
			_this.thumbnails = [];

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				_loadVideoResources();
			};

			function _loadVideoResources() {
				$.getJSON("/resources/videos.json")
					.done(function(data) {
						if(data.videos.length) {
							_addThumbnails(data.videos);
						}
					})
					.fail(function() {
						console.warn('Error while loading JSON');
					});

				$.ajaxSetup({
					cache: true
				});
			};

			function _addThumbnails(data) {
				_this.data = data;

				for(var i = 0; i < _this.data.length; i++) {
					var videoThumbnail = new VideoThumbnail(_this.app, _this.els.$thumbnails, _this.data[i]);
					_this.thumbnails.push(videoThumbnail);

					videoThumbnail.signals.selected.add(_onThumbnailSelected);
				}
			};

			function _onThumbnailSelected(videoId) {
				if(typeof _this.videoViewer === 'undefined') {
					_this.videoViewer = new VideoViewer(_this.app, $('#videosContentBlock'));
					_this.videoViewer.signals.deactivated.add(_onVideoViewerDeactivated);
					_this.videoViewer.activate(videoId);
					_this.resize();
				}
			};

			function _onVideoViewerDeactivated() {
				_this.videoViewer = undefined;
			};

/////////////
//////////////// PUBLIC METHODS
///
			_this.resize = function resize() {
				if(typeof _this.videoViewer !== 'undefined') {
					_this.videoViewer.resize();
				}
			};

			$(_init());
		}

		VideosContentBlock.prototype = new ContentBlock();
		VideosContentBlock.prototype.constructor = VideosContentBlock;

		return VideosContentBlock;
	}
);