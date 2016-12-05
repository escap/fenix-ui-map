FM.Map = FM.Class.extend({

    id: '',
    suffix: '',
    mapContainerID: '',
    tilePaneID: '',

    map: '',        //this is the map obj of Leaflet/Openlayers
    controller: '', //controller of the map
    plugins: {},    //indexed plugins istances

    options: {
        url: {},    	
        lang: 'EN',
        guiController : {
            container: null,
            overlay: true,
            baselayer: true,
            wmsLoader: true,
            enablegfi: true, //this is used to switch off events like on drawing (when is need to stop the events on GFI)
            layersthumbs: false
        },
        plugins: {
			fullscreen: true,  //true or {id: 'divID'} or false
        	zoomcontrol: true,
            scalecontrol: true,
            legendcontrol: true,
        	disclaimerfao: true
        },
        baselayers: null,
        boundaries: null,
        labels: null,
        //http://goo.gl/MUIt8Z
        legendOptions: null,
        zoomToCountry: null,
        highlightCountry: null,
        style: {
            color: '#337ab7',
            opacity: 0.8,
            weight: 2,
            fillColor: '#337ab7',
            fillOpacity: 0.1
        }
    },
    mapOptions: {
		zoomControl: false,
		attributionControl: false,
        center: [0, 0],
        lat: 0,
        lng: 0,
        zoom: 1
    },

    initialize: function(id, options, mapOptions) { // (HTMLElement or String, Object)

        var self = this;

        // merging object with a deep copy
        this.options =  $.extend(true, {}, this.options, options);
        this.mapOptions = $.extend(true, {}, this.mapOptions, mapOptions);

        // extent if exist FM.CONFIG
        if (FMCONFIG)
            this.options.url = $.extend(true, {}, FMCONFIG, options && options.url );

        // setting up the lang properties
        FM.initializeLangProperties(this.options.lang);

        var suffix = FM.Util.randomID();
        var mapContainerID =  suffix + '-container-map';
        var mapID =  suffix + '-map';

        var mapDIV = "<div class='fm-map-box fm-box' id='"+ mapContainerID +"'><div>";
        
        $(id).length > 0? $(id).append(mapDIV): $("#" + id).append(mapDIV);

        this.id = mapID;

        this.$map = $("#" + mapContainerID);

        this.$map.append("<div style='width:100%; height: 100%;' id='"+ mapID +"'><div>");

        this.map = new L.Map(this.id, this.mapOptions);

        this.mapContainerID = mapContainerID;
        this.suffix = suffix;

        // setting the TilePaneID   TODO: set IDs to all the DIVs?
        this.setTilePaneID();
   
        this.controller = new FM.mapController(suffix, this, this.map,  this.options.guiController);

        this.controller.initializeGUI();

        this.map._fenixMap = this;

        if(this.options.guiController.enablegfi)
            this.map.on('click', this.getFeatureInfo, this);

        var swipeControl = (function() {
            var control = new L.Control();
            control.onAdd = function(map) {
                return $("<div  class='fm-swipe' id='"+ suffix +"-swipe'><div style='display:none' class='fm-swipe-handle'id='"+ suffix +"-handle'>&nbsp</div></div>")[0];
            };
            return control;
        }()).addTo(this.map);

        // join popup holder
        this.$map.append(FM.Util.replaceAll(FM.guiController.popUpJoinPoint, 'REPLACE', suffix));
     
    },

//TODO
    initStyles: function() {

        $('<h1>PALETTE<h1>').addClass('color-main-light-10').prependTo(this.$map);

        function getStyle(className) {
            var ret = {},
                len = document.styleSheets.length-1,
                classes = document.styleSheets[len].rules || document.styleSheets[len].cssRules;
            
            for (var x = 0; x < classes.length; x++) {
                
                console.log(classes[x].selectorText)

                if (classes[x].selectorText.indexOf(className)>-1 ) {

                    console.log(classes[x].selectorText)

                    if(!ret[className])
                        ret[className]=[];
                    
                    ret[className].push(classes[x].cssText ? classes[x].cssText : classes[x].style.cssText);
                }
            }
            return ret;
        }

        this.fenixStyles = getStyle('.color-main');

        console.log('FMMAP fenixStyles',fenixStyles);//*/
    },
    
    createMap: function(lat, lng, zoom) {
        this.mapOptions.lat = lat || this.mapOptions.lat;
        this.mapOptions.lng = lng || this.mapOptions.lng;
        this.mapOptions.zoom = zoom || this.mapOptions.zoom;
        this.map.setView(new L.LatLng(this.mapOptions.lat, this.mapOptions.lng), this.mapOptions.zoom);
        
        this.initializePlugins();

        if(this.options.baselayers === null) {
            this.options.baselayers = {
                'OSM': FM.TILELAYER['OSM'],
                'OSM_GRAYSCALE': FM.TILELAYER['OSM_GRAYSCALE'],
                'ESRI_WORLDSTREETMAP': FM.TILELAYER['ESRI_WORLDSTREETMAP'],
                'ESRI_WORLDTERRAINBASE': FM.TILELAYER['ESRI_WORLDTERRAINBASE']
            }
        }

        for(var i in this.options.baselayers) {
            //this.addTileLayer(FM.TileLayer.createBaseLayer('OSM', 'EN'), true);
            var layeropts = this.options.baselayers[i];
            // this is replicated because in wms it's used "layers" instead of layername
            
            var l = new FM.layer({
                layername: i,
                layertype: 'TILE',
                layertitle: layeropts['title_'+ this.options.lang.toLowerCase()],
                lang: this.options.lang.toUpperCase()
            });
            var lurl = layeropts.url;
            delete layeropts.url;
            l.leafletLayer = new L.TileLayer(lurl, layeropts);

            this.addTileLayer(l, true);
        }

        if(this.options.url.LAYER_BOUNDARIES) {
            this.layerBoundaries = new FM.layer({
                layers: this.options.url.LAYER_BOUNDARIES,
                layertitle: 'Country Boundaries',
                urlWMS: this.options.url.DEFAULT_WMS_SERVER,
                opacity: '0.9',
                lang: 'en',
                hideLayerInControllerList: true
            });
            //this.addLayer(this.layerBoundaries)
        }

        if(this.options.url.LAYER_LABELS) {        
            this.layerLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
                subdomains: 'abcd',
                maxZoom: 19,
                opacity: 0.8
            });
        }

        this.highlightLayer = L.geoJson(null, {
            style: function(feature) {
                return self.options.style;
            }
        }).addTo(this.map);

        if(this.options.zoomToCountry && this.options.zoomToCountry.length > 0)
        {
            if(typeof this.options.zoomToCountry[0] === 'string') {
                this.zoomToCountry('iso3', this.options.zoomToCountry);
            }

            else if(typeof this.options.zoomToCountry[0] === 'number') {
                this.zoomToCountry('adm0_code', this.options.zoomToCountry);
            }
        }

        if(this.options.highlightCountry) {
            this.highlightCountry('iso3_code', this.options.highlightCountry);
        }


        if(this.options.boundaries) {
            this.boundariesShow();
        }
        
        if(this.options.labels) {
            this.labelsShow();  
        }

        return this;
    },

    destroyMap: function() {
        //TODO unbind events
        this.map.remove();
        this.$map.empty();
    },

    /** TODO: make it nicer **/
    setTilePaneID: function() {
        this.tilePaneID = this.suffix + '-leaflet-tile-pane';
        var childNodes = document.getElementById(this.id).childNodes;
        var childNodes2 = childNodes[1].childNodes;
        $(childNodes2[0]).attr("id", this.tilePaneID);
    },

    addTileLayer: function(l, isBaseLayer) {
        if ( isBaseLayer )
            this.controller.addBaseLayer(l);
        else  {
           this.controller.layerAdded(l);
           this.map.addLayer(l.leafletLayer);
        }
        this.controller.setZIndex(l);
        return this;
    },

    /** TODO: make it nicer **/
    addLayer:function (l) {
        l._fenixmap = this;

        if(this.options.legendOptions)
            l.layer.legendOptions = $.extend(l.layer.legendOptions, this.options.legendOptions);
        
        if (l.layer.layertype ) {
            switch(l.layer.layertype ) {
                case 'JOIN':
                    if (l.layer.jointype.toLocaleUpperCase() == 'SHADED')
                        this.addShadedLayer(l);
                    else if (l.layer.jointype.toLocaleUpperCase() == 'POINT')
                        this.addPointLayer(l);
                break;
                case 'WMS': this.addLayerWMS(l); break;
                default: this.addLayerWMS(l); break;
            }
        }
        else
           this.addLayerWMS(l);
        return this;
    },

    removeLayer:function(l) {
        this.controller.removeLayer(l);
        return this;
    },

    addLayerWMS: function(l) {
        this.controller.layerAdded(l);
        this.map.addLayer(l.createLayerWMS());
        this.controller.setZIndex(l);

        this._openlegend(l, false);

        // check layer visibility
        this.controller.showHide(l.id, false);
        return this;
    },

    addShadedLayer: function(l) {
        // adding the layer to the controller
        if ( !l.layerAdded) this.controller.layerAdded(l);
        this.createShadeLayerRequest(l, l.isadded);
    },

    createShadeLayerRequest: function(l, isReload) {
        // hiding the legend TODO: make a test if controller is currently used?
        if ( !isReload ) {
            $('#'+ l.id + '-controller-item-getlegend').css('display', 'inline-block');
            $('#'+ l.id + '-controller-item-opacity').css('display', 'block');
        }
        var _this = this;
        //var url = FMCONFIG.BASEURL_MAPS + FMCONFIG.MAP_SERVICE_SHADED;
        var url = this.options.url.MAP_SERVICE_SHADED;
        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(l.layer),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function(response) {
                _this._createShadeLayer(l, response, isReload);
            }
        });
    },

    _createShadeLayer: function(l, response, isReload){
        if (typeof response == 'string')
            response = $.parseJSON(response);
        //l.layer.sldurl = response.sldurl;
        //l.layer.urlWMS = response.geoserverwms;
        l.layer.sldurl = response.url;
        // TODO: check urlWMS how to set it
        l.layer.urlWMS = this.options.url.DEFAULT_WMS_SERVER;
        if (response.geoserverwms)
            l.layer.urlWMS = response.geoserverwms

        //l.layer.urlWMS = "http://localhost:9090/geoserver/wms/";
        l.layer.legendHTML = response.legendHTML;
        l.createLayerWMSSLD();

        this._loadLayer(l, isReload)
    },

    _loadLayer:function(l, isReload) {
        var isReload = ( isReload == null || !isReload )? false: true;
        // TODO: if ( this.map.hasLayer(l.leafletLayer)) could be an alternative to the isReloaded check?
        if ( !isReload ) {
            this.map.addLayer(l.leafletLayer);
            this.controller.setZIndex(l);
            // this is a flag specifically for the JOIN Layers (they need to be registered as added once they are loaded )
            l.isadded = true;
        }
        else l.leafletLayer.redraw();

        // open legend
        this._openlegend(l, isReload);

        // check layer visibility
        this.controller.showHide(l.id, isReload)
    },

    reAddLayer:function(l) {
        this.map.addLayer(l.leafletLayer);
        this.controller.setZIndex(l);
        // check layer visibility
        //this.controller.showHide(l.id)
    },

    _openlegend: function(l, isReload) {
        try {
            if (l.layer.openlegend) {
                FM.Legend.getLegend(l, l.id + '-controller-item-getlegend', isReload);
            }
        }catch (e) {
            console.war("_openlegend error:" + e);
        }
    },

    addPointLayer: function(l) {
        // adding the layer to the controller
        this.controller.layerAdded(l);
        this.createPointLayerRequest(l);
    },

    createPointLayerRequest: function(l) {
        // hiding the legend
        $('#'+ l.id + '-controller-item-getlegend').css('display', 'none');
        $('#'+ l.id + '-controller-item-getlegend-holder').slideUp("slow");
        $('#'+ l.id + '-controller-item-opacity').css('display', 'none');
        var _this = this;
        var url = this.options.url.MAP_SERVICE_SHADED;
        var r = new RequestHandler();
        r.open('POST', url);
        r.setContentType('application/x-www-form-urlencoded');
        r.request.onload= function () {
            // TODO: make a specific function to clear the old layer
            // cleaning the pointLayers (if they were created)
            _this._createPointLayer(l, this.responseText );
        };
        r.send(FM.Util.parseLayerRequest(l.layer));
        r.request.onerror = function () {
            // TODO: make a specific function to clear the old layer
            // cleaning the pointLayers (if they were created)
            if ( l.layer.pointsLayers ) {
                for(var i=0; i < l.layer.pointsLayers.length; i++) {
                    this.map.removeLayer(l.layer.pointsLayers[i]);
                }
            }
        };
    },

    _createPointLayer: function(l, response) {
        if (typeof response == 'string') response = $.parseJSON(response);
        l.layer.sldurl = response.sldurl;
        l.layer.urlWMS = response.geoserverwms;
        l.layer.legendHTML = response.legendHTML;
        l.layer.pointsJSON = response.pointsJSON;
        this._refreshPointLayer(l);
    },

    _refreshPointLayer:function (l) {
        // cleaning the pointLayers (if they were created)
        if ( l.layer.pointsLayers ) {
            for(var i=0; i < l.layer.pointsLayers.length; i++) {
                this.map.removeLayer(l.layer.pointsLayers[i]);
            }
        }
        if (typeof l.layer.pointsJSON == 'string') l.layer.pointsJSON = $.parseJSON(l.layer.pointsJSON);

        var _this = this;
        l.layer.pointsLayers = [];
        for(var i=0; i < l.layer.pointsJSON.length; i++) {
            var latlon = new L.LatLng(l.layer.pointsJSON[i].lat, l.layer.pointsJSON[i].lon);
            // var latlon = new L.LatLng(7.09, -67.58);
           // var properties =  { color: 'red', fillColor: '#f03', fillOpacity: 0.4, html: '<b>Venezuela (Bolivarian Republic of)</b><br>15,364,178.947 (Head)' };
            var properties =  l.layer.pointsJSON[i].properties;

            // setting the measurement unit
            l.layer.pointsJSON[i].properties.measurementunit = '';
            if ( l.layer.measurementuni != null )
                l.layer.pointsJSON[i].properties.measurementunit = l.layer.measurementunit;

            if (l.layer.pointColor != null) properties.color = l.layer.pointColor;
            if (l.layer.pointFillColor != null) properties.fillColor = l.layer.pointFillColor;
            if (l.layer.pointFillOpacity != null) properties.fillOpacity = l.layer.pointFillOpacity;

            var marker = new L.CircleMarker(latlon, properties).addTo(this.map);

            marker.setRadius(l.layer.pointsJSON[i].radius);
            marker.bindPopup(properties.title + ' - ' + properties.value );
            marker.on('mouseover', function () {
                $("#" + _this.suffix +"-popup-join-point-holder").show();
                $("#" + _this.suffix +"-popup-join-point-text").empty();
                $("#" + _this.suffix +"-popup-join-point-value").empty();
                $("#" + _this.suffix +"-popup-join-point-text").append( this.options.title );
                // TODO: N.B. l.layer.measurementunit is used **/
                $("#" + _this.suffix +"-popup-join-point-value").append(this.options.value + '  <i>' + l.layer.measurementunit + '</i>');
            });
            marker.on('mouseout', function () {
                $("#" + _this.suffix +"-popup-join-point-holder").hide();
            });
            l.layer.pointsLayers.push(marker);
        }
    },

    // syncronize the maps on movement
    syncOnMove: function (mapToSync) {
        FM.MapUtils.syncMapsOnMove(this.map, mapToSync);
    },

    // TODO: add other parameters in the request: I.E.
    getFeatureInfo: function(e, l) {

        // var fenixMap = e.target._fenixMap;
        var fenixMap = this;
        // get the layer that is been passed or the one that is selected in the Controller
        var l = (l) ? l: fenixMap.controller.selectedLayer;
        if ( l ) {
            if (l.layer.layertype != null && l.layer.layertype == 'JOIN') {
                FM.SpatialQuery.getFeatureInfoJoin(l, e.layerPoint, e.latlng, fenixMap);
            }
            else {
               FM.SpatialQuery.getFeatureInfoStandard(l, e.layerPoint, e.latlng, fenixMap);
            }
        }
    },

    invalidateSize: function() {
      this.map.invalidateSize();
    },

    // interface plugins
    initializePlugins: function() {
        if ( this.options.plugins != null ) {
            var _this = this;
            $.each(this.options.plugins, function(key, value) {
                var pname = key.toLowerCase(),
                	invoke = '_add' + pname;

                if (FM.Plugins[invoke])
                	_this.plugins[pname] = FM.Plugins[invoke](_this, value);
            });
        }
    },

    /** Fenix Map  Exporting/Importing functionalities **/
    cloneMap: function(id) {
        var exportedMap = this.exportMap();
        //JSON.stringify(exportedMap.layers, null, '\t');
        var v = JSON.stringify(exportedMap.layers, function(key, val) {
            if (typeof val === 'function') {
                return val + ''; // implicitly `toString` it
            }
            return val;
        });
        var clonedMap = new FM.Map(id, exportedMap.map.options, exportedMap.map.mapOptions);
        clonedMap.createMap();
        clonedMap.createMapFromJSON(exportedMap);
        return clonedMap;
    },

    createMapFromJSON:function(json) {
        /** TODO: add baselayers handling **/
        this.loadOverlays(json.layers.overlays);
    },

    /** functionality to export the map definition **/
    exportMap:function() {
       var o = {};
       o.map   = this._getMapOptions();
       o.layers = this._getMapLayers();
       return o;
    },

    exportMapToJSONFile:function() {
        var json = this.exportMap();
        var id = FM.Util.randomID();
        var uriContent = "data:application/octet-stream;filename=mapview-"+ id +".fnx," + encodeURIComponent(JSON.stringify(json));
        var _window = window.open(uriContent, "mapview-"+ id +".fnx");
        _window.focus();
    },

    _getMapOptions:function() {
        return {
            options: $.extend(true, {}, this.options),
            plugins: $.extend(true, {}, this.plugins),
            mapOptions: $.extend(true, _getCurrentMapOptions, this.mapOptions)            
        };
    },

    _getMapLayers:function() {
        return {
            overlays: this.controller.exportOverlays()
        };
    },

    loadOverlays: function(overlays) {
        for(var i =0; i < overlays.length; i++) {
            this.addLayer( new FM.layer(overlays[i]) );
        }
    },

    zoomTo: function(layer, column, codes) {
        FM.MapUtils.zoomTo(this, layer, column, codes)
    },

    zoomToCountry: function(column, codes) {
        FM.MapUtils.zoomToCountry(this, column, codes)
    },

    getSLDfromCSS: function(layername, css) {
        FM.MapUtils.getSLDfromCSS(layername, css, this.options.url.CSS_TO_SLD);
    },

    labelsShow: function() {
        this.layerLabels.addTo(this.map).bringToFront();
    },

    labelsHide: function() {
        this.map.removeLayer(this.layerLabels);
    },

    boundariesShow: function() {
        this.addLayer( this.layerBoundaries );
        //TODO .bringToFront()
    },

    boundariesHide: function() {
        this.removeLayer( this.layerBoundaries );
    },

    highlightCountry: function(codif, codes) {

        codif = codif || 'iso3_code';
        //codif = codif || 'adm0_code';

        var self = this;

        var rootUrl = this.options.url.DEFAULT_WMS_SERVER+"/ows";

        self.highlightLayer.clearLayers();

        for(var c in codes) {

            var defaultParameters = {
                service: 'WFS',
                version: '1.0.0',
                request: 'GetFeature',
                typeName: 'fenix:gaul0_bounds',
                maxFeatures: 50,
                outputFormat: 'text/javascript',
                format_options: 'callback: getJson',
                viewparams: codif+':'+codes[c]
            };

            var parameters = L.Util.extend(defaultParameters),
                url = rootUrl + L.Util.getParamString(parameters);

            $.ajax({
                url: url,
                dataType: 'jsonp',
                jsonpCallback: 'getJson',
                success: function(json) {
                    //console.log('JSONP',url, json)
                    self.highlightLayer.addData(json);
                    self.highlightLayer.bringToFront();
                }
            });
        }
    }
});

FM.map = function (id, options, mapOptions) {
    return new FM.Map(id, options, mapOptions);
};
