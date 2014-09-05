define(['jquery',
    'mustache',
    'text!scatter/poverty_analysis/template.html',
    'loglevel',
    'fenix-map',
    'highcharts',
    'bootstrap'], function ($, Mustache, template, log) {

    var global = this;
    global.FMPovertyAnalysis = function() {

        var CONFIG = {
            lang: 'EN',
            placeholder: 'main_content_placeholder'
        }


        var build = function(config) {
            CONFIG = $.extend(true, {}, CONFIG, config);
            $('#' + CONFIG.placeholder).html(template);

        }

        // public instance methods
        return {
            build: build
        };
    };

});