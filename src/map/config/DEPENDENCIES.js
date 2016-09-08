FM.DEPENDENCIES = {

    FENIX_REPOSITORY: "fenixrepo.fao.org/cdn/js",

    fenixmap: {
        js: [
            // change with library
            "js/FENIXMap.js",
            "js/core/Class.js",
            "js/core/Util.js",
            "js/core/hashmap.js",
            "js/map/config/CONFIG.js",
            "js/map/config/DEPENDENCIES.js",
            "js/map/Map.js",
            "js/map/controller/MapController.js",
            "js/map/layer/Layer.js",
            "js/map/layer/TileLayer.js",
            "js/map/constants/TILELAYER.js",
            "js/map/gui/gui-controller.js",
            "js/map/gui/gui-map.js",
            "js/core/fullscreen.js",
            "js/core/UIUtils.js"

        ],
        css: [
//            "<link rel=\"stylesheet\" href=\"http://cdn.leafletjs.com/leaflet-0.6.4/leaflet-custom.css\" /><!--[if lte IE 8]><link rel=\"stylesheet\" href=\"http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.ie.css\" /><![endif]-->"
            "http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css",
            "http://fenixrepo.fao.org/cdn/js/jquery.power.tip/1.2.0/css/jquery.powertip.css",
            "http://hqlprfenixapp2.hq.un.fao.org:13000/repository/js/jquery.pageslide/2.0/jquery.pageslide.min.css",
            "css/fenix-map.css"
        ]
    },

    geocoder : {
        js : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.geocoder/1.0/Control.OSMGeocoder.js"
        ],
        css : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.geocoder/1.0/Control.OSMGeocoder.css"
        ]
    },

    geosearch: {
        js : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.geosearch/1.0/l.control.geosearch.js",
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.geosearch/1.0/l.geosearch.provider.openstreetmap.js"
        ],
        css : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.geosearch/1.0/l.geosearch.css"
        ]
    },

    mouseposition: {
        js : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.mouseposition/1.0/L.Control.MousePosition.js"
        ],
        css : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.mouseposition/1.0/L.Control.MousePosition.css"
        ]
    },

    drawcontrol: {
        js : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.draw/1.0/leaflet.draw.js"
        ],
        css : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.draw/1.0/leaflet.draw.css"
        ]
    },

    exportplugin: {
        js : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.export/1.0/export.js"
        ],
        css : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.export/1.0/export.css"
        ]
    },

    controlloading: {
        js : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.control.loading/1.0/Control.Loading.js"
        ],
        css : [
            "http://fenixrepo.fao.org/cdn/js/leaflet/plugins/leaflet.control.loading/1.0/Control.Loading.css"
        ]
    }
};
