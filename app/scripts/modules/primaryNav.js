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

		function PrimaryNav(app, el) {
			var _this = this;
			_this.app = app;
			
			// Signals
			_this.signals = {};
			_this.signals.selected = new signals.Signal();

			// View elements
			_this.els = {};
			_this.els._$parent = el;
			_this.els.$buttons = _this.els._$parent.find('.nav_button');

			_this.selectedIndex = -1;

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				_this.els.$buttons.on('click', _onSelect);
			};

			function _onSelect(e) {
				var $selectedButton = $(e.currentTarget);
				_this.selectedIndex = $selectedButton.index();

				_this.els.$buttons.removeClass('is-active');
				$selectedButton.addClass('is-active');

				_this.signals.selected.dispatch(_this.selectedIndex);
			};

			function _onKeyUp(e) {
                if(e.keyCode === 38) {
                    _selectPreviousButton();
                } else if(e.keyCode === 40) {
                	_selectNextButton();
                }
            };

            function _selectPreviousButton() {
            	if(_this.selectedIndex - 1 >= 0) {
            		_this.els.$buttons[_this.selectedIndex - 1].click();
            	}
            };

            function _selectNextButton() {
            	if(_this.selectedIndex + 1 < _this.getTotal()) {
            		_this.els.$buttons[_this.selectedIndex + 1].click();
            	}
            };

/////////////
//////////////// PUBLIC METHODS
///
			_this.setSelected = function setSelected(id){
				_this.els.$buttons.removeClass('is-active');
				$(_this.els.$buttons[id]).addClass('is-active');
				_this.selectedIndex = id;
			};

			_this.getSelected = function getSelected() {
				return _this.selectedIndex;
			};

			_this.getTotal = function getTotal() {
				return _this.els.$buttons.length;
			};

			_this.enableKeys = function enableKeys() {
				_this.disableKeys();
                $(window).on('keyup', _onKeyUp);
			};

			_this.disableKeys = function disableKeys() {
				$(window).off('keyup', _onKeyUp);
			};

			$(_init());
		}

		return PrimaryNav;
	}
);