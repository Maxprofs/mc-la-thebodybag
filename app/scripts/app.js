define(
	[
		'jquery',
		'signals',
		'fastclick',
		'tweenmax',
		'modules/imagePreloader',
		'modules/primaryNav',
		'modules/splashScreen',
		'modules/contentBlocks/contentBlockGroup'
	],

	function(
		$,
		signals,
		fastclick,
		TweenMax,
		ImagePreloader,
		PrimaryNav,
		SplashScreen,
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
			_this.els.$logo = _this.els.$appHeader.find('.logo-header');

			// Signals
			_this.signals = {};
			_this.signals.appResized = new signals.Signal();
			_this.signals.appScrolled = new signals.Signal();

			_this.contentsReady = false;

/////////////
//////////////// PRIVATE METHODS
///
			function _init() {
				_this.imagePreloader = new ImagePreloader(_this.app);
				
				_this.primaryNav = new PrimaryNav(_this, $('#primaryNav'));
				_this.primaryNav.signals.selected.add(_onPrimaryNavSelected);

				_this.splashScreen = new SplashScreen(_this, $('#splashScreen'));
				_this.splashScreen.signals.hidden.add(_onSplashScreenHidden);

				_this.contentBlockGroup = new ContentBlockGroup(_this, $('#contentBlockGroup'));
				_this.contentBlockGroup.signals.heroNavbarSelected.add(_onHeroNavbarSelected);
				_this.contentBlockGroup.signals.contentBlockActivated.add(_onContentBlockActivated);
				_this.contentBlockGroup.signals.loaded.add(_onContentBlocksLoaded);

				_this.els.$logo.on('click', _onHeaderLogoClicked);

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
				_this.signals.appResized.dispatch();
			};

			/**
		     * Handle the window scroll event
		    */
		    function _onScrolled() {
		        if(_this.contentsReady) {
					_this.signals.appScrolled.dispatch();
				}
		    };

		    function _onHeaderLogoClicked() {
		    	_onHeroNavbarSelected(0);
		    };

		    function _onSplashScreenHidden() {
		    	_this.splashScreen.signals.hidden.remove(_onSplashScreenHidden);
		    	delete _this.splashScreen;
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
		    };

		    function _onContentBlocksLoaded() {
		    	_this.contentsReady = true;
		    	console.log('contents Loaded, lets roll!');

		    	_this.splashScreen.hide();
		    };

			// Self initialising
			$(_init());
		}

		return App;
	}
);