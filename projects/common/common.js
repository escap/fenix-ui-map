requirejs.config({

    baseUrl: '',

    paths: {
        bootstrap               :   '//netdna.bootstrapcdn.com/bootstrap/3.0.1/js/bootstrap.min',
        backbone                :   '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min',
        chosen                  :   '//fenixapps.fao.org/repository/js/chosen/1.0.0/chosen.jquery.min',
        highcharts              :   '//code.highcharts.com/highcharts',
        jquery                  :   '//code.jquery.com/jquery-1.10.1.min',
        mustache                :   '//cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache',
        navbar                  :   '../navbar/geobricks_navbar',
        underscore              :   '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.6.0/underscore-min',

        // vendors
        text                    :   '../vendors/js/text',
        loglevel                :   '../vendors/js/logger/loglevel.min',
        'domReady'               :  '../vendors/js/domReady',

        // fenix-map-js
        'import-dependencies'   :   '//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',
        'leaflet'               :   '//fenixapps.fao.org/repository/js/leaflet/0.7.3/leaflet',
        'jquery.power.tip'      :   '//fenixapps.fao.org/repository/js/jquery.power.tip/1.1.0/jquery.powertip.min',
        'jquery-ui'             :   '//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
        'jquery.i18n.properties':   '//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',
        'jquery.hoverIntent'    :   '//fenixapps.fao.org/repository/js/jquery.hoverIntent/1.0/jquery.hoverIntent',

        // fenix-map-scatter
        'csvjson'               :   'http://fenixapps.fao.org/repository/js/csvjson/1.0/csvjson.min.1.0',
        'FMChartLibrary'        :   'http://168.202.28.214:7070/fenix-map-js/plugins/ChartLibrary',
        'FMChartScatter'        :   'http://168.202.28.214:7070/fenix-map-js/plugins/FMChartScatterRefactoring',
        'regression'            :   'http://fenixapps.fao.org/repository/js/highcharts/plugins/regression/1.0/regression',
        // TODO: change link
        'wkt'                   :   'http://fenixapps.fao.org/repository/js/FENIX/fenix-map-js/2.1/wkt',

        'fenix-map'             :   'http://168.202.28.214:7070/fenix-map-js/fenix-map-min',
        'fenix-map-config'      :   'http://168.202.28.214:7070/fenix-map-js/fenix-map-config',
        'fenix-map-scatter-analysis'      :   'http://168.202.28.214:7070/fenix-map-js/fenix-map-config',

        // project modules
        fm_projects_main      :      'fm_projects_main',
        fm_poverty_analysis      :   'scatter/poverty_analysis/poverty_analysis'

    },

    shim: {
        bootstrap: ['jquery'],
        backbone: {
            deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
        chosen: ['jquery'],
        highcharts: ['jquery'],
        underscore: {
            exports: '_'
        },

        'jquery-ui': ['jquery'],
        'jquery.power.tip': ['jquery'],
        'jquery.i18n.properties': ['jquery'],
        'jquery.hoverIntent': ['jquery'],
        'fenix-map': {
            deps: ['jquery',
                'leaflet',
                'jquery-ui',
                'fenix-map-config', 'import-dependencies',
                'jquery.power.tip', 'jquery.i18n.properties',
                'jquery.hoverIntent', 'chosen']
        },
        'FMChartScatter': {
            deps: ['fenix-map',
                'csvjson',
                'FMChartLibrary',
                'regression',
                'wkt']
        }
    }
});