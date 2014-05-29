/*
 * FM.Util contains various utility functions used throughout fenix-map-js code.
 *
 */

FM.Util = {

    loadedModules: [],

    dependencies: null,

    initializeLangProperties: function(lang) {
        var I18NLang = '';
        switch (lang) {
            case 'FR' : I18NLang = 'fr'; break;
            case 'ES' : I18NLang = 'es'; break;
            default: I18NLang = 'en'; break;
        }
        var path =  FMCONFIG.BASEURL + '/'+ FMCONFIG.BASEURL_LANG;

        $.i18n.properties({
            name: 'I18N',
            path: path,
            mode: 'both',
            language: I18NLang
        });
    },

    extend: function (dest) { // (Object[, Object, ...]) ->
        var sources = Array.prototype.slice.call(arguments, 1),
            i, j, len, src;

        for (j = 0, len = sources.length; j < len; j++) {
            src = sources[j] || {};
            for (i in src) {
                if (src.hasOwnProperty(i)) {
                    dest[i] = src[i];
                }
            }
        }
        return dest;
    },

    bind: function (fn, obj) { // (Function, Object) -> Function
        var args = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : null;
        return function () {
            return fn.apply(obj, args || arguments);
        };
    },

    stamp: (function () {
        var lastId = 0, key = '_leaflet_id';
        return function (/*Object*/ obj) {
            obj[key] = obj[key] || ++lastId;
            return obj[key];
        };
    }()),

    limitExecByInterval: function (fn, time, context) {
        var lock, execOnUnlock;

        return function wrapperFn() {
            var args = arguments;

            if (lock) {
                execOnUnlock = true;
                return;
            }

            lock = true;

            setTimeout(function () {
                lock = false;

                if (execOnUnlock) {
                    wrapperFn.apply(context, args);
                    execOnUnlock = false;
                }
            }, time);

            fn.apply(context, args);
        };
    },

    falseFn: function () {
        return false;
    },

    formatNum: function (num, digits) {
        var pow = Math.pow(10, digits || 5);
        return Math.round(num * pow) / pow;
    },

    splitWords: function (str) {
        return str.replace(/^\s+|\s+$/g, '').split(/\s+/);
    },

    setOptions: function (obj, options) {
        obj.options = L.extend({}, obj.options, options);
        return obj.options;
    },

    getParamString: function (obj, existingUrl) {
        var params = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                params.push(i + '=' + obj[i]);
            }
        }
        return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
    },

    template: function (str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            var value = data[key];
            if (!data.hasOwnProperty(key)) {
                throw new Error('No value provided for variable ' + str);
            }
            return value;
        });
    },

    isArray: function (obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    },

    emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
};

(function () {

    // inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

    function getPrefixed(name) {
        var i, fn,
            prefixes = ['webkit', 'moz', 'o', 'ms'];

        for (i = 0; i < prefixes.length && !fn; i++) {
            fn = window[prefixes[i] + name];
        }

        return fn;
    }

    var lastTime = 0;

    function timeoutDefer(fn) {
        var time = +new Date(),
            timeToCall = Math.max(0, 16 - (time - lastTime));

        lastTime = time + timeToCall;
        return window.setTimeout(fn, timeToCall);
    }

    var requestFn = window.requestAnimationFrame ||
        getPrefixed('RequestAnimationFrame') || timeoutDefer;

    var cancelFn = window.cancelAnimationFrame ||
        getPrefixed('CancelAnimationFrame') ||
        getPrefixed('CancelRequestAnimationFrame') ||
        function (id) { window.clearTimeout(id); };


    FM.Util.requestAnimFrame = function (fn, context, immediate, element) {
        fn = L.bind(fn, context);

        if (immediate && requestFn === timeoutDefer) {
            fn();
        } else {
            return requestFn.call(window, fn, element);
        }
    };

    FM.Util.cancelAnimFrame = function (id) {
        if (id) {
            cancelFn.call(window, id);
        }
    };

    /*FM.Util.replaceAll = function(text, stringToFind, stringToReplace) {
        var temp = text;
        var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
    };   */

    FM.Util.replaceAll = function(text, stringToFind, stringToReplace) {
        return text.replace(new RegExp(stringToFind, 'g'), stringToReplace);
    },

    FM.Util.parseLayerRequest = function(layer) {
        var layerValues = eval(layer);
        var layerRequest = '';
        $.each(layerValues, function(key, value) {
            layerRequest += '&' + key + '=' + value;
        });
        return layerRequest;
    },


    /**
     * @param module    The name of the module
     *
     * Each module has its own libraries, the full list is in the <code>libs.json</code> file.
     */
        FM.Util.loadModuleLibs = function(module, callback) {

            if  ( !FM.Util.isModuleLoaded(module) ) {

                if ( FM.Util.dependencies == null ) {

                    if ( FM.DEPENDENCIES[module] ) {
//                        console.log(FM.DEPENDENCIES[module]);
/*                        FM.Util.dependencies = FM.DEPENDENCIES[module];*/
                        FM.Util.loadDependencies(module, callback);
                    }
                    else {
                        callback();
                    }
                }
                else {
                    FM.Util.loadDependencies(module, callback);
                }
            }
            else {
                //console.log('JS libraries for module ' + module + ' won\'t be loaded again it\' executed directly the callback');
            }
        },

        FM.Util.loadDependencies = function(module, callback) {

                var data = FM.DEPENDENCIES[module];

                if(typeof data == 'string')
                    data = $.parseJSON(data);

                if ( data )  {
                    var requests = []
                    if ( data.css != null )
                        for (var i = 0 ; i < data.css.length ; i++) {
                            requests.push(data.css[i]);
                        }

                    if ( data.js != null )
                        for (var i = 0 ; i < data.js.length ; i++) {
                            requests.push(data.js[i]);
                        }

                   // console.log(' ImportDependencies.importSequentially(: ' + requests);
                    //ImportDependencies.importAsync(requests, callback);
                    ImportDependencies.importSequentially(requests, callback );

                }
        },

        FM.Util.isModuleLoaded = function(module) {

            for (var i = 0 ; i <  FM.Util.loadedModules.length ; i++) {
                if (  FM.Util.loadedModules[i] == module) {
                    //console.log('FM.Util.isModuleLoaded: ' + module);
                    return true;
                }
            }
            // console.log('loadedmodules: ' + FM.Util.loadedModules)
            return false;

        },

        FM.Util.randomID = function() {
            var randLetter = Math.random().toString(36).substring(7);
            return (randLetter + Date.now()).toLocaleLowerCase();
        },

        FM.Util.fire = function(item , type, data){
            var evt = document.createEvent("CustomEvent");
            evt.initCustomEvent(type, true, true, data);
            item.dispatchEvent(evt);
        }

        FM.Util.on = function(item , type, data, callback){
            item.addEventListener(type, callback, false);
        }

}());

// shortcuts for most used utility functions
FM.extend = FM.Util.extend;
FM.bind = FM.Util.bind;
FM.stamp = FM.Util.stamp;
FM.setOptions = FM.Util.setOptions;
FM.replaceAll = FM.Util.replaceAll;
FM.loadModuleLibs = FM.Util.loadModuleLibs;
FM.initializeLangProperties = FM.Util.initializeLangProperties;