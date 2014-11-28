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
			var app = app;
			var _this = this;
			
			// Signals
			_this.signals = {};
			_this.signals.selected = new signals.Signal();

			// View elements
			_this.els = {};
			_this.els._$parent = el;
			_this.els.$buttons = _this.els._$parent.find('.nav_button');

			function _init() {
				_this.els.$buttons.on('click', _onSelect);
			};

			function _onSelect(e) {
				var $selectedButton = $(e.currentTarget);
				_this.signals.selected.dispatch($selectedButton.index());

				_this.els.$buttons.removeClass('is-active');
				$selectedButton.addClass('is-active');
			};

			_this.selectButton = function selectButton(id){
				$(_this.els.$buttons[id]).click();
			};

			_init();
		}

		return PrimaryNav;
	}
);