define(
    [
        'jquery',
        'signals',
        'tweenmax',
        'text!templates/photo.html'
    ],

    function(
        $,
        signals,
        TweenMax,
        content
    ) {

        'use strict';

        function Photo(app, el, data, index) {
            var _this = this;
            _this.app = app;
            _this.el = el;
            _this.data = data;
            _this.index = index;
            
            // Signals
            _this.signals = {};
            _this.signals.photoLoaded = new signals.Signal();
            _this.signals.photoShown = new signals.Signal();

            // View elements
            _this.els = {};
            _this.els._$parent = el;

            _this.htmlContent = content;

            _this.showDuration = 1;

/////////////
//////////////// PRIVATE METHODS
///
            function _init() {
                _this.els.$photo = $(_this.htmlContent);
               
                _this.els._$parent.append(_this.els.$photo);

                _this.els.$image = $('<img/>');
                _this.els.$photo.append(_this.els.$image);
                _this.els.$image.attr('src', _this.data.photo);

                TweenMax.set(_this.els.$photo, {visibility: 'hidden', opacity: 0});

                _this.els.$image.one('load', function(){
                  _onImageLoaded($(this));  
                }).each(function(){
                    if($(this).complete) {
                        $(this).load();
                    }
                });
            };

            function _onImageLoaded(img) {
                var photoOriginalWidth = _this.els.$image.width();
                var photoOriginalHeight = _this.els.$image.height();
                _this.photoRatio = photoOriginalWidth/photoOriginalHeight;

                _this.signals.photoLoaded.dispatch(_this.index);

                _this.resize();
            };

/////////////
//////////////// PUBLIC METHODS
///
            _this.resize = function resize() {
                var winWidth = window.innerWidth;
                var winHeight = window.innerHeight;
                var imageWidth = 0;
                var imageHeight = 0;
                var imageDimensionMultiplier = 1;

                // Calculate the video dimensions based on the window dimensions
                imageWidth = Math.ceil(winWidth);
                imageHeight = Math.ceil(imageWidth / _this.photoRatio);
                if(winWidth / winHeight < _this.photoRatio) {
                    imageHeight = Math.ceil(winHeight);
                    imageWidth = Math.ceil(imageHeight * _this.photoRatio);
                }

                // Apply calculated dimensions with multiplied value
                imageWidth *= imageDimensionMultiplier;
                imageHeight *= imageDimensionMultiplier;
                
                _this.els.$image.css({
                    width:  imageWidth + 'px',
                    height: imageHeight + 'px',
                    left: 0.5 * (winWidth - imageWidth) + 'px',
                    top: Math.floor(winHeight * 0.5 - imageHeight * 0.5) + 'px'
                });
            };

            _this.show = function show() {
                _this.resize();
                TweenMax.set(_this.els.$photo, {visibility: 'visible', opacity: 0, scale: 1.05});
                TweenMax.to(_this.els.$photo, 0.8, {opacity: 1, scale: 1, delay: 0.5, ease: Strong.easeOut, onComplete: function(){
                    _this.signals.photoShown.dispatch(_this.index);
                }});
            };

            _this.hide = function hide() {
                TweenMax.killTweensOf(_this.els.$photo);
                TweenMax.to(_this.els.$photo, 0.5, {opacity: 0, scale: 1.05, onComplete: function(){
                    TweenMax.set(_this.els.$photo, {visibility: 'hidden'});
                }});
            };

            $(_init());
        }

        return Photo;
    }
);