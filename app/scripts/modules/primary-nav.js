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

			var _selectedIndex;

			function _init() {
				_this.els.$buttons.on('click', _onSelect);

				_this.activateButton(0);
			};

			function _onSelect(e) {
				var $selectedButton = $(e.currentTarget);
				_selectedIndex = $selectedButton.index();
				_this.signals.selected.dispatch(_selectedIndex);

				_this.els.$buttons.removeClass('is-active');
				$selectedButton.addClass('is-active');
			};

			_this.selectButton = function selectButton(id){
				$(_this.els.$buttons[id]).click();
			};

			_this.activateButton = function activateButton(id) {
				_this.els.$buttons.removeClass('is-active');
				_selectedIndex = -1;
				if(id > -1) {
					$(_this.els.$buttons[id]).addClass('is-active');
				}
			}

			_this.getSelected = function getSelected() {
				return _selectedIndex;
			}

			_init();
		}

		return PrimaryNav;
	}
);