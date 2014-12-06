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
			_this.els.$embed = _this.els.$contents.find('.soundcloud-container');

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

				_connectToSoundCloudSDK();

				// TO DO - first initialise the async SC instance
				// _this.signals.loaded.dispatch(_this);
			};

			function _connectToSoundCloudSDK() {
				$.getScript('//connect.soundcloud.com/sdk.js', function() {                    
                    var tag = document.createElement('script');
                    tag.src = '//connect.soundcloud.com/sdk.js';
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                    _initializePlayer();
                });
			};

			function _initializePlayer() {
				SC.oEmbed('http://soundcloud.com/bunker-beatz/sets/soblicsbleee-freestyle-mixtape', {
					auto_play: false,
					hide_related: true,
					show_artwork: true,
					show_comments: false,
					color: '0fc978'
				}, function(oembed){
					// TODO - I know this is fucked up, but SoundCloud oEmbed doesn't give a damn about the options I am passing in, so I have to embed the pure iFrame into the DOM Manually!
					if(typeof oembed !== 'undefined' && typeof oembed.html !== 'undefined') {
						_this.els.$embed.html($('<iframe width="100%" height="450" scrolling="no" frameborder="no" src="//w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/9952423&amp;auto_play=false&amp;hide_related=true&amp;show_artwork=true&amp;color=0fc978"></iframe>'));

						_this.signals.loaded.dispatch(_this);
					} else {
						console.log('Error whilst trying to load the SC playlist');
					}
				});
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