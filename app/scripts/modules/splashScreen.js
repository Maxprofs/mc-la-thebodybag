define(
    [
        'jquery',
        'signals',
        'tweenmax'
    ],

    function(
        $,
        signals,
        TweenMax
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
            };

/////////////
//////////////// PUBLIC METHODS
///
            _this.resize = function resize() {

            };

            _this.hide = function hide() {
                TweenMax.to(_this.els._$parent, 2.1, {opacity: 0, onComplete: function() {
                    _this.els._$parent.remove();
                    _this.signals.hidden.dispatch();

                    _this.app.enableAppScrolling();
                }});
            };

            $(_init());
        }

        return SplashScreen;
    }
);