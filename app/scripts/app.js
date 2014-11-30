define(
	[
		'jquery',
		'signals',
		'fastclick',
		'tweenmax',
		'modules/primaryNav',
		'modules/contentBlocks/contentBlockGroup'
	],

	function(
		$,
		signals,
		fastclick,
		TweenMax,
		PrimaryNav,
		ContentBlockGroup
	) {

		'use strict';

		function App() {

			// Initialising FastClick
			fastclick.attach(document.body);

			var _this = this;
			_this.$window = $(window);

			// Global app elements
			_this.els = {};
			_this.els.$appHeader = $('#appHeader');
			_this.els.$appFooter = $('#appFooter');
			_this.els.$body = $('#body');

			// Signals
			_this.signals = {};
			_this.signals.appResized = new signals.Signal();
			_this.signals.appScrolled = new signals.Signal();

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				_this.primaryNav = new PrimaryNav(_this, $('#primaryNav'));
				_this.primaryNav.signals.selected.add(_onPrimaryNavSelected);

				_this.contentBlockGroup = new ContentBlockGroup(_this, $('#contentBlockGroup'));
				_this.contentBlockGroup.signals.heroNavbarSelected.add(_onHeroNavbarSelected);
				_this.contentBlockGroup.signals.contentBlockActivated.add(_onContentBlockActivated);

				// Handle app scrolling
				_this.$window.on("scroll", _onScrolled);

				// Handle the app resizing
				_this.$window.on('resize', _onResized);
				setTimeout(function() {_onResized();}, 100);
			};

			/**
		     * Handle the window resize event
		    */
			function _onResized() {
				// Sending out a signal
				_this.signals.appResized.dispatch();
			};

			/**
		     * Handle the window scroll event
		    */
		    function _onScrolled(e) {
		        _this.signals.appScrolled.dispatch();
		    };

		    /*
		     * Handle hero navbar selection
		     */
		    function _onHeroNavbarSelected(contentBlockId) {
		    	_this.primaryNav.setSelected(contentBlockId);
		    	_this.contentBlockGroup.setActiveContentBlockId(contentBlockId);
		    };

		    /*
		     * Handle primary nav selection
		     */
		    function _onPrimaryNavSelected(buttonId) {
		    	_this.contentBlockGroup.setActiveContentBlockId(buttonId);
		    };

		    /*
		     * Handle the content scrolling signal
		     */
		    function _onContentBlockActivated(contentBlockId) {
		    	if(_this.primaryNav.getSelected() !== contentBlockId) {
		    		_this.primaryNav.setSelected(contentBlockId);
		    	}
		    }

			// Self initialising
			$(_init());
		}

		return App;
	}
);