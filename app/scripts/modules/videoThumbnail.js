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

        function VideoThumbnail(app, el, data, index) {
            var _this = this;
            _this.app = app;
            _this.el = el;
            _this.data = data;
            _this.index = index;
            
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
                $thumbnail.find('.thumbnail_bg').css({
                    'background-image': 'url(' + _this.data.thumbnail + ')'
                });
               
                _this.els._$parent.append($thumbnail);

                $thumbnail.on('click', _onThumbnailSelect);
            };

            function _onThumbnailSelect(e) {
                _this.signals.selected.dispatch(_this.index);
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