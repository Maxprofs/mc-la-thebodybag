require.config({
    paths: {
        'jquery':       '../../bower_components/jquery/dist/jquery',
        'signals':      '../../bower_components/js-signals/dist/signals',
        'tweenmax':     '../../bower_components/greensock/src/uncompressed/TweenMax',
        'fastclick':    '../../bower_components/fastclick/lib/fastclick'
    },
    shim: {
        jquery: {
            deps: [],
            exports: '$'
        },
        'signals': {
            deps: [],
            exports: 'jsSignals'
        },
        tweenmax: {
            deps: [],
            exports: 'TweenMax'
        },
        fastclick: {
            deps: [],
            exports: 'FastClick'
        }
    }
});

require(['App', 'jquery'], function (App, $) {
    'use strict';

    /* 
     * If the user is using an incapable old browser, let them know
     * by redirecting them
     * */
     $(document).ready(function(){
        window.App = new App();
     });
});