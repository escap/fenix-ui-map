
requirejs(['../src/paths'], function (paths) {
    'use strict';

    paths.baseUrl = '../';

    require.config(paths);

    require([
        'jquery','jquery','underscore','bootstrap',
        'fenix-map',
        'fenix-map-config',
        'domready!'
    ], function($, jQuery, _, bts,
        FenixMap,
        FenixMapConf
        ) {

        _.extend(FenixMapConf, {
            BASEURL: '../dist',
            BASEURL_LANG: '../dist/i18n/'
        });

        var map = new FM.Map('map', {
            plugins: {
                geosearch: true,
                mouseposition: false,
                controlloading : true
            },
            guiController: {
                overlay: false,
                baselayer: false,
                wmsLoader: false
            },
            url: {
                MAP_SERVICE_SHADED: 'http://fenix.fao.org/test/geo/fenix/mapclassify/join/',
                DEFAULT_WMS_SERVER: 'http://fenix.fao.org/geoserver',
                MAP_SERVICE_GFI_JOIN: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/',
                MAP_SERVICE_GFI_STANDARD: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/'
            },
            zoomToCountry: null,
            highlightCountry: ["IND", "THA", "IDN", "JPN"],
            style: {
                color: '#337ab7',
                opacity: 0.8,
                weight: 2,
                fillColor: '#337ab7',
                fillOpacity: 0.1
            }
        });
        map.createMap();

    });
});
