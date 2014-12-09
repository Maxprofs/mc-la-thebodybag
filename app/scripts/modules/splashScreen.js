define(
    [
        'jquery',
        'signals',
        'tweenmax',
        'modules/preloader'
    ],

    function(
        $,
        signals,
        TweenMax,
        Preloader
    ) {

        'use strict';

        function SplashScreen(app, el) {
            var _this = this;
            _this.app = app;

            // View elements
            _this.els = {};
            _this.els._$parent = el;
            _this.els.$body = $('body');

            // Signals
            _this.signals = {};
            _this.signals.hidden = new signals.Signal();

/////////////
//////////////// PRIVATE METHODS
///
            function _init() {
                _this.app.disableAppScrolling();

                _this.preloader = new Preloader(_this.app, $('#splashScreen'));
                _this.preloader.signals.hidden.add(_onPreloaderHidden);
                _this.preloader.show();

                _this.app.signals.appResized.add(_onResized);
            };

            function _hide() {
                TweenMax.to(_this.els._$parent, 2.1, {opacity: 0, onComplete: function() {
                    _this.els._$parent.remove();
                    _this.signals.hidden.dispatch();

                    _this.app.enableAppScrolling();
                }});
            }

            function _onPreloaderHidden() {
                _hide();
            };

            function _onResized() {
                _this.preloader.resize();
            };

/////////////
//////////////// PUBLIC METHODS
///
            _this.hide = function hide(delay) {
                _this.preloader.hide(delay);
            };

            _this.setMessage = function setMessage(message) {
                _this.preloader.setMessage(message);
            };

            $(_init());
        }

        return SplashScreen;
    }
);