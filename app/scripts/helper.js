var Helpr = Helpr || {

//------------- Browser feature detection methods

    supportsRAF: function() {
        var result =    window.requestAnimationFrame       ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame;
        return typeof result !== 'undefined';
    },
    initRAF: function() {
        window.requestAnimationFrame =  window.requestAnimationFrame ||
                                        window.mozRequestAnimationFrame ||
                                        window.webkitRequestAnimationFrame ||
                                        window.msRequestAnimationFrame;

        window.cancelAnimationFrame =   window.cancelAnimationFrame ||
                                        window.mozCancelAnimationFrame;
    },

    supportsTouch: function() {
        return  !!('ontouchstart' in window) ||
                (!!('onmsgesturechange' in window) && !!window.navigator.maxTouchPoints);
    },

    supportsVideo: function(){
        var videoEl = document.createElement('video');
        return !!videoEl && typeof videoEl.canPlayType !== 'undefined';
    },
    supportsH264Video: function() {
        if(!Helpr.supportsVideo()) {
            return false;
        }
        var videoEl = document.createElement('video');
        return videoEl.canPlayType('video/mp4');
    },
    supportsWebMVideo: function() {
        if(!Helpr.supportsVideo()) {
            return false;
        }
        var videoEl = document.createElement('video');
        return videoEl.canPlayType('video/webm');
    },


    supportsWebAudio: function() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (typeof (window.AudioContext) !== 'undefined') {
            var context = new AudioContext();
            return  !!context && typeof(context.createGain) === 'function';
        } else {
            return false;
        }
    },
    supportsAudioApi: function() {
        return !!('Audio' in window);
    },
    supportsGetUserMedia: function() {
        var result =    window.navigator.getUserMedia ||
                        window.navigator.webkitGetUserMedia ||
                        window.navigator.mozGetUserMedia ||
                        window.navigator.msGetUserMedia;
        return typeof result !== 'undefined';
    },
    supportsAudio: function() {        
        var audioEl = document.createElement('audio');
        return !!audioEl && typeof audioEl.canPlayType !== 'undefined';
    },
    supportsMP3Audio: function() {
        if(!Helpr.supportsAudio()) {
            return false;
        }
        var audioEl = document.createElement('audio');
        return !!(audioEl.canPlayType && audioEl.canPlayType('audio/mpeg;').replace(/no/, ''));
    },
    supportsOGGAudio: function() {
        if(!Helpr.supportsAudio()) {
            return false;
        }
        var audioEl = document.createElement('audio');
        return !!(audioEl.canPlayType && audioEl.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
    },
    supportsWAVAudio: function() {
        if(!Helpr.supportsAudio()) {
            return false;
        }
        var audioEl = document.createElement('audio');
        return !!(audioEl.canPlayType && audioEl.canPlayType('audio/wav; codecs="1"').replace(/no/, ''));
    },
    supportsAACAudio: function() {
        if(!Helpr.supportsAudio()) {
            return false;
        }
        var audioEl = document.createElement('audio');
        return !!(audioEl.canPlayType && audioEl.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''));
    },
    shouldForceAudioTag: function() {
        var result = false;

        // At the moment only Firefox needs this, as webaudio seems
        // crashing on PCs
        if(Helpr.isBrowserFirefox() && !Helpr.isBrowserMobile() && Helpr.isOSWin()) {
            result = true;
        }

        return result;
    },


    supportsMediaQueries: function() {
        return !!(window.matchMedia);
    },
    supportsCanvas: function() {
        var canvasEl = document.createElement('canvas');
        return canvasEl.getContext && typeof canvasEl.getContext('2d').fillText === 'function';
    },
    supportsCSSTransforms: function() {
        return (('getComputedStyle' in window) && 
                    (window.getComputedStyle(document.body).getPropertyValue('-webkit-transform') ||
                    window.getComputedStyle(document.body).getPropertyValue('-o-transform') || 
                    window.getComputedStyle(document.body).getPropertyValue('-moz-transform') || 
                    window.getComputedStyle(document.body).getPropertyValue('-ms-transform') || 
                    window.getComputedStyle(document.body).getPropertyValue('transform')
                ));
        return true;
    },
