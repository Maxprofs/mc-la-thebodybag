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

		function HeroBlock(app, el) {
			var app = app;
			var _this = this;
			
			// Signals
			_this.signals = {};
			_this.signals.heroResized = new signals.Signal();
			_this.signals.navbarClicked = new signals.Signal();

			// View elements
			_this.els = {};
			_this.els._$parent = el;
			_this.els.$mash = _this.els._$parent.find('.mash');
			_this.els.$video = _this.els._$parent.find('.video-hero');
			_this.els.$playButton = _this.els._$parent.find('.nav_button-play');
			_this.els.$muteButton = _this.els._$parent.find('.nav_button-mute');
			_this.els.$navbar = _this.els._$parent.find('.navbar');

			var heroVideoEl = _this.els.$video[0];
			var heroVideoVolume = 1;
			window.volume = heroVideoVolume;

			function _resize() {
				var headerHeight = app.els.$appHeader.height();
				var footerHeight = app.els.$appFooter.height();
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

			function _init() {
				// Setting up signals
				app.signals.appResized.add(function() {
					_resize();
				});

				// Hero video controls
				_this.els.$playButton.on('click', _onPlayButtonClick);
				_this.els.$muteButton.on('click', _onMuteButtonClick);

				_this.els.$navbar.on('click', _onNavbarClick);

				heroVideoEl.addEventListener('ended', _onVideoFinished);

				// heroVideoEl.pause();
				if(heroVideoEl.paused) {
					_this.els.$playButton.click();
				}
			};

			function _onVideoFinished(e) {
				_this.els.$playButton.removeClass('is-active');
			};

			function _onPlayButtonClick(e) {
				if(heroVideoEl.paused) {
					$(this).addClass('is-active');
					heroVideoEl.play();
					TweenMax.to(heroVideoEl, 1, {opacity: 1, ease: Expo.easeOut});
				} else {
					$(this).removeClass('is-active');
					heroVideoEl.pause();
					TweenMax.to(heroVideoEl, 1, {opacity: 0.6, ease: Expo.easeOut});
				}
			};

			function _onMuteButtonClick(e) {
				heroVideoVolume = heroVideoVolume > 0 ? 0 : 1;
				
				if(heroVideoVolume < 1) {
					$(this).addClass('is-active');
				} else {
					$(this).removeClass('is-active');
				}

				TweenMax.to(window, 0.5, {volume: heroVideoVolume, onUpdate: function(){
					heroVideoEl.volume = window.volume;
				}});
			};

			function _onNavbarClick(e) {
				_this.signals.navbarClicked.dispatch();
			};

			_this.getHeight = function getHeight() {
				return _this.els._$parent.height();
			};

			_init();
		}

		return HeroBlock;
	}
);