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

        function SectionNav(app, el) {
            var _this = this;
            _this.app = app;

            // View elements
            _this.els = {};
            _this.els._$parent = el;
            _this.els.$upButton = _this.els._$parent.find('.nav_button-up');
            _this.els.$downButton = _this.els._$parent.find('.nav_button-down');

            // Signals
            _this.signals = {};
            _this.signals.upButtonSelected = new signals.Signal();
            _this.signals.downButtonSelected = new signals.Signal();

/////////////
//////////////// PRIVATE METHODS
///
            function _init() {
                _this.els.$upButton.on('click', _onButtonSelected);
                _this.els.$downButton.on('click', _onButtonSelected);
            };

            function _onButtonSelected(e) {
                var $button = $(e.currentTarget);
                
                if($button.index() === _this.els.$upButton.index()) {
                    _this.signals.upButtonSelected.dispatch();
                } else {
                    _this.signals.downButtonSelected.dispatch();
                }
            };

/////////////
//////////////// PUBLIC METHODS
///
            _this.updateButtons = function updateButtons(activeContentBlockId) {
                _this.els.$downButton.removeClass('is-disabled');
                _this.els.$upButton.removeClass('is-disabled');

                if(activeContentBlockId === 0) {
                    _this.els.$upButton.addClass('is-disabled');
                } else if(activeContentBlockId === _this.totalContentBlocks - 1) {
                    _this.els.$downButton.addClass('is-disabled');
                }
            };

            _this.setTotal = function setTotal(total) {
                _this.totalContentBlocks = total;
            };

            $(_init());
        }

        return SectionNav;
    }
);