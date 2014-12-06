define(
    [
        'jquery',
        'signals'
    ],

    function(
        $,
        signals
    ) {

        'use strict';

        function ImagePreloader(app) {
            var _this = this;
            _this.app = app;
            
            // Signals
            _this.signals = {};

/////////////
//////////////// PRIVATE METHODS
///
            function _init() {
                _this.imageBundles = [];
                _this.currentBundleId = null;
                _this.currentBundle = null;
                _this.isLoading = false;
                _this.isQueuing = false;
            };

            function _initiateLoading() {
                _this.currentBundle = _this.imageBundles[_this.currentBundleId];
                _this.isLoading = true;

                _loadImages();
            }

            function _loadImages() {
                for(var i = 0; i < _this.currentBundle.images.length; i++) {
                    _loadImage(_this.currentBundle.images[i].source, i);
                }
            };

            function _loadImage(imageSource, imageId) {
                var image = new Image();
                $(image).one('load', function(){
                  image = null;
                  _onImageLoaded(imageId);
                });
                image.src = imageSource;
            };

            function _onImageLoaded(imageId) {
                _this.currentBundle.images[imageId].loaded = true;

                var loadCount = 0;
                for(var i = 0; i < _this.currentBundle.images.length; i++) {
                    if(_this.currentBundle.images[i].loaded) {
                        loadCount ++;
                    }
                }
                if(loadCount === _this.currentBundle.images.length) {
                    _this.currentBundle.loaded = true;
                    _onImagesLoaded();
                }
            };

            function _onImagesLoaded() {
                _this.currentBundle.callback.apply(_this);
                _onAfterImagesLoaded();
            };

            function _onAfterImagesLoaded() {
                _this.isLoading = false;

                if(_this.isQueuing) {
                    _this.currentBundleId++;
                    _this.currentBundle = _this.imageBundles[_this.currentBundleId];

                    if(_this.imageBundles.length - 1 === _this.currentBundleId) {
                        _this.isQueuing = false;
                    }

                    _initiateLoading();
                }
            };

/////////////
//////////////// PUBLIC METHODS
///

            _this.preload = function preload(imagesToLoad, callback) {
                // console.log('[modules/imagePreloader] - preload() - imagesToLoad: ', imagesToLoad);

                // Gather all data for the image preload
                var images = [];
                for(var i = 0; i < imagesToLoad.length; i++) {
                    images.push({
                        source: imagesToLoad[i],
                        loaded: false
                    });
                }

                // Store the populated image objects
                var imageBundle = {
                    images: images,
                    callback: callback,
                    loaded: false
                };
                _this.imageBundles.push(imageBundle);

                if(_this.isLoading) {
                    _this.isQueuing = true;
                } else {
                    _this.isQueuing = false;
                    _this.currentBundleId = _this.imageBundles.length - 1;
                    _initiateLoading();
                }
            };

            $(_init());
        }

        return ImagePreloader;
    }
);