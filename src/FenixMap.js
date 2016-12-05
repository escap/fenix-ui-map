/*
 * The FM namespace contains all Fenix Map JS classes and functions.
 * This code allows you to handle any possible namespace conflicts.
 */

var FM, originalFM;

if(!window.console) {
    window.console = {
        log: function(){},
        warn: function(){},
        info: function(){},
        error: function(){}        
    };
}

if (typeof exports !== undefined + '') {
    FM = exports;
} else {
    originalL = window.FM;
    FM = {};

    FM.noConflict = function () {
        window.FM = originalFM;
        return this;
    };
    window.FM = FM;
}

FM.authors = [
	{name: 'Stefano Cudini', email: 'stefano.cudini@fao.org'},
	{name: 'Simone Murzilli', email: 'simone.murzilli@gmail.com; simone.murzilli@fao.org'}
];