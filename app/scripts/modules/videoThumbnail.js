define(
    [
        'jquery',
        'signals',
        'tweenmax',
        'text!templates/video-thumbnail.html'
    ],

    function(
        $,
        signals,
        TweenMax,
        content
    ) {

        'use strict';

        function VideoThumbnail(app, el, data) {
            var _this = this;
            _this.app = app;
            _this.el = el;
            _this.data = data;
            
            // Signals
            _this.signals = {};
            _this.signals.selected = new signals.Signal();

            // View elements
            _this.els = {};
            _this.els._$parent = el;

            _this.htmlContent = content;

/////////////
//////////////// PRIVATE METHODS
///
            function _init() {
               var $thumbnail = $(_this.htmlContent);
               $thumbnail.find('.thumbnail_title').html(_this.data.title);
               _this.els._$parent.append($thumbnail);

               $thumbnail.on('click', _onThumbnailSelect);
            };

            function _onThumbnailSelect(e) {
                _this.signals.selected.dispatch(_this.data.videoId);
            };

/////////////
//////////////// PUBLIC METHODS
///
            _this.resize = function resize() {

            };

            $(_init());
        }

        return VideoThumbnail;
    }
);