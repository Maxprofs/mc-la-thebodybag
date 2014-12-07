define(
    [
        'jquery',
        'signals',
        'tweenmax',
        'text!templates/photo-viewbox.html',
        'modules/photo'
    ],

    function(
        $,
        signals,
        TweenMax,
        content,
        Photo
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
            _this.photos = [];
            _this.loadedPhotos = 0;

/////////////
//////////////// PRIVATE METHODS
///
            function _init() {
                
            };

            function _onDeactivateComplete() {
                _this.els.$viewbox.remove();
                _this.els.$body.removeClass('is-scroll-disabled');
                _this.els.$closeButton.on('click', undefined);

                for(var i = 0; i < _this.photos.length; i++) {
                    delete _this.photos[i];
                }
                _this.photos = [];

                _this.signals.deactivated.dispatch();
            };

            function _onPhotosReady() {
                TweenMax.set(_this.els.$wrapper, {visibility: 'visible'});
                TweenMax.to(_this.els.$wrapper, 0.6, {opacity: 1, ease: Strong.easeOut});
            };

            function _loadPhotos() {
                for(var i = 0; i < _this.photoData.length; i++) {
                    var photo = new Photo(_this.app, _this.els.$wrapper, _this.photoData[i], i);
                    _this.photos.push(photo);
                    photo.signals.photoLoaded.add(_onPhotoLoaded);
                    photo.signals.photoShown.add(_onPhotoShown);
                }
                _onPhotosReady();
            };

            function _updateNav() {
                if(_this.activePhotoId > 0) {
                    _this.els.$prevButton.removeClass('is-disabled');
                } else {
                    _this.els.$prevButton.addClass('is-disabled');
                }

                if(_this.activePhotoId < _this.photos.length - 1) {
                    _this.els.$nextButton.removeClass('is-disabled');
                } else {
                    _this.els.$nextButton.addClass('is-disabled');
                }
            };

            function _updateProgressBar() {
                var progressPercent = Math.round((_this.activePhotoId + 1) / _this.photos.length * 100 )+ '%';
                TweenMax.to(_this.els.$progressBarCurrent, 1.2, {width: progressPercent, ease: Expo.easeOut});
            };

            function _swapPhotos() {
                _this.photos[_this.previousPhotoId].hide();
                _this.photos[_this.activePhotoId].show();

                _updateNav();
                _updateProgressBar();
            };

            function _showNextPhoto() {
                if(_this.activePhotoId + 1 < _this.photos.length) {
                    _this.previousPhotoId = _this.activePhotoId;
                    _this.activePhotoId++;
                    _swapPhotos();
                }
            };

            function _showPrevPhoto() {
                if(_this.activePhotoId - 1 >= 0) {
                    _this.previousPhotoId = _this.activePhotoId;
                    _this.activePhotoId --;
                    _swapPhotos();
                }
            };

            function _onKeyUp(e) {
                if(e.keyCode === 37) {
                    _showPrevPhoto();
                } else if(e.keyCode === 39) {
                    _showNextPhoto();
                } else if(e.keyCode === 27) {
                    _this.deactivate();
                }
            };


            function _onPhotoLoaded(index) {
                _this.loadedPhotos ++;
                console.log('[modules/PhotoViewBox] _onPhotoLoaded() - Photo loaded: ', index, _this.loadedPhotos);
                if(_this.loadedPhotos === _this.photos.length - 1) {
                    _this.activePhotoId = 0;
                    _this.photos[_this.activePhotoId].show();
                    _updateNav();
                    _updateProgressBar();
                    $(window).on('keyup', _onKeyUp);
                }
            };
            function _onPhotoShown(index) {
                if(_this.activePhotoId !== index) {
                    _this.photos[index].hide();
                }
            };

/////////////
//////////////// PUBLIC METHODS
///
            _this.resize = function resize() {
                _this.els.$viewboxWrapper.css({
                    width: window.innerWidth + 'px'
                });

                if(typeof _this.activePhotoId !== 'undefined') {
                    _this.photos[_this.activePhotoId].resize();
                }
            };

            _this.activate = function activate(photoData) {
                _this.els.$viewbox = $(_this.htmlContent);
                _this.els.$body.append(_this.els.$viewbox);
                _this.els.$body.addClass('is-scroll-disabled');

                _this.els.$viewbox = _this.els.$body.find('.viewbox-photo');
                _this.els.$viewboxWrapper = _this.els.$viewbox.find('.viewbox_wrapper');
                _this.els.$wrapper = _this.els.$viewbox.find('.viewbox_box');
                _this.els.$wrapper.css({
                    opacity: 0,
                    visibility: 'hidden'
                });
                _this.els.$container = _this.els.$wrapper.find('.videoembed');
                _this.els.$logo = _this.els.$viewbox.find('.logo-header');

                _this.els.$closeButton = _this.els.$viewbox.find('.nav_button-close');
                _this.els.$prevButton = _this.els.$viewbox.find('.nav_button-prev');
                _this.els.$nextButton = _this.els.$viewbox.find('.nav_button-next');

                _this.els.$nextButton.on('click', _showNextPhoto);
                _this.els.$prevButton.on('click', _showPrevPhoto);
                _this.els.$closeButton.one('click', _this.deactivate);
                _this.els.$logo.one('click', _this.deactivate);

                _this.els.$progressBarCurrent = _this.els.$viewbox.find('.progressbar-current');
                _this.els.$progressBarTotal = _this.els.$viewbox.find('.progressbar-total');

                _this.photoData = photoData;

                TweenMax.set(_this.els.$viewbox, {width: 0});
                TweenMax.to(_this.els.$viewbox, 1.5, {width: '100%', ease: Expo.easeInOut, onComplete: function(){
                        _loadPhotos();
                }});

                _updateNav();
            };

            _this.deactivate = function deactivate() {
                _this.els.$nextButton.off('click', _showNextPhoto);
                _this.els.$prevButton.off('click', _showPrevPhoto);
                $(window).off('keyup', _onKeyUp);

                TweenMax.to(_this.els.$viewbox, 1.5, {width: 0, ease: Expo.easeInOut, onComplete: function(){
                    _onDeactivateComplete();
                }});
            };

            $(_init());
        }

        return PhotoViewBox;
    }
);