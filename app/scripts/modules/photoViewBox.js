define(
    [
        'jquery',
        'signals',
        'tweenmax',
        'text!templates/photo-viewbox.html'
    ],

    function(
        $,
        signals,
        TweenMax,
        content
    ) {

        'use strict';

        function PhotoViewBox(app, el) {
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
                
            };

            function _onDeactivateComplete() {
                _this.els.$viewbox.remove();
                _this.els.$body.css({'overflow': 'auto'});
                _this.els.$closeButton.on('click', undefined);

                _this.signals.deactivated.dispatch();
            };

/////////////
//////////////// PUBLIC METHODS
///
            _this.resize = function resize() {
                 _this.els.$viewboxWrapper.css({
                    width: window.innerWidth + 'px'
                });
            };

            _this.activate = function activate(photoData) {
                _this.els.$viewbox = $(_this.htmlContent);
                _this.els.$body.append(_this.els.$viewbox);
                _this.els.$body.css({'overflow': 'hidden'});

                _this.els.$viewbox = _this.els.$body.find('.viewbox-photo');
                _this.els.$viewboxWrapper = _this.els.$viewbox.find('.viewbox_wrapper');
                _this.els.$wrapper = _this.els.$viewbox.find('.viewbox_box');
                _this.els.$wrapper.css({
                    opacity: 0,
                    visibility: 'hidden'
                });
                _this.els.$container = _this.els.$wrapper.find('.videoembed');

                _this.els.$closeButton = _this.els.$viewbox.find('.nav_button-close');

                TweenMax.set(_this.els.$viewbox, {width: 0});
                TweenMax.to(_this.els.$viewbox, 1.5, {width: '100%', ease: Expo.easeInOut, onComplete: function(){
                        console.log('box is ready to display photos!');
                }});

                _this.els.$closeButton.on('click', _this.deactivate);

                _this.photoData = photoData;
            };

            _this.deactivate = function deactivate() {
                TweenMax.to(_this.els.$viewbox, 1.5, {width: 0, ease: Expo.easeInOut, onComplete: function(){
                    _onDeactivateComplete()
                }});
            };

            $(_init());
        }

        return PhotoViewBox;
    }
);