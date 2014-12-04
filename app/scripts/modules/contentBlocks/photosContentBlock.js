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
			_this.signals = {};

			// View elements
			_this.els = {};
			_this.els._$parent = el;
			_this.els.$contents = _this.els._$parent.find('.content_body');
			_this.els.$thumbnail = _this.els._$parent.find('.thumbnail');

			_this.data = {};

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				_loadPhotoResources();
			};

			function _loadPhotoResources() {
				$.getJSON("resources/photos.json")
					.done(function(data) {
						if(data.photos.length) {
							_this.photoData = data.photos;
							_this.els.$thumbnail.on('click', _onThumbnailSelected);
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

/////////////
//////////////// PUBLIC METHODS
///
			_this.resize = function resize() {
				if(typeof _this.photoViewBox !== 'undefined') {
					_this.photoViewBox.resize();
				}
			};

			$(_init());
		}

		PhotosContentBlock.prototype = new ContentBlock();
		PhotosContentBlock.prototype.constructor = PhotosContentBlock;

		return PhotosContentBlock;
	}
);