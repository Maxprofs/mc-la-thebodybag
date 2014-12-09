define(
	[
		'jquery',
		'signals',
		'fastclick',
		'tweenmax',
		'modules/imagePreloader',
		'modules/sectionNav',
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
		SectionNav,
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
			_this.els.$body = $('body');
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

				_this.sectionNav = new SectionNav(_this, $('#sectionNav'));
				_this.sectionNav.signals.upButtonSelected.add(_onSectionNavUpButtonSelected);
				_this.sectionNav.signals.downButtonSelected.add(_onSectionNavDownButtonSelected);
				_this.sectionNav.setTotal(_this.primaryNav.getTotal());

				_this.splashScreen = new SplashScreen(_this, $('#splashScreen'));
				_this.splashScreen.signals.hidden.add(_onSplashScreenHidden);

				_this.contentBlockGroup = new ContentBlockGroup(_this, $('#contentBlockGroup'));
				_this.contentBlockGroup.signals.contentBlockLoadStarted.add(_onContentBlockLoadStarted);
				_this.contentBlockGroup.signals.loaded.add(_onContentBlocksLoaded);
				_this.contentBlockGroup.signals.contentBlockActivated.add(_onContentBlockActivated);
				_this.contentBlockGroup.signals.heroVideoFinished.add(_onHeroVideoFinished);

				_this.els.$logo.on('click', _onHeaderLogoClicked);

				// Handle app scrolling
				_this.$window.on("scroll", _onScrolled);

				// Handle the app resizing
				_this.$window.on('resize', _onResized);
				setTimeout(function() {_onResized();}, 100);

				// Kick off the navigation by selecting the first primary nav item
				_evaluateNavSelection(0);
				_this.primaryNav.enableKeys();
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
		    	_evaluateNavSelection(0);
		    };

		    function _onHeroVideoFinished() {
				_this.contentBlockGroup.signals.heroVideoFinished.remove(_onHeroVideoFinished);
		    	_evaluateNavSelection(1);
		    };

		    function _onSplashScreenHidden() {
		    	_this.splashScreen.signals.hidden.remove(_onSplashScreenHidden);
		    	delete _this.splashScreen;
		    };


		    function _onSectionNavUpButtonSelected () {
		    	_evaluateNavSelection(_this.primaryNav.getSelected() - 1);
		    };

		    function _onSectionNavDownButtonSelected () {
		    	_evaluateNavSelection(_this.primaryNav.getSelected() + 1);
		    };

		    function _evaluateNavSelection(contentBlockId) {
		    	_this.primaryNav.setSelected(contentBlockId);
		    	_this.contentBlockGroup.setActiveContentBlockId(contentBlockId);
		    	_this.sectionNav.updateButtons(contentBlockId);
		    };

		    /*
		     * Handle primary nav selection
		     */
		    function _onPrimaryNavSelected(buttonId) {
		    	_this.contentBlockGroup.setActiveContentBlockId(buttonId);
		    	_this.sectionNav.updateButtons(buttonId);
		    };

		    /*
		     * Handle the content scrolling signal
		     */
		    function _onContentBlockActivated(contentBlockId) {
		    	if(_this.primaryNav.getSelected() !== contentBlockId) {
		    		_this.primaryNav.setSelected(contentBlockId);
		    		_this.sectionNav.updateButtons(contentBlockId);
		    	}
		    };

		    function _onContentBlockLoadStarted(message) {
		    	_this.splashScreen.setMessage(message);
		    };

		    function _onContentBlocksLoaded(message) {
		    	_this.contentsReady = true;
		    	_this.splashScreen.setMessage(message);
		    	_this.splashScreen.hide(3);
		    };

		    _this.disableAppScrolling = function disableAppScrolling() {
		    	_this.els.$body.addClass('is-scroll-disabled');
		    	_this.primaryNav.disableKeys();
		    };

		    _this.enableAppScrolling = function disableAppScrolling() {
		    	_this.els.$body.removeClass('is-scroll-disabled');
		    	_this.primaryNav.enableKeys();
		    };

			// Self initialising
			$(_init());
		}

		return App;
	}
);