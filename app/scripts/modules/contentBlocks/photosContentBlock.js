define(
	[
		'jquery',
		'signals',
		'tweenmax',
		'modules/contentBlocks/contentBlock',
		'modules/photoViewBox'
	],

	function(
		$,
		signals,
		TweenMax,
		ContentBlock,
		PhotoViewBox
	) {

		'use strict';

		function PhotosContentBlock(app, el) {
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
			_this.els.$thumbnail = _this.els._$parent.find('.thumbnail');

			_this.data = {};

			// Dynamically loaded images
			_this.images = [
				'images/background-photos.jpg',
				'images/photo-thumbnail.jpg'
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

			function _loadPhotoResources() {
				$.getJSON("resources/photos.json")
					.done(function(data) {
						if(data.photos.length) {
							_this.photoData = data.photos;
							_this.els.$thumbnail.on('click', _onThumbnailSelected);

							_this.signals.loaded.dispatch(_this);
						}
					})
					.fail(function() {
						console.warn('Error while loading JSON');
					});

				$.ajaxSetup({
					cache: true
				});
			};

			function _onThumbnailSelected() {
				if(typeof _this.photoViewBox === 'undefined') {
					_this.photoViewBox = new PhotoViewBox(_this.app, $('#photosContentBlock'));
					_this.photoViewBox.signals.deactivated.add(_onPhotoViewBoxDeactivated);
					_this.photoViewBox.activate(_this.photoData);
					_this.resize();
				}
			};

			function _onPhotoViewBoxDeactivated() {
				_this.photoViewBox = undefined;
			};

			function _onImagesPreloaded () {				
				_this.els.$contentsBackground.css({
					'background-image': 'url(' + _this.images[0] + ')'
				});
				_this.els.$thumbnail.css({
					'background-image': 'url(' + _this.images[1] + ')'
				});
				
				_loadPhotoResources();
			};

/////////////
//////////////// PUBLIC METHODS
///

			_this.resize = function resize() {
				if(typeof _this.photoViewBox !== 'undefined') {
					_this.photoViewBox.resize();
				}
			};

			_this.load = function load() {
				_init();
			};
		}

		PhotosContentBlock.prototype = new ContentBlock();
		PhotosContentBlock.prototype.constructor = PhotosContentBlock;

		return PhotosContentBlock;
	}
);