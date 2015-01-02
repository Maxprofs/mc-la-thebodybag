define(
    [
        'jquery',
        'signals',
        'tweenmax',
        'text!templates/video-viewbox.html',
        'modules/preloader'
    ],

    function(
        $,
        signals,
        TweenMax,
        content,
        Preloader
    ) {

        'use strict';

        function VideoViewBox(app, el) {
            var _this = this;
            _this.app = app;
            
            // Signals
            _this.signals = {};
            _this.signals.deactivated = new signals.Signal();
            _this.signals.videoPlayed = new signals.Signal();

            // View elements
            _this.els = {};
            _this.els.$body = $('body');
            _this.els._$parent = el;

            _this.htmlContent = content;

            _this.activeVideoId = 0;

            _this.script = 'http://youtube.com/iframe_api';

/////////////
//////////////// PRIVATE METHODS
///
            function _init() {
                $.getScript(_this.script, _onScriptLoaded);
            };

            function _addPreloader(el) {
                _this.preloader = new Preloader(_this.app, el);
                _this.preloader.signals.hidden.add(_onPreloaderHidden);
                _this.preloader.setMessage('Jön a videó');
                _this.preloader.show();
            }

            function _onScriptLoaded() {
                var tag = document.createElement('script');
                tag.src = _this.script;
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

                window.onYouTubeIframeAPIReady = function() {
                    // console.log('Youtube API is ready!');
                };
            };

            function _onDeactivateComplete() {
                _this.els.$viewbox.remove();
                _this.els.$closeButton.on('click', undefined);

                _this.signals.deactivated.dispatch();

                _this.app.enableAppScrolling();
            };

            function _onPlayerReady() {
                // console.log('[modules/videoViewBox] - _onPlayerReady()');
                _this.preloader.setMessage('Meg is vagyunk!');
                _this.preloader.hide(1);
            };

            function _onPreloaderHidden() {
                _showVideo();
                _updateNav();
            }

            function _onPlayerStateChange(newState) {
                // 0 = FINISH
                // 1 = PLAY
                // 2 = PAUSE
                // 3 = SEEK                
                if(newState.data === 1) {
                    _this.signals.videoPlayed.dispatch();
                }
            };

            function _showVideo() {
                TweenMax.set(_this.els.$wrapper, {visibility: 'visible'});
                TweenMax.to(_this.els.$wrapper, 0.6, {opacity: 1, ease: Strong.easeOut});
            };

            function _hideVideo() {
                TweenMax.to(_this.els.$wrapper, 0.4, {opacity: 0, ease: Strong.easeOut, onComplete: function() {
                    TweenMax.set(_this.els.$wrapper, {visibility: 'hidden'});
                    _onVideoHidden();
                }});
            };

            function _loadVideo(videoId) {
                // console.log('[modules/videoViewBox] - _loadVideo() - videoId: ', videoId);
                if(typeof _this.player !== 'undefined') {
                    _this.player.destroy();
                }

                _addPreloader(_this.els.$viewboxWrapper);

                _this.player = new YT.Player(_this.els.$container[0], {
                    width: '854',
                    height: '480',
                    videoId: videoId,
                    playerVars: {
                        'showinfo': 0,
                        'playsinline': 1,
                        'modestbranding': 0,
                        'rel': 0,
                        'wmode': 'transparent',
                        'frameborder': 1,
                        'enablejsapi': 1,
                        'html5': 1
                    },
                    events: {
                        'onReady': _onPlayerReady,
                        'onStateChange': _onPlayerStateChange
                    }
                });

                _this.player.addEventListener('onStateChange', _onPlayerStateChange);
            };

            function _showNextVideo() {
                if(_this.activeVideoId + 1 < _this.videoData.length) {
                    _this.activeVideoId++;
                    _swapVideos();
                }
            };
            
            function _showPrevVideo() {
                if(_this.activeVideoId - 1 >= 0) {
                    _this.activeVideoId--;
                    _swapVideos();
                }
            };

            function _onKeyUp(e) {
                if(e.keyCode === 37) {
                    _showPrevVideo();
                } else if(e.keyCode === 39) {
                    _showNextVideo();
                } else if(e.keyCode === 27) {
                    _this.deactivate();
                }
            };

            function _swapVideos() {
                _updateNav();
                _hideVideo();
            };

            function _onVideoHidden() {
                _loadVideo(_this.videoData[_this.activeVideoId].videoId);
            };

            function _updateNav() {
                if(_this.activeVideoId > 0) {
                    _this.els.$prevButton.removeClass('is-disabled');
                } else {
                    _this.els.$prevButton.addClass('is-disabled');
                }

                if(_this.activeVideoId < _this.videoData.length - 1) {
                    _this.els.$nextButton.removeClass('is-disabled');
                } else {
                    _this.els.$nextButton.addClass('is-disabled');
                }
            };

/////////////
//////////////// PUBLIC METHODS
///
            _this.resize = function resize() {
                var headerHeight = _this.app.els.$appHeader.height();
                var footerHeight = _this.app.els.$appFooter.height();
                var winHeight = window.innerHeight;
                var videoHeight = winHeight * 0.6;

                _this.els.$viewboxWrapper.css({
                    width: window.innerWidth + 'px'
                });

                _this.els.$wrapper.css({
                    width: (window.innerWidth - 80) + 'px',
                    height: videoHeight + 'px',
                    left: '40px',
                    top: Math.floor(winHeight * 0.5 - videoHeight * 0.5 + 15) + 'px'
                });

                _this.els.$title.css({
                    top: (28 - _this.els.$title.height() * 0.5) + 'px'
                })
            };

            _this.activate = function activate(videoData, index) {
                _this.activeVideoId = index;

                _this.els.$viewbox = $(_this.htmlContent);
                _this.els.$body.append(_this.els.$viewbox);
                _this.app.disableAppScrolling();

                _this.els.$viewbox = _this.els.$body.find('.viewbox-video');
                _this.els.$viewboxWrapper = _this.els.$viewbox.find('.viewbox_wrapper');
                _this.els.$wrapper = _this.els.$viewbox.find('.viewbox_box');
                _this.els.$wrapper.css({
                    opacity: 0,
                    visibility: 'hidden'
                });
                _this.els.$container = _this.els.$wrapper.find('.viewbox_embed');
                _this.els.$logo = _this.els.$viewbox.find('.logo-header');

                _this.els.$closeButton = _this.els.$viewbox.find('.nav_button-close');
                _this.els.$prevButton = _this.els.$viewbox.find('.nav_button-prev');
                _this.els.$nextButton = _this.els.$viewbox.find('.nav_button-next');

                _this.els.$title = _this.els.$viewbox.find('.viewbox_title');
                _this.els.$title.html(videoData.title);

                _this.els.$nextButton.on('click', _showNextVideo);
                _this.els.$prevButton.on('click', _showPrevVideo);
                _this.els.$closeButton.one('click', _this.deactivate);
                _this.els.$logo.one('click', _this.deactivate);
                _this.videoData = videoData;

                TweenMax.set(_this.els.$viewbox, {width: 0});
                TweenMax.to(_this.els.$viewbox, 1.5, {width: '100%', ease: Expo.easeInOut, onComplete: function(){
                        _loadVideo(_this.videoData[_this.activeVideoId].videoId);
                }});

                _updateNav();
                $(window).on('keyup', _onKeyUp);
            };

            _this.deactivate = function deactivate() {
                _this.els.$closeButton.off('click', _this.deactivate);
                _this.els.$nextButton.off('click', _showNextVideo);
                _this.els.$prevButton.off('click', _showPrevVideo);
                $(window).off('keyup', _onKeyUp);

                TweenMax.to(_this.els.$viewbox, 1.5, {width: 0, ease: Expo.easeInOut, onComplete: function(){
                    _onDeactivateComplete()
                }});
            };

            $(_init());
        }

        return VideoViewBox;
    }
);