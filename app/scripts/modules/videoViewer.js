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

            console.log(_this.els._$parent);

            _this.htmlContent = content;

/////////////
//////////////// PRIVATE METHODS
///
            function _init() {
                console.log('Hello video viewer!');

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

            function _setUrl(url) {
                console.log('url: ', url);
            };

            function _onDeactivateComplete() {
                _this.els.$viewer.remove();
                _this.els.$body.css({'overflow': 'auto'});
                _this.els.$viewer.on('click', undefined);

                _this.signals.deactivated.dispatch();
            };

            function _onPlayerReady() {
                console.log('_onPlayerReady');
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
                var videoHeight = winHeight * 0.75;

                _this.els.$wrapper.css({
                    height: videoHeight + 'px',
                    top: Math.floor(winHeight * 0.5 - videoHeight * 0.5) + 'px'
                });
            };

            _this.activate = function activate(videoId) {
                _this.els.$viewer = $(_this.htmlContent);
                _this.els.$body.append(_this.els.$viewer);
                _this.els.$body.css({'overflow': 'hidden'});

                _this.els.$viewer = _this.els.$body.find('.videoviewer');
                _this.els.$wrapper = _this.els.$viewer.find('.videowrapper');
                _this.els.$container = _this.els.$wrapper.find('.videoembed');

                console.log(_this.els.$wrapper, _this.els.$container);

                TweenMax.set(_this.els.$viewer, {width: 0});
                TweenMax.to(_this.els.$viewer, 1.5, {width: '100%', ease: Expo.easeInOut, onComplete: function(){
                        _loadVideo(_this.videoId);
                }});

                _this.els.$viewer.on('click', _this.deactivate);

                _this.videoId = videoId;
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