FM.Layer = FM.Class.extend({

    _fenixmap: '',

    id : '',

    //layer: '',

    layer: {
        // WMS default parameters
        styles:'', // could be better 'styles' to be passed directory to the WMS parameters
        srs : 'EPSG:3857',
        visibility: true, //enabled/disabled layer and also to the wms request
        format: "image/png", // ["image/png", "image/gif"]
        transparent: 'TRUE', //[TRUE, FALSE]
        opacity: 1,
        // Other Options
        name: '',
        tiitle: '',
        abstract: '',
        srs: '',
        LatLonBoundingBox: '',
        BoundingBox: '',
        Style: {
            name: '',
            title: '',
            abstract: '',
            legendurl: {
                format: '',
                onlineresource: '' //differenct xml attributes (how to store it?
            }
        },
        KeywordList: [],

        layertitle: '',
        enablegfi: true,
        layertype: 'WMS', //['WMS', 'JOIN']
        openlegend: false,

        // JOIN default options
        switchjointype: false,

        // language
        lang: 'en' //ISO2

    },

    leafletLayer: '',

    initialize: function(layer, fenixmap, options) { // (HTMLElement or String, Object)
        this.layer = $.extend(true, {}, this.layer, layer);

        //console.log(layer);
        if ( options) this.options = options;

        this.id = FM.Util.randomID();

        if ( layer.joindata ) layer.defaultdata = layer.joindata;
        if ( fenixmap ) this._fenixmap = fenixmap;
    },

    createLayerWMS: function() {

        var wmsParameters = this._getWMSParameters();
        if ( this.leafletLayer ) {
            this.leafletLayer.setParams(wmsParameters);
        }
        else {
            console.log(this.options);
            wmsParameters = (this.options)? $.extend(true, {}, this.options, wmsParameters): wmsParameters;
            console.log(wmsParameters);
            this.leafletLayer = new L.TileLayer.WMS( this.layer.urlWMS, wmsParameters );
        }
        return this.leafletLayer;
    },

    createLayerWMSSLD: function() {
        var wmsParameters = this._getWMSParameters();
        if ( this.leafletLayer ) {
            this.leafletLayer.setParams(wmsParameters);
        }
        else {
            this.leafletLayer = new L.TileLayer.WMS( this.layer.urlWMS, wmsParameters );
        }
        return this.leafletLayer;
    },

    /** TODO: make also the other parameters dynamic **/
    _getWMSParameters:function() {
        var options = {};

        options.id = this.id;

        // can be used layers (default WMS parameter or layername)
        options.layers = ( this.layer.name )?  this.layer.name: this.layer.layers;
        options.format= this.layer.format;
        options.transparent = this.layer.transparent.toUpperCase();
        options.visibility = this.layer.visibility;
        options.opacity = this.layer.opacity;

        /** TODO: handle additional parameters that are not default ones **/
        /** i.e. http://nyc.freemap.in/cgi-bin/mapserv?MAP=/www/freemap.in/nyc/map/basemap.map **/

        // check whether styles or style is set (styles is the default URL parameter)
        options.styles=this.layer.styles;
        if ( this.layer.style ) options.styles = this.layer.style;
        if ( this.layer.sldurl ) options.sld = this.layer.sldurl;
        if ( this.layer.cql_filter ) options.cql_filter = this.layer.cql_filter;
        if ( this.layer.sld_body ) options.sld_body = this.layer.sld_body;
        this.layer.layers = ( this.layer.layername )?  this.layer.layername: this.layer.layers;

        return options;
    },

    // this is just to use with the WMS Layers // check layer type
    redraw: function(fenixmap) {
        var l = this;
        if (l.layer.layertype ) {
            switch(l.layer.layertype ) {
                case 'JOIN':
                    if (l.layer.jointype.toLocaleUpperCase() == 'SHADED') {
                        if ( fenixmap ) fenixmap.addLayer(this);
                        else if ( this._fenixmap ) this._fenixmap.addLayer(this);
                    }
                    else if (l.layer.jointype.toLocaleUpperCase() == 'POINT')
                        console.log('TODO: handle redraw point');
                    break;
                case 'WMS':
                    this.createLayerWMS();
                    this.leafletLayer.redraw();
                    break;
                default:
                    this.createLayerWMS();
                    this.leafletLayer.redraw();
                    break;
            }
        }
    },

    /** TOODO: remove layer also from the layers list **/
    removeLayer: function(fenixmap) {
        /** TODO: remove it from the list **/
        if ( fenixmap )
            fenixmap.removeLayer(this);
        else if ( this._fenixmap)
            this._fenixmap.removeLayer(this);
    },

    /** shortcut **/
    addPointLayer: function(fenixmap) {
        if ( fenixmap )
            fenixmap.addPointLayer(this);
        else if ( this._fenixmap)
            this._fenixmap.addPointLayer(this);
    },

    addLayerWMS: function(fenixmap) {
        if ( fenixmap )
            fenixmap.addLayerWMS(this);
        else if ( this._fenixmap)
            this._fenixmap.addLayerWMS(this);
    },

    addLayer: function(fenixmap) {
        if ( fenixmap )
            fenixmap.addLayer(this);
        else if ( this._fenixmap)
            this._fenixmap.addLayer(this);
    },

    addShadedLayer: function(fenixmap) {
        if ( fenixmap )
            fenixmap.addShadedLayer(this);
        else if ( this._fenixmap)
            this._fenixmap.addShadedLayer(this);
    },

    createShadedLayerRequestCached:function (fenixmap) {
        if ( fenixmap ) {
            fenixmap.controller.layerAdded(this);
            fenixmap.createShadedLayerRequestCached(this);
        }
        else if ( this._fenixmap) {
            this._fenixmap.controller.layerAdded(this);
            this._fenixmap.createShadedLayerRequestCached(this);
        }
    },

    /**
     * this method just request the layer, so it's been cached
     *
     * @param l
     * @param isReload
     */
    createShadeLayerRequestCached: function(fenixmap, loadLayer) {

      if ( this._fenixmap )
            fenixmap = this._fenixmap;

      var l = this;
        var r = new RequestHandler();
        var url = 'http://'+ FM.CONFIG.BASEURL_MAPS + FM.CONFIG.MAP_SERVICE_SHADED;
        r.open('POST', url);
        r.setContentType('application/x-www-form-urlencoded');
        r.onload(function () {
            var response = this.responseText;
            if (typeof response == 'string') {
                response = $.parseJSON(response);
            }
            l.layer.sldurl = response.sldurl;
            l.layer.urlWMS = response.geoserverwms;
            l.layer.legendHTML = response.legendHTML;
            l.createLayerWMSSLD();

            if ( loadLayer ) {
                fenixmap.controller.layerAdded(l);
                fenixmap._loadLayer(l, false)
            }
        });
        r.send(FM.Util.parseLayerRequest(l.layer));
    }

});

FM.layer = function (layer, map, options) {
    return new FM.Layer(layer, map, options);
};


