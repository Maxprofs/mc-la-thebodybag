$(document).ready(function(){
	'use strict';

	var $header = $('.header');
	var $footer = $('.footer');
	var $hero = $('.hero');
	var $heroMash = $('.mash');
	var $heroVideo = $('.video-hero');
	var $body = $('.body');
	var $playButton = $('.button-play');
	var $muteButton = $('.button-mute');
	var $primaryNav = $('.nav-primary');

	var heroVideoEl = $heroVideo[0];
	var heroVideoVolume = 1;
	window.volume = heroVideoVolume;

	var _onResize = function _onResize() {
		_resizeVideo();
		
		$body.css({
			top: $hero.height() + $header.height()
		});
	};

	var _resizeVideo = function _resizeVideo() {
		var headerHeight = $header.height();
		var footerHeight = $footer.height();
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
		$heroVideo.css({
			width: 	videoWidth + 'px',
			height: videoHeight + 'px',
			left: 0.5 * (winWidth - videoWidth) + 'px',
			top: Math.floor(winHeight * 0.5 - videoHeight * 0.5) + 'px'
		});

		$hero.css({
			height: winHeight + 'px'
		});

		$heroMash.css({
			height: winHeight + 'px'
		});
	};

	// Primary navigation
	$primaryNav.on('click', function(e) {
		
	});

	// Hero video controls
	$playButton.on('click', function(e){
		if(heroVideoEl.paused) {
			heroVideoEl.play();
			TweenMax.to(heroVideoEl, 0.5, {opacity: 1, ease: Expo.easeOut});
		} else {
			heroVideoEl.pause();
			TweenMax.to(heroVideoEl, 0.5, {opacity: 0.6, ease: Expo.easeOut});
		}
	});
	$muteButton.on('click', function(e){
		heroVideoVolume = heroVideoVolume > 0 ? 0 : 1;
		
		TweenMax.to(window, 0.5, {volume: heroVideoVolume, onUpdate: function(){
			heroVideoEl.volume = window.volume;
		}});
	});

	$(window).on('resize', _onResize);
	setTimeout(function() {
		_onResize();}, 100);
});