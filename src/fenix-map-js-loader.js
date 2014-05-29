
FM = {

    FENIX_REPOSITORY: "fenixapps.fao.org/repository",

    fenixmap: {
        js: [
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jquery/1.10.2/jquery-1.10.2.min.js",
           // "http://hqlprfenixapp2.hq.un.fao.org/repository/js/leaflet/0.6.4/leaflet.js",
            "http://fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min.js",
            "http://fenixapps.fao.org/repository/js/jquery.power.tip/1.2.0/jquery.powertip.min.js",
            "http://fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jquery.pageslide/2.0/jquery.pageslide.min.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jquery.ui.touch-punch/1.0/jquery.ui.touch-punch.min.js",

            // jqx
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/jqxcore.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/jqxwindow.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/jqxbuttons.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/jqxscrollbar.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/jqxlistbox.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/jqxdropdownlist.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/jqxcheckbox.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/jqxcombobox.js",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/jqxpanel.js",

            // change with library
            "js/FENIXMap.js",
            "js/core/Class.js",
            "js/core/Util.js",
            "js/core/hashmap.js",
            "js/map/config/DEPENDENCIES.js",
            "js/map/Map.js",
            "js/map/controller/MapControllerDraggable.js",
            "js/map/controller/LayerUtils.js",

            "js/map/controller/LayerSwipe.js",
            "js/map/controller/LayerLegend.js",
            "js/map/controller/Plugins.js",
            "js/map/controller/SpatialQuery.js",

            "js/map/utils/MapUtils.js",

            "js/map/layer/Layer.js",
            "js/map/layer/TileLayer.js",
            "js/map/constants/TILELAYER.js",
            "js/map/constants/WMSSERVERS.js",
            "js/map/gui/gui-controller.js",
            "js/map/gui/gui-map.js",
            "js/core/fullscreen.js",
            "js/core/UIUtils.js",
            "js/core/WMSUtils.js",

            "js/core/RequestHandler.js"
        ],
/*        cssDirectImport: [
//            "<link rel=\"stylesheet\" href=\"http://cdn.leafletjs.com/leaflet-0.6.4/leaflet-custom.css\" /><!--[if lte IE 8]><link rel=\"stylesheet\" href=\"http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.ie.css\" /><![endif]-->"
        ],*/
        css: [
            //"http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.css",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min.css",
            "http://fenixapps.fao.org/repository/js/jquery.power.tip/1.2.0/css/jquery.powertip.css",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jquery.pageslide/2.0/jquery.pageslide.css",
            "http://hqlprfenixapp2.hq.un.fao.org/repository/js/jqwidgets/3.0.2/styles/jqx.base.css"
//            "css/fenix-map.css"
        ]
    },

    init: function(callback) {

        var data = FM.fenixmap;

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

            if ( data.cssDirectImport != null ) {
                for (var i = 0 ; i < data.cssDirectImport.length ; i++) {
                    this._directImport(data.cssDirectImport[i]);
                }
            }

            FM.importSequentially(requests, callback );

        }

    },

    importSequentially: function(dependencies,  callback) {
        this._importSequentially(dependencies, 0, callback);
    },

    _importSequentially: function(dependencies, startIndex, callback) {
        if (dependencies[startIndex]) {
            var lib = dependencies[startIndex];
            var fileref =  (lib.indexOf('.js') > -1) ? this._importJS(lib) : this._importCSS(lib);
            var _this = this;
            fileref.onload = function(){
                startIndex = startIndex + 1;
                _this._importSequentially(dependencies, startIndex, callback)
            };
            document.getElementsByTagName("head")[0].appendChild(fileref)
        }
        else {
            if ( callback )
                callback();
        }
    },

    _importJS: function(lib) {
        var fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", lib);
        return fileref;
    },

    _importCSS: function(lib) {
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", lib);
        return fileref;
    },

    _directImport: function(lib) {
        var fileref=document.createElement(lib)
        return fileref;
    }

};
