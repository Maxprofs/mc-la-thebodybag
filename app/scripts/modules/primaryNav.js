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

			$(_init());
		}

		return PrimaryNav;
	}
);