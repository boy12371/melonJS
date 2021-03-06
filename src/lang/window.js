/**
 * MelonJS Game Engine
 * Copyright (C) 2011 - 2017 Olivier Biot
 * http://www.melonjs.org
 */

/* eslint-disable space-before-blocks, no-global-assign, no-native-reassign */

(function () {

    /**
     * The built in window Object
     * @external window
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Window.window|window}
     */


    /**
     * Specify a function to execute when the DOM is fully loaded
     * @memberOf external:window#
     * @alias onReady
     * @deprecated
     * @see me.device.onReady
     * @param {Function} fn A function to execute after the DOM is ready.
     */
    window.onReady = function (fn) {
        console.warn("Deprecated: window.onReady, use me.device.onReady instead");
        me.device.onReady.call(this, fn);
    };

    if (!window.throttle) {
        /**
         * a simple throttle function
         * use same fct signature as the one in prototype
         * in case it's already defined before
         * @ignore
         */
        window.throttle = function (delay, no_trailing, callback) {
            var last = window.performance.now(), deferTimer;
            // `no_trailing` defaults to false.
            if (typeof no_trailing !== "boolean") {
                no_trailing = false;
            }
            return function () {
                var now = window.performance.now();
                var elasped = now - last;
                var args = arguments;
                if (elasped < delay) {
                    if (no_trailing === false) {
                        // hold on to it
                        clearTimeout(deferTimer);
                        deferTimer = setTimeout(function () {
                            last = now;
                            return callback.apply(null, args);
                        }, elasped);
                    }
                }
                else {
                    last = now;
                    return callback.apply(null, args);
                }
            };
        };
    }

    if (typeof console === "undefined") {
        /**
         * Dummy console.log to avoid crash
         * in case the browser does not support it
         * @ignore
         */
        console = { // jshint ignore:line
            log : function () {},
            info : function () {},
            error : function () {
                alert(Array.prototype.slice.call(arguments).join(", "));
            }
        };
    }

    // based on the requestAnimationFrame polyfill by Erik Möller
    (function () {
        var lastTime = 0;
        var frameDuration = 1000 / 60;
        var vendors = ["ms", "moz", "webkit", "o"];
        var x;

        // standardized functions
        // https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame
        var requestAnimationFrame = window.requestAnimationFrame;
        var cancelAnimationFrame = window.cancelAnimationFrame;

        // get prefixed rAF and cAF is standard one not supported
        for (x = 0; x < vendors.length && !requestAnimationFrame; ++x) {
            requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        }
        for (x = 0; x < vendors.length && !cancelAnimationFrame; ++x) {
            cancelAnimationFrame  = window[vendors[x] + "CancelAnimationFrame"] ||
                                    window[vendors[x] + "CancelRequestAnimationFrame"];
        }

        if (!requestAnimationFrame || !cancelAnimationFrame) {
            requestAnimationFrame = function (callback) {
                var currTime = window.performance.now();
                var timeToCall = Math.max(0, frameDuration - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };

            cancelAnimationFrame = function (id) {
                window.clearTimeout(id);
            };

            // put back in global namespace
            window.requestAnimationFrame = requestAnimationFrame;
            window.cancelAnimationFrame = cancelAnimationFrame;
        }

    }());

})();
/* eslint-enable space-before-blocks, no-global-assign, no-native-reassign */