//------------- Browser `labeling` specific methods derived from feature detection
    


    getBrowserVersion: function(browserKey, type) {
        var keys = browserKey.split('|');
        var chunk;
        var arr = Helpr.UA.split(" ");

        for(var i = 0; i < keys.length; i++) {
            var key = keys[i];

            if(key === 'msie') {
                var ua = Helpr.UA;
                var re  = new RegExp('msie ([0-9]{1,}[\.0-9]{0,})');
                if (re.exec(ua) != null) {
                    if(type !== 'short') {
                        chunk = RegExp.$1;
                    } else {
                        chunk = parseFloat(RegExp.$1);
                    }
                }

                // Checking for 11+ version of IE
                if (typeof(chunk) === 'undefined') {
                    if (!window.ActiveXObject && 'ActiveXObject' in window) {
                        chunk = ua.substring(ua.indexOf('rv:') + 3, ua.indexOf(')'));
                    }
                }
            } else {
                for(var j = 0; j < arr.length; j++) {
                    if(arr[j].indexOf(key) > -1) {
                        chunk = arr[j];

                        if (chunk.substring(chunk.indexOf('/') > -1 && chunk.indexOf('.') > -1)) {
                            if(type === 'short') {
                                chunk = chunk.substring(chunk.indexOf('/') + 1, chunk.indexOf('.'));
                                chunk = parseInt(chunk);
                            } else {
                                chunk = chunk.substr(chunk.indexOf('/') + 1, chunk.length);
                            }
                        }
                        break;
                    }
                }
            }
        }

        // If key can't be found
        if(typeof(chunk) === 'undefined') {
            return 'N/A';
        }
        
        return chunk;
    },

    isBrowserTooOld: function() {
        var result = 'N/A';
        
        if(Helpr.isBrowserChrome()) {
            result =    Helpr.getBrowserVersion('chrome', 'short') < Helpr.MINIMUM_DESKTOP_BROWSER_VERSIONS['chrome'];
        } else if(Helpr.isBrowserSafari()) {
            result =    Helpr.getBrowserVersion('version', 'short') < Helpr.MINIMUM_DESKTOP_BROWSER_VERSIONS['safari'];
        } else if(Helpr.isBrowserOpera()) {
            result =    Helpr.getBrowserVersion('opr', 'short') < Helpr.MINIMUM_DESKTOP_BROWSER_VERSIONS['opera'] ||
                        Helpr.getBrowserVersion('opera', 'short') <= Helpr.MINIMUM_DESKTOP_BROWSER_VERSIONS['opera'];
        } else if(Helpr.isBrowserFirefox()) {
            result =    Helpr.getBrowserVersion('firefox', 'short') < Helpr.MINIMUM_DESKTOP_BROWSER_VERSIONS['firefox'];
        } else if(Helpr.isBrowserIE() && !Helpr.isBrowserOldIE()) {
            result =    Helpr.getBrowserVersion('msie', 'short') < Helpr.MINIMUM_DESKTOP_BROWSER_VERSIONS['ie'];
        } else {

            //Any browser which isn't checked against is automatically going into the fallback category!
            result = true;
        }

        return result;  
    },


    /* All about IE :( */
    filterOutIE10: function() {
        if(Helpr.UA.indexOf('msie 10.') > 0) {
            document.getElementsByTagName('html')[0].className += ' lt-ie11';
        }
    },
    isBrowserOldIE: function() {
        // Anything older than IE9 is WACK
        return document.getElementsByTagName('html')[0].className.indexOf('lt-ie9') >= 0;
    },
    isBrowserFallbackIE: function() {
        // Anything older than IE11 is FALLBACK
        return  (document.getElementsByTagName('html')[0].className.indexOf('lt-ie11') >= 0);
    },
    isBrowserIE: function() {
        return  !!(/(windows nt|msie)/g.test(Helpr.UA) &&
                !Helpr.isBrowserChrome() &&
                !Helpr.isBrowserSafari() &&
                !Helpr.isBrowserOpera() && 
                !Helpr.isBrowserFirefox());
    },



    isBrowserMobile: function() {
        return Helpr.UA.indexOf('mobile') > -1;
    },
    isBrowserTablet: function() {
        return Helpr.UA.indexOf('tablet') > -1;
    },
    isBrowserFirefox: function() {
        return Helpr.UA.indexOf('firefox') > -1;
    },
    isBrowserMobileIE: function() {
        return Helpr.UA.indexOf('iemobile') > -1;
    },
    isBrowserOpera: function() {
        return /(opera|opr)/g.test(Helpr.UA);
    },
    isBrowserSafari: function() {
        return Helpr.UA.indexOf('safari') > -1 && !Helpr.isBrowserChrome() && !Helpr.isOSAndroid();
    },
    isBrowserChrome: function() {
        return (Helpr.UA.indexOf('chrome') > -1 || Helpr.UA.indexOf('crios') > -1) && !Helpr.isBrowserOpera();
    },

    isBrowserSupported: function() {
        return  Helpr.isBrowserFirefox() ||
                Helpr.isBrowserChrome() ||
                Helpr.isBrowserSafari() ||
                Helpr.isBrowserOpera() ||
                Helpr.isBrowserIE() ||
                (Helpr.isTabletDevice() && Helpr.isBrowserMobileIE()) ||
                Helpr.isBrowserStockAndroid()
    },


    isPhoneDevice: function() {        
        return  window.matchMedia &&
                Helpr.supportsTouch() && 
                window.matchMedia('(max-width: 540px)').matches &&
                screen.width <= 540
                ? true : false;
    },
    isTabletDevice: function() {
        return  window.matchMedia &&
                Helpr.supportsTouch() && 
                window.matchMedia('(min-width: 540px)').matches &&
                screen.width >= 540
                ? true : false;
    },

//------------- Mobile device specific methods

    isOSWin: function() {
        return /(windows|windows nt)/g.test(Helpr.UA);
    },
    isOSiOS: function() {
        return /(ipad|iphone|ipod)/g.test(Helpr.UA);
    },
    isOSAndroid: function() {
        return Helpr.UA.indexOf('android') > -1;
    },
    isBrowserStockAndroid: function() {
        return  Helpr.isOSAndroid() &&
                Helpr.UA.indexOf('applewebkit') > -1 &&
                Helpr.UA.indexOf('chrome') < 0;
    },
    isBrowserStockiOS: function() {
        return  !!(Helpr.isOSiOS() &&
                Helpr.UA.indexOf('applewebkit') > -1 &&
                Helpr.UA.indexOf('safari') > -1 &&
                Helpr.UA.indexOf('chrome') < 0 &&
                Helpr.UA.indexOf('crios') < 0);
    }
};

Helpr.MINIMUM_DESKTOP_BROWSER_VERSIONS = {
    chrome:     33,
    crios:      33,
    safari:     6,
    firefox:    30,
    ie:         11,
    opera:      22
};

Helpr.UA = window.navigator.userAgent.toLowerCase();