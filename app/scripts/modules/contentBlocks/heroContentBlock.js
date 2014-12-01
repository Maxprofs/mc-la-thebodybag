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

		function HeroContentBlock(app, el) {
			ContentBlock.apply(this, arguments);

			if (!$(el).length) {
				return
			};

			var _this = this;
			_this.app = app;
			
			// Signals
			_this.signals = {};
			_this.signals.heroResized = new signals.Signal();
			_this.signals.navbarSelected = new signals.Signal();

			// View elements
			_this.els = {};
			_this.els._$parent = el;
			_this.els.$mash = _this.els._$parent.find('.mash');
			_this.els.$video = _this.els._$parent.find('.video-hero');
			_this.els.$playButton = _this.els._$parent.find('.nav_button-play');
			_this.els.$muteButton = _this.els._$parent.find('.nav_button-mute');
			_this.els.$navbar = _this.els._$parent.find('.navbar');
			_this.els.$progressBarPlayed = _this.els._$parent.find('.progressbar-played');
			_this.els.$progressBarBuffered = _this.els._$parent.find('.progressbar-buffered');

			_this.heroVideoEl = _this.els.$video[0];
			_this.heroVideoVolume = 1;
			_this.heroVideoDuration = 0;
			window.volume = _this.heroVideoVolume;

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				// Hero video controls
				_this.els.$playButton.on('click', _onPlayButtonClick);
				_this.els.$muteButton.on('click', _onMuteButtonClick);

				_this.els.$navbar.on('click', _onNavbarClick);

				_this.heroVideoEl.addEventListener("canplay", _onVideoCanPlay);
				_this.heroVideoEl.addEventListener("loadedmetadata", _onVideoMetadataLoaded);
				_this.heroVideoEl.addEventListener('ended', _onVideoFinished);
			};

			function _onVideoFinished(e) {
				_this.els.$playButton.removeClass('is-active');

				setTimeout(function(){
					_this.els.$navbar.click();
				}, 1000);

				_stopUpdatingProgressBar();
			};

			function _onVideoMetadataLoaded() {
				_this.heroVideoDuration = _this.heroVideoEl.duration;
				
				// TO DO - don't forget to get rid of this before deploying
				// _this.heroVideoEl.currentTime = _this.heroVideoDuration - 5;
			};

			function _onVideoCanPlay() {
				_this.els.$playButton.click();
			};

			function _getBufferedPercent() {
				if(_this.heroVideoEl.readyState) {
					var buffered = _this.heroVideoEl.buffered.end(0);
				    var bufferedPercent = 100 * buffered / _this.heroVideoDuration;

				    return bufferedPercent;
				} else {
					return 100;
				}
			};

			function _startUpdatingProgressBar() {
				_stopUpdatingProgressBar();				
				_this.updateProgressInterval = setInterval(_updateProgressBar, 500);
			};

			function _stopUpdatingProgressBar() {
				clearInterval(_this.updateProgressInterval);
			};

			function _updateProgressBar() {
				var playedPercent = 100 * _this.heroVideoEl.currentTime / _this.heroVideoDuration;
				var bufferedPercent = _getBufferedPercent();

			    _this.els.$progressBarBuffered.width(bufferedPercent + '%');
			    _this.els.$progressBarPlayed.width(playedPercent + '%');

			    //If finished buffering buffering quit calling it
			    if (_this.heroVideoEl.currentTime >= _this.heroVideoDuration) {
					_stopUpdatingProgressBar();
				}
			};

			function _onPlayButtonClick(e) {
				if(_this.heroVideoEl.paused) {
					$(this).addClass('is-active');
					_this.heroVideoEl.play();
					_startUpdatingProgressBar();
					TweenMax.to(_this.heroVideoEl, 1, {opacity: 1, ease: Expo.easeOut});
				} else {
					$(this).removeClass('is-active');
					_this.heroVideoEl.pause();
					_stopUpdatingProgressBar();
					TweenMax.to(_this.heroVideoEl, 1, {opacity: 0.6, ease: Expo.easeOut});
				}
			};

			function _onMuteButtonClick(e) {
				_this.heroVideoVolume = _this.heroVideoVolume > 0 ? 0 : 1;
				
				if(_this.heroVideoVolume < 1) {
					$(this).addClass('is-active');
				} else {
					$(this).removeClass('is-active');
				}

				TweenMax.to(window, 0.5, {volume: _this.heroVideoVolume, onUpdate: function(){
					_this.heroVideoEl.volume = window.volume;
				}});
			};

			function _onNavbarClick(e) {
				_this.signals.navbarSelected.dispatch();
			};

/////////////
//////////////// PUBLIC METHODS
///
			_this.resize = function resize() {
				var headerHeight = _this.app.els.$appHeader.height();
				var footerHeight = _this.app.els.$appFooter.height();
				var videoOriginalWidth = 854;
				var videoOriginalHeight = 480;
				var videoRatio = videoOriginalWidth/videoOriginalHeight;
				var winWidth = window.innerWidth;
				var winHeight = window.innerHeight - headerHeight - footerHeight;
				var videoWidth = 0;
				var videoHeight = 0;
				var videoDimensionMultiplier = 1.1;

				// Calculate the video dimensions based on the window dimensions
				videoWidth = Math.ceil(winWidth);
				videoHeight = Math.ceil(videoWidth / videoRatio);
				if(winWidth / winHeight < videoRatio) {
					videoHeight = Math.ceil(winHeight);
					videoWidth = Math.ceil(videoHeight * videoRatio);
				}

				// Apply calculated dimensions with multiplied value
				videoWidth *= videoDimensionMultiplier;
				videoHeight *= videoDimensionMultiplier;
				_this.els.$video.css({
					width: 	videoWidth + 'px',
					height: videoHeight + 'px',
					left: 0.5 * (winWidth - videoWidth) + 'px',
					top: Math.floor(winHeight * 0.5 - videoHeight * 0.5) + 'px'
				});

				_this.els._$parent.css({
					height: winHeight + 'px'
				});

				_this.els.$mash.css({
					height: winHeight + 'px'
				});

				//Send signal of being resized
				_this.signals.heroResized.dispatch();
			};

			_this.getHeight = function getHeight() {
				return _this.els._$parent.height();
			};

			$(_init());
		}

		HeroContentBlock.prototype = new ContentBlock();
		HeroContentBlock.prototype.constructor = HeroContentBlock;

		return HeroContentBlock;
	}
);