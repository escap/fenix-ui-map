FM.Map = FM.Class.extend({

    id: '',
    suffix: '',
    mapContainerID: '',
    tilePaneID: '',

    map: '', // this is the map obj of Leaflet/Openlayers
    controller : '', // controller of the map

    mapOptions: {
        center: [0, 0],
        lat: 0,
        lng: 0,
        zoom: 1
    },
    options: {
        guiController : {
            enablegfi: true // this is used to switch off events like on drawing (when is need to stop the events on GFI)
        },
        gui : {
            fullscreen: true,
            fullscreenID: '' //TODO: pass it or
            // TODO: pass fullscreen content ID on a fullscreen object instead of like that
        },
        usedefaultbaselayers: true,
        lang: 'EN'
    },

    initialize: function(id, options, mapOptions) { // (HTMLElement or String, Object)
        // merging object with a deep copy
        this.options =  $.extend(true, {}, this.options, options);
        this.mapOptions = $.extend(true, {}, this.mapOptions, mapOptions);

        // setting up the lang properties
        FM.initializeLangProperties(this.options.lang);

        var suffix = FM.Util.randomID();
        var mapContainerID =  suffix + '-container-map';
        var mapID =  suffix + '-map';

        $("#" + id).append("<div class='fm-map-box fm-box' id='"+ mapContainerID +"'><div>");
        $("#" + mapContainerID).append("<div style='width:100%; height: 100%;' id='"+ mapID +"'><div>");

        this.id = mapID;
        this.mapContainerID = mapContainerID;
        this.suffix = suffix;

        // fullscreen
        this.options.gui.fullscreenID = ( this.options.gui.fullscreenID != '')? this.options.gui.fullscreenID: this.mapContainerID;
        this.map = new L.Map(this.id, this.mapOptions);

        // setting the TilePaneID   TODO: set IDs to all the DIVs?
        this.setTilePaneID();

        // TODO: put in options the fact to add a controller or not
        $("#" + mapContainerID).append("<div style='width:350px;' id='"+ suffix +"-controller'><div>");

        this.controller = new FM.mapController(suffix, this, this.map,  this.options.guiController);
        this.controller.initializeGUI();

        var _this = this;
        this.map._fenixMap = this;
        // TODO: boolean to see if GFI is allowed
        this.map.on('click', function (e) {
            if ( _this.options.guiController.enablegfi ) _this.getFeatureInfo(e);
        });

        // popup hovervalue
        $("#" + mapContainerID).append("<div id='"+ suffix +"-popup'><div>");

        // swipe id (TODO: replace with the new swipe)
        $("#" + mapContainerID).append("<div  class='fm-swipe' id='"+ suffix +"-swipe'><div style='display:none' class='fm-swipe-handle'id='"+ suffix +"-handle'>&nbsp</div></div>");

        // join popup holder
        $("#" + mapContainerID).append(FM.replaceAll(FM.guiController.popUpJoinPoint, 'REPLACE', suffix));

        /**  listener test
        this.map.on('data:loaded', function (e) {
            // Fit bounds after loading
        }, this);

        this.map.fire('data:loaded', {layer: 'test'});
        **/

    },

    createMap: function(lat, lng, zoom){
        if ( lat )  this.mapOptions.lat = lat;
        if ( lng )   this.mapOptions.lng = lng;
        if ( zoom ) this.mapOptions.zoom = zoom;
        this.map.setView(new L.LatLng(this.mapOptions.lat, this.mapOptions.lng), this.mapOptions.zoom);
        L.control.scale('bottomright').addTo(this.map);
        this.initializePlugins();
        this.initializeMapGUI();
        if ( this.options.usedefaultbaselayers ) this._addDefaultBaseLayers();

        $("#" + this.id + " .leaflet-control-zoom-in").html("")
        $("#" + this.id + " .leaflet-control-zoom-out").html("")
    },

    /** Default Baselayers loaded at startup if they are not override **/
    _addDefaultBaseLayers: function() {
        this.addTileLayer(FM.TileLayer.createBaseLayer('OSM', 'EN'), true);
        this.addTileLayer(FM.TileLayer.createBaseLayer('OSM_GRAYSCALE', 'EN'), true);
        this.addTileLayer(FM.TileLayer.createBaseLayer('ESRI_WORLDSTREETMAP', 'EN'), true);
        this.addTileLayer(FM.TileLayer.createBaseLayer('ESRI_WORLDTERRAINBASE', 'EN'), true);
    },

    /** TODO: make it nicer **/
    setTilePaneID: function() {
        this.tilePaneID = this.suffix + '-leaflet-tile-pane';
        var childNodes = document.getElementById(this.id).childNodes;
        var childNodes2 = childNodes[1].childNodes;
        $(childNodes2[0]).attr("id", this.tilePaneID);
    },

    addTileLayer: function(l, isBaseLayer) {
        if ( isBaseLayer ) this.controller.addBaseLayer(l);
        else  {
           this.controller.layerAdded(l);
           this.map.addLayer(l.leafletLayer);
        }
        this.controller.setZIndex(l);
    },

    /** TODO: make it nicer **/
    addLayer:function (l) {
        if (l.layer.layertype ) {
           switch(l.layer.layertype ) {
               case 'JOIN':
                   if (l.layer.jointype.toLocaleUpperCase() == 'SHADED') this.addShadedLayer(l);
                   else if (l.layer.jointype.toLocaleUpperCase() == 'POINT') this.addPointLayer(l);
               break;
               case 'WMS': this.addLayerWMS(l); break;
               default: this.addLayerWMS(l); break;
           }
        }
        else {
           /* DEFAULT request**/
           this.addLayerWMS(l);
        }
    },

    removeLayer:function(l) {
        this.controller.removeLayer(l);
    },

    addLayerWMS: function(l) {
        this.controller.layerAdded(l);
        this.map.addLayer(l.createLayerWMS());
        this.controller.setZIndex(l);

        this._openlegend(l, false);

        // check layer visibility
        this.controller.showHide(l.id, false)
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
        var url = FMCONFIG.BASEURL_MAPS + FMCONFIG.MAP_SERVICE_SHADED;
        var r = new RequestHandler();
        r.open('POST', url);
        r.setContentType('application/x-www-form-urlencoded');
        r.request.onload= function () {
            _this._createShadeLayer(l, this.responseText, isReload);
        };
        r.send(FM.Util.parseLayerRequest(l.layer));
    },

    _createShadeLayer: function(l, response, isReload){
        if (typeof response == 'string')
            response = $.parseJSON(response);

        l.layer.sldurl = response.sldurl;
        l.layer.urlWMS = response.geoserverwms;
        l.layer.legendHTML = response.legendHTML;
        l.createLayerWMSSLD();

        this._loadLayer(l, isReload)
    },

    /** TODO: mix with the other request to do one that works for both situation */
    createShadedLayerRequestCached: function(l, isReload) {
        if ( l.layer.sldurl )
            this._loadLayer(l, isReload)
        else {
            this.createShadeLayerRequest(l, isReload)
        }
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
        if (l.layer.openlegend ) {
            FM.LayerLegend.getLegend(l, l.id + '-controller-item-getlegend', isReload)
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
        var url = FMCONFIG.BASEURL_MAPS + FMCONFIG.MAP_SERVICE_SHADED;
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

    addGeoJSON: function(l) {
        FMGeoJSON.createGeoJSONLayer(l);
    },

    // syncronize the maps on movement
    syncOnMove: function (mapToSync) {
        FM.MapUtils.syncMapsOnMove(this.map, mapToSync);
    },

    // TODO: add other parameters in the request: I.E.
    getFeatureInfo: function(e, l) {
        // var fenixMap = e.target._fenixMap;
        var fenixMap = this;
//        this.addClickEffect(e.latlng, fenixMap.map);
        // get the layer that is been passed or the one that is selected in the Controller
        var l = (l) ? l: fenixMap.controller.selectedLayer;
        if ( l ) {
            if (l.layer.layertype != null && l.layer.layertype == 'JOIN') {
                FM.SpatialQuery.getFeatureInfoJoin(l, e.layerPoint, e.latlng, fenixMap.map);
            }
            else {
               FM.SpatialQuery.getFeatureInfoStandard(l, e.layerPoint, e.latlng, fenixMap.map);
            }
        }
    },

    addClickEffect: function(latlng, map) {
        //console.log(latlng);

//        <div id="reveal-cards"><div class="cards-card" role="navigation" jsaction="cards.onCardClick;focus:cards.onCardFocus;keypress:cards.onCardKeypress" tabindex="151" style="top: 62px; height: 64px; opacity: 1; clip: rect(-10px, 428px, 74px, -10px);"><div class="cards-reveal" jstcache="598"><div class="cards-reveal-hovercontainer" jsaction="mouseover:reveal.showMarker;mouseout:reveal.hideMarker"><span jsl="$x 1;" class="cards-reveal-left-container cards-reveal-show-lat-lng"><div jsl="$x 2;" class="cards-reveal-title cards-strong" jsaction="reveal.spotlightAddress"><div class="cards-reveal-address"><div jsl="$x 3;" jsinstance="0"><div jsl="$x 4;" class="cards-reveal-address-line cards-text-truncate">Viale Marco Polo, 30-36</div></div><div jsl="$x 3;" jsinstance="*1"><div jsl="$x 4;" class="cards-reveal-address-line cards-text-truncate cards-reveal-light">Roma</div></div></div></div><div jsl="$x 5;" class="cards-reveal-lat-lng cards-light" jsaction="reveal.latLng;mouseover:reveal.latLng;mouseout:reveal.latLng">41.874724, 12.485098</div></span><span class="cards-reveal-close close-button" jsaction="reveal.close"></span><span style="display:none" jsl="$x 6;" class="cards-reveal-divider"></span><span jsl="$x 7;" style="background-image:url(//geo0.ggpht.com/cbk?cb_client=maps_sv.tactile&amp;output=thumbnail&amp;thumb=2&amp;panoid=el-lL4erntdwCyFVwfDcBQ&amp;w=88&amp;h=60&amp;yaw=222.85810224279018&amp;pitch=0&amp;ll=41.874969,12.485325)" class="cards-reveal-image" jsaction="reveal.enterStreetView" vet="5614" ved="0CAYQzCcoADAA" jstrack="jxGQU8yaJIeFyAOCnoC4DQ"><span jsl="$x 8;" class="cards-reveal-caption">Street View</span><span class="cards-reveal-gradient"></span></span><span jsl="$x 9;" class="cards-reveal-directions" jsaction="reveal.getDirections" vet="6328"><span class="cards-reveal-directions-icon"></span></span><span jsl="$x 10;" class="cards-reveal-divider"></span><div style="clear:both"></div></div></div></div></div>

        var html = '<div id="reveal-cards">' +
            '<div class="cards-card">' +
            '<div style="clear:both"></div></div>';
        L.marker([
            latlng.lat,
            latlng.lng
        ], {
            icon: L.divIcon({
                // Specify a class name we can refer to in CSS.
                //className: html,
                // Define what HTML goes in each marker.
                html: html,
                // Set a markers width and height.
                iconSize: [40, 40]
            })
        }).addTo(map);
    },

    /** TODO: codetype, code **/
    zoomTo: function(boundary, code, srs) {
        FM.LayerUtils.zoomToBoundary(this.map, boundary, code, srs);
    },

    zoomTo: function(boundary, code) {
        FM.LayerUtils.zoomToBoundary(this.map, boundary, code, 'EPSG:3827');
    },

    invalidateSize: function() {
      this.map.invalidateSize();
    },

    // interface GUI
    initializeMapGUI:function() {
        if ( this.options.gui != null ) {
            var _this = this;
            $.each(this.options.gui,
                function(key, value) {
                  var invoke = '_add' + key.toLowerCase();
                 try {
                     if ( FM.Plugins[invoke]) FM.Plugins[invoke](_this, value);
                 }catch (e){
                     throw new Error("Plugin: " + invoke + " doesn't exist")
                 }
            });
        }
    },


    // interface plugins
    initializePlugins:function() {
        if ( this.options.plugins != null ) {
            var _this = this;
            $.each(this.options.plugins, function(key, value) {
                 var invoke = '_add' + key.toLowerCase();
                FM.loadModuleLibs(
                    key.toLowerCase(),
                    //function() { _this[invoke](_this, value) }
                    function() {
                        FM.Plugins[invoke](_this, value)
                    }
                );
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
        var o = {
            options: {},
            mapOptions: {}
        };
        o.options    =  $.extend(true, {}, this.options);
        o.mapOptions =  $.extend(true, {}, this.mapOptions);
        // get current lan, lon, zoom
        this._getCurrentMapOptions(o.mapOptions)
        return o;
    },

    _getCurrentMapOptions: function(mapOptions) {
        // lat
        mapOptions.lat = this.map.getCenter().lat;
        // lng
        mapOptions.lng = this.map.getCenter().lng;
        // zoom
        mapOptions.zoom = this.map.getZoom();
    },

    _getMapLayers:function() {
        var o = {}
        o.overlays = this.controller.exportOverlays();
        return o
    },

    loadOverlays: function(overlays) {
        for(var i =0; i < overlays.length; i++) {
            // TODO: add a switch based on the layertype? i.e. what for markers
            var l = new FM.layer(overlays[i]);
            this.addLayer(l);
        }
    }

});

FM.map = function (id, options, mapOptions) {
    return new FM.Map(id, options, mapOptions);
};
