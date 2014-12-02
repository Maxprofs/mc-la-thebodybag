define(
    [
        'jquery',
        'signals',
        'tweenmax',
        'text!templates/video-viewer.html'
    ],

    function(
        $,
        signals,
        TweenMax,
        content
    ) {

        'use strict';

        function VideoViewer(app, el) {
            var _this = this;
            _this.app = app;
            
            // Signals
            _this.signals = {};
            _this.signals.deactivated = new signals.Signal();

            // View elements
            _this.els = {};
            _this.els.$body = $('body');
            _this.els._$parent = el;

            _this.htmlContent = content;

/////////////
//////////////// PRIVATE METHODS
///
            function _init() {
                $.getScript('//youtube.com/iframe_api', function() {                    
                    var tag = document.createElement('script');
                    tag.src = '//youtube.com/iframe_api';
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                });

                window.onYouTubeIframeAPIReady = function() {
                    console.log('Youtube API is ready!');
                };
            };

            function _onDeactivateComplete() {
                _this.els.$viewer.remove();
                _this.els.$body.css({'overflow': 'auto'});
                _this.els.$closeButton.on('click', undefined);

                _this.signals.deactivated.dispatch();
            };

            function _onPlayerReady() {
                console.log('_onPlayerReady');
                TweenMax.set(_this.els.$wrapper, {visibility: 'visible'});
                TweenMax.to(_this.els.$wrapper, 0.6, {opacity: 1, ease: Strong.easeOut, delay: 1});
            };

            function _onPlayerStateChange() {
                console.log('_onPlayerStateChange');
            };

            function _loadVideo(videoId) {
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
                        'frameborder': 1
                    },
                    events: {
                        'onReady': _onPlayerReady,
                        'onStateChange': _onPlayerStateChange
                    }
                });
            };

/////////////
//////////////// PUBLIC METHODS
///
            _this.resize = function resize() {
                var headerHeight = _this.app.els.$appHeader.height();
                var footerHeight = _this.app.els.$appFooter.height();
                var winHeight = window.innerHeight;
                var videoHeight = winHeight * 0.6;

                _this.els.$viewerWrapper.css({
                    width: window.innerWidth + 'px'
                });

                _this.els.$wrapper.css({
                    height: videoHeight + 'px',
                    top: Math.floor(winHeight * 0.5 - videoHeight * 0.5) + 'px'
                });
            };

            _this.activate = function activate(videoData) {
                _this.els.$viewer = $(_this.htmlContent);
                _this.els.$body.append(_this.els.$viewer);
                _this.els.$body.css({'overflow': 'hidden'});

                _this.els.$viewer = _this.els.$body.find('.videoviewer');
                _this.els.$viewerWrapper = _this.els.$body.find('.videoviewer_wrapper');
                _this.els.$wrapper = _this.els.$viewer.find('.videowrapper');
                _this.els.$wrapper.css({
                    opacity: 0,
                    visibility: 'hidden'
                });
                _this.els.$container = _this.els.$wrapper.find('.videoembed');

                _this.els.$closeButton = _this.els.$viewer.find('.nav_button-close');
                _this.els.$title = _this.els.$viewer.find('.videoviewer_title');

                _this.els.$title.html(videoData.title);

                TweenMax.set(_this.els.$viewer, {width: 0});
                TweenMax.to(_this.els.$viewer, 1.5, {width: '100%', ease: Expo.easeInOut, onComplete: function(){
                        _loadVideo(videoData.videoId);
                }});

                _this.els.$closeButton.on('click', _this.deactivate);

                _this.videoData = videoData;
            };

            _this.deactivate = function deactivate() {
                TweenMax.to(_this.els.$viewer, 1.5, {width: 0, ease: Expo.easeInOut, onComplete: function(){
                    _onDeactivateComplete()
                }});
            };

            $(_init());
        }

        return VideoViewer;
    }
);