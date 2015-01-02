define(
    [
        'jquery',
        'signals',
        'tweenmax',
        'text!templates/preloader.html'
    ],

    function(
        $,
        signals,
        TweenMax,
        content
    ) {

        'use strict';

        function Preloader(app, el) {
            var _this = this;
            _this.app = app;

            // View elements
            _this.els = {};
            _this.els._$parent = el;

            // Signals
            _this.signals = {};
            _this.signals.hidden = new signals.Signal();

/////////////
//////////////// PRIVATE METHODS
///

            function _init() {
                if(_this.els._$parent.find('.preloader').length > 0) {
                    _this.els._$parent.find('.preloader').remove();
                }
                _this.els._$parent.append($(content));
                _this.els.$preloader = _this.els._$parent.find('.preloader');
                _this.els.$preloader.css({
                    opacity: 0
                })

                _this.els.$title = _this.els.$preloader.find('.preloader_title .text');
                _this.els.$message = _this.els.$preloader.find('.preloader_message .text');

                _this.setTitle('Betöltés folyamatban');
                _this.resize();
            };

/////////////
//////////////// PUBLIC METHODS
///

            _this.resize = function resize() {
                _this.els.$preloader.css({
                    top: Math.round(_this.els._$parent.height() * 0.5 - _this.els.$preloader.height() * 0.5) + 'px',
                    left: Math.round(_this.els._$parent.width() * 0.5 - _this.els.$preloader.width() * 0.5) + 'px'
                })
            };

            _this.hide = function hide(delay) {
                TweenMax.to(_this.els.$preloader, 0.4, {opacity: 0, onComplete: function(){
                    _this.signals.hidden.dispatch();
                }, delay: delay});
            };

            _this.show = function show() {
                TweenMax.to(_this.els.$preloader, 0.4, {opacity: 1});
            };

            _this.setTitle = function setTitle(title) {
                _this.els.$title.text(title);
            };

            _this.setMessage = function setMessage(message) {
                TweenMax.killTweensOf(_this.els.$message);
                
                TweenMax.to(_this.els.$message, 0.2, {opacity: 0, y: -10, ease: Strong.easeOut, onComplete: function(){
                    _this.els.$message.text(message);
                    TweenMax.to(_this.els.$message, 0.3, {opacity: 1, y: 0, ease: Back.easeOut});
                }});
            };

            $(_init());
        }

        return Preloader;
    }
);