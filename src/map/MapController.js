
FM.MAPController = FM.Class.extend({

    id: '',

    suffix: '',

    _map: '',

    _fenixMap: '',

    _guiController:  {
        container: null,
        overlay : true,
        baselayer: true,
        layersthumbs: true
    },

    /** Used by the controller **/
    baseLayersMap:    '',    // should be an hashmap (id, layer)
    currentBaseLayer: '', // this is the layer that is currently the baselayer

    layersMap: '',  // HashMap(l.id, l)

    layersMapZIndexes: '', // HashMap(l.zindex, l.id)

    zIndexBaseLayer: 10, // TODO: modify it automatically on every update/adding of the layer checking the higher

    zIndex: 100, // TODO: modify it automatically on every update/adding of the layer checking the higher

    // used for the GFI
    selectedLayer: '',

    // GUI
    // left controller
    $boxIcons: '',
    $boxMenu: '',
    $boxMenuContainer: '',
    $boxMenuSelected: '', // i.e. SelectedLayers, BaseLayers WMS Layers

    getFeautureInfoLayer: [],
    // TODO: this is the list of the layers selected for the GFI

    initialize: function(suffix, fenixMap, map, guiOpts) { // (HTMLElement or String, Object)
        this._map = map;
        this._fenixMap = fenixMap;
        this.suffix = suffix;
        this.id = suffix + '-controller';
        this._guiController = $.extend({}, this._guiController, guiOpts);

        // initialize HashMaps
        this.baseLayersMap = new HashMap();
        this.layersMap = new HashMap();
        this.layersMapZIndexes = new HashMap();
    },

    /**
     *
     * initialize the Layer Controller GUI
     *
     */
    initializeGUI:function() {

        var self = this;

        if ( self._guiController ) {
            
            var mapDiv$ = $('#' + self.id);

            self.$boxMenu = $(FM.Util.replaceAll(FM.guiController.boxMenu, 'REPLACE', self.suffix));

            self.$boxMenuContainer = self.$boxMenu.find('#' + self.suffix + '-controller-box-content');
            
            self.$boxIcons = $(FM.Util.replaceAll(FM.guiController.boxIcons, 'REPLACE', self.suffix));

            self.visibleBoxMenu;

            if( self._guiController.container ) {

                var $div = $('<div class="fm-controller-external">')
                    .append(self.$boxIcons, self.$boxMenu);

                $div.prependTo(self._guiController.container);

                self.visibleBoxMenu = true;
            }
            else
            {
                self.visibleBoxMenu = false;

                var guiControl = (function() {
                    var control = new L.Control({position: 'bottomleft'});

                    control.onAdd = function(map) {

                        var $div = $('<div class="leaflet-control-controller">')
                            .append(self.$boxIcons, self.$boxMenu);

                        if (!L.Browser.touch) {
                            L.DomEvent.disableClickPropagation($div[0]);
                            L.DomEvent.on($div[0], 'mousewheel', L.DomEvent.stopPropagation);
                        }
                        else
                            L.DomEvent.on($div[0], 'click', L.DomEvent.stopPropagation);

                        return $div[0];
                    };
                    return control;
                }()).addTo(self._map);
            }

            /** TODO: make it nicer and more dynamic, with a more consistent name **/
            if ( self._guiController.overlay) {
                self.loadIcon('overlay', self.visibleBoxMenu);
                self.initializeOverlayDragging();
            }
            if ( self._guiController.baselayer) {
                self.loadIcon('baselayer', self.visibleBoxMenu);
            }

            if ( self._guiController.wmsLoader) {
                self.loadIcon('wmsLoader', self.visibleBoxMenu);
                var wmsUtils = new FM.WMSUtils(),
                    idDD = this.suffix + '-controller-wmsLoader-dropdown',
                    idContent = this.suffix + '-controller-wmsLoader-content',
                    wmsServers = FM.WMSSERVERS.DEFAULT_EXTERNAL_WMS_SERVERS;
                    
                wmsUtils.WMSCapabilities(idDD, idContent, this._fenixMap, wmsServers);
            }
        }
    },

    /**
     *
     * Inizialize an Icon to load
     *
     * @param toLoad
     */
    loadIcon: function(toLoad, visibleBox) {
        var guiBox = toLoad + 'Box';
        var guiIcon = toLoad + 'Icon';

        visibleBox = typeof visibleBox !== 'undefined' ? visibleBox : false;

        this.$boxMenuContainer.append(
            FM.Util.replaceAll(FM.guiController[guiBox], 'REPLACE', this.suffix)
        );

        if(visibleBox===false) {
            this.$boxMenu.hide();
            //this.$boxMenuContainer.find('.fm-box-zindex').hide();
        }else {
            this.$boxMenu.show();
            this.$boxMenuContainer.find('.fm-box-zindex').show();
        }
        
        var $boxIcon = $(FM.Util.replaceAll(FM.guiController[guiIcon], 'REPLACE', this.suffix));
        $boxIcon.tooltip({title: $.i18n.prop('_' + toLoad) });

        $boxIcon.appendTo(this.$boxIcons);

        if(visibleBox===true)
            this.$boxIcons.hide();

        

        var _this = this,
            $id =  $('#' + _this.suffix + '-controller-' + toLoad + '-box');

        $('#' + this.suffix + '-controller-' + toLoad + 'Icon')
        .on('click', {
                $id: $id,
                suffix: this.suffix
            }, function(e) {
                
                var $id = e.data.$id;

                if (_this.$boxMenu.is(':visible'))
                {
                    if ( _this.$boxMenuSelected == $id ) {
                        _this.$boxMenu.slideUp()
                        $id.hide();
                        _this.$boxMenuSelected = '';
                    }
                    else {
                        $id.slideDown();
                        _this.$boxMenuSelected = $id;
                    }
                }
                else {
                    _this.$boxMenuSelected = $id;
                    _this.$boxMenu.slideDown();
                }
        });

        // close panel
        $('#' + this.suffix + '-controller-' + toLoad + '-remove')
        .on('click', {
            $id: $id,
            suffix: this.suffix
        }, function(e) {
            var $id = e.data.$id,
                suffix =  e.data.suffix;

            $('#' + suffix + '-controller-box').slideUp();
            $id.hide();
        });//*/
    },

    /**
     * Initialize the Drag and Drop of the Overlays
     */
    initializeOverlayDragging: function() {
        var _this = this;

//TODO replace with https://github.com/RubaXa/Sortable

        $('#'+ this.suffix + '-controller-overlay-content').sortable({
            cursor: 'move',
            opacity:'0.5',
            stop: function (event, ui) {
                // getting layers order
                var children = $(ui.item).parent().children();
                var layerIDs = [];
                var zIndexBase = 0;
                for(var i=children.length-1; i >= 0; i-- ) {
                    var id = $(children[i]).data("layer").id;
                    var layertitle = $(children[i]).data( "layer").layer.layertitle;
                    var zIndex =  zIndexBase + 100
                    layerIDs.push($(children[i]).data("layer").id)
                    _this.updateZIndex(id, zIndex);
                    zIndexBase++;
                }
                // setting the z-indexes based on the layers order list
                // N.B. they are set from the bottom to the top
            }
        });
    },

    /**
     *
     * Add a Layer Overlay to the Layer Controller
     *
     * @param l
     */
    layerAdded: function(l) {

        var self = this;

        l.layerAdded = true;
        /** TODO: check if works always this solution **/
        if ( !l.layer.zindex ) {
            l.layer.zindex = self.zIndex;
            l.leafletLayer.setZIndex = l.layer.zindex;
        }
        self.zIndex = self.zIndex + 2;

        if ( !l.layer.hideLayerInControllerList ) {
            // add legend to the mapDIV
            var $legend = $(FM.Util.replaceAll(FM.guiController.legend, 'REPLACE', l.id)),
                div = $legend[0];
           
            if (!L.Browser.touch) {
                L.DomEvent.disableClickPropagation(div);
                L.DomEvent.on(div, 'mousewheel', L.DomEvent.stopPropagation);
            }
            else
                L.DomEvent.on(div, 'click', L.DomEvent.stopPropagation);

            self._fenixMap.$map.find('.leaflet-control-legend').append($legend);
            

            // creating the HTML controller-overlay-item structure
            var idStructure =  '#'+ self.suffix + '-controller-overlay-content';
            var idItem = '#'+ l.id + '-controller-item';
            var idControllerItem = l.id + '-controller-item';
            var overlayStructure = FM.Util.replaceAll(FM.guiController.overlay, 'REPLACE', l.id);

            // TODO: a way to get the layer back by the ID

            $(idStructure).prepend(overlayStructure);

            // saving the layer information (it's too many information TODO: please set only ID and needed infos
            $( '#'+ l.id  + '-controller-item-box' ).data( "layer", l );

            var index = $('#'+l.id+'-controller-item-box').index() + 1;

            // setting up the layer GUI options
            self._layerGUIOptions(l);

            // setting the layer to the HashMap to handle the ID and ZIndex
            self.layersMap.set(l.id, l);
            self.layersMapZIndexes.set(l.layer.zindex, l.id)

            $(idItem+'-title').text(l.layer.layertitle);

            // Enable/Disable layer
            $(idItem+ '-enabledisable')
                .tooltip({title: $.i18n.prop('_enabledisablelayer') })
                .on('click', {id:l.id}, function(event) {
                    self.showHide(event.data.id)
                });

            // Layer Opacity
            var opacity = 1;
            if ( l.layer.opacity != null )
                opacity = l.layer.opacity;

            $(idItem+ '-opacity')
                .tooltip({title: $.i18n.prop('_layeropacity') })
                .slider({
                    orientation: "horizontal",
                    range: "min",
                    min: 0, max: 1, step: 0.1,
                    value: opacity,
                    slide: function( event, ui ) {
                        FM.LayerUtils.setLayerOpacity(l, ui.value);
                    }
                });

            // Layer GetFeatureInfo
            var $layergfi = $(idItem+ '-getfeatureinfo');

            if ( !l.layer.enablegfi ) {
                $(idItem+ '-getfeatureinfo').css("display","none");
            }
            else
            {
                $layergfi.on('click', {id:l.id}, function(event) {
                    var l = self.layersMap.get(event.data.id);
                    if ( self.selectedLayer.id == event.data.id) {
                        // the layer select is equal to the new one, so deselect it
                        $('#' + self.selectedLayer.id + '-controller-item-getfeatureinfo').removeClass('fm-icon-getfeatureinfo-selected');
                        self.selectedLayer = '';
                        l.layer.defaultgfi = false;
                    }
                    else {
                        // unselect old layer icon
                        $('#' + self.selectedLayer.id + '-controller-item-getfeatureinfo').removeClass('fm-icon-getfeatureinfo-selected');
                        // select new layer icon
                        $('#' + event.data.id + '-controller-item-getfeatureinfo').addClass('fm-icon-getfeatureinfo-selected');
                        self.selectedLayer = l;
                        l.layer.defaultgfi = true;
                    }
                });
                
                $layergfi.tooltip({title: $.i18n.prop('_getfeatureinfo') });

                if ( l.layer.defaultgfi ) {
                    // TODO: set default gfi style on the layer
                    self.selectedLayer = l;
                    $('#' + self.selectedLayer.id + '-controller-item-getfeatureinfo').removeClass('fm-icon-getfeatureinfo-selected');
                    // select new layer icon
                    $('#' + l.id + '-controller-item-getfeatureinfo').addClass('fm-icon-getfeatureinfo-selected');
                }
            }



            // Show/Hide Legend
            var $getlegend = $(idItem+ '-getlegend');
            if (l.layer.showlegend == null || l.layer.showlegend != false) {
                $getlegend.on('click', {id:l.id, idToRender: idControllerItem + '-getlegend'}, function(event) {
                    var l = self.layersMap.get( event.data.id);
                    FM.Legend.getLegend(l, event.data.idToRender)
                });
            }
            
            $getlegend.tooltip({title: $.i18n.prop('_showhidelegend') })
                .css("display","inline-block");

            // Switch JoinType (From shaded to Point Layer)
            if (l.layer.layertype ) {
                if (l.layer.layertype == 'JOIN' ) {
                    if (l.layer.switchjointype == null || l.layer.switchjointype ) {
                        $(idItem+ '-switchjointype')
                        .tooltip({title: $.i18n.prop('_switchto'+ l.layer.jointype.toLowerCase()) })
                        .css("display","inline-block")
                        .on('click', {id:l.id}, function(event) {
                            self.switchJoinType(event.data.id);
                        })
                    }
                }
            }

            // Enable/Disable Swipe
            var $swipelayer = $(idItem+ '-swipe');
            $swipelayer.on('click', {id:l.id}, function(event) {
                var l = self.layersMap.get( event.data.id);
                if (l.layer.swipeActive == null || !l.layer.swipeActive) {
                    FM.LayerSwipe.swipeActivate(l, self._fenixMap.suffix + '-handle', self._fenixMap.suffix + '-map', self._map);
                    // select icon
                    $swipelayer.addClass('fm-icon-swipe-selected')
                }
                else {
                    FM.LayerSwipe.swipeDeactivate(l, self._map);
                    // deselect icon
                    $swipelayer.removeClass('fm-icon-swipe-selected')
                }
            });

            // ZoomToLayer or BBOX
            var $zoomtolayer = $(idItem+ '-zoomtolayer');
            if ( l.layer.zoomToBBOX ) {
                $zoomtolayer.css("display","inline-block");
                $zoomtolayer.attr( "title", $.i18n.prop('_zoomtolayer'));
                $zoomtolayer.on('click', {id:l.id}, function(event) {
                    var l = self.layersMap.get( event.data.id);
                    FM.LayerUtils.zoomToLayer(self._map, l.layer)
                });
            }
            if (l.layer.zoomTo ) {
                $zoomtolayer.css("display","inline-block");
                $zoomtolayer.attr( "title", $.i18n.prop('_zoomtolayer'));
                $zoomtolayer.on('click', {id:l.id}, function(event) {
                    var l = self.layersMap.get( event.data.id);
                    FM.LayerUtils.zoomToLayer(self._map, l.layer)
                });
            }

            // Show/Hide SubIcons
            var $subiconsshowhide  = $(idItem+ '-showhide-subicons');
            var $subiconscontainer = $(idItem+ '-subicons');
            
            $subiconsshowhide
                .on('click', function(event) {

                    $subiconscontainer.slideToggle('fast');

                    if ( $subiconsshowhide.hasClass("fm-icon-up")) {
                        $subiconsshowhide.removeClass("fm-icon-up")
                        $subiconsshowhide.addClass("fm-icon-down")
                    }
                    else {
                        $subiconsshowhide.removeClass("fm-icon-down")
                        $subiconsshowhide.addClass("fm-icon-up")
                    }
                });
        }
    },

    _layerGUIOptions:function(l) {
        var gui = l.gui;
        // at Gaul Level 1 remove the point layer option
        if (l.layer.layertype == 'JOIN') {
            if ( l.layer.gui !=null )
                if (l.layer.gui.nojoinlayerswitch != null && l.layer.gui.nojoinlayerswitch) {
                    // TODO: hide pointlayer option
                    // hiding the legend
                    $('#'+ l.id + '-controller-item-switchjointype').css('display', 'none');
                }
        }
    },

    /**
     *
     * Add a Base Layer to the Layer Controller
     *
     * @param l
     */
    addBaseLayer: function(l) {

        var self = this;

        // setting the zIndex and updating it
        //console.log(this.zIndexBaseLayer);
        l.layer.zindex = this.zIndexBaseLayer;
        this.zIndexBaseLayer = this.zIndexBaseLayer + 2;

        // setting the layer to the HashMap to handle the ID and ZIndex
        this.baseLayersMap.set(l.id, l);
        this.layersMapZIndexes.set(l.layer.zindex, l.id);

        // creating the HTML controller-overlay-item structure
        var idStructure =  '#'+ this.suffix + '-controller-baselayer-content',
            idItem = '#'+ l.id + '-controller-item',
            overlayStructure = FM.Util.replaceAll(FM.guiController.baselayer, 'REPLACE', l.id);

        overlayStructure = FM.Util.replaceAll(overlayStructure, 'MAPID', this._fenixMap.id);

        $(idStructure).append(overlayStructure);

        // listeners
        $(idItem + '-title').append(l.layer.layertitle);

        if(self._guiController.layersthumbs)
            $('#' + l.id + '-controller-item-baselayer-image').addClass("fm-icon-baselayer-" + l.layer.layername);
        else
            $('#' + l.id + '-controller-item-baselayer-image').remove();

        $(idItem+ '-enabledisable').on('click', {id:l.id}, function(e) {
            self.showHide(e.data.id)
        });

        var opacity = 1;
        if ( l.layer.opacity != null )
            opacity = l.layer.opacity;
        /*try {
            $(idItem+ '-opacity').slider({
                orientation: "horizontal",
                range: "min",
                min: 0,
                max: 1,
                step: 0.1,
                value: opacity,
                slide: function(e, ui) {
                    FM.LayerUtils.setLayerOpacity(l, ui.value);
                }
            });
        }catch(e) { }//*/

        $('#' + l.id + '-controller-box-item')
        .on('click', {
            id:l.id
        }, function(e) {
            var id = e.data.id;
            var l = self.baseLayersMap.get(id);

            // removing the old baselayer
            self.removeBaseLayerByID(self.currentBaseLayer.id);
            var oldBaseLayer = self.baseLayersMap.get(self.currentBaseLayer.id);
            $('#' + oldBaseLayer.id + "-controller-box-item").removeClass('fm-controller-box-item-baselayer-content-selected')
            $('#' + oldBaseLayer.id + "-controller-item-opacity").hide();

            // add the new baselayer to the map and setting as default one
            $('#' + l.id + "-controller-box-item").addClass('fm-controller-box-item-baselayer-content-selected')
            $('#' + l.id + "-controller-item-opacity").show();
            self._map.addLayer(l.leafletLayer);
            self.currentBaseLayer = l;
            self.setZIndex(l)

        });

        // select baselayer item
        if ( this.baseLayersMap.count() == 1 ){
            $(idItem + '-radio').attr('checked', true);
            // add the layer just if it's the first one
            this._map.addLayer(l.leafletLayer);
            this.currentBaseLayer = l;
            $('#' + l.id + "-controller-box-item").addClass('fm-controller-box-item-baselayer-content-selected')
            $('#' + l.id + "-controller-item-opacity").show();
            self.setZIndex(l)
        }

    },

    /*
     * Remove a layer from the Map and from the HashMap
     *
     * @param l
     */
    removeLayer:function(l) {
        if ( l.layer.jointype !=null && l.layer.jointype == 'point')
            this.removeLayerPoint(l);
        else
            this.removeLayerDefault(l);
    },


    removeLayerDefault:function(l) {
        // remove layer from the map
        this._map.removeLayer(l.leafletLayer);
        // remove layer from the hashmaps
        this.layersMap.remove(l.id);
        this.layersMapZIndexes.remove(l.layer.zindex);
        $('#' + l.id + '-controller-item-box').remove();
        $('#' + l.id + '-controller-item-getlegend-holder').remove();
    },

    /*
     * Remove the layer Point from the Map and from the HashMap
     *
     * @param id
     */
    removeLayerPoint: function(l) {
        for(var i=0; i < l.layer.pointsLayers.length; i++)
            this._map.removeLayer(l.layer.pointsLayers[i]);

        this.layersMap.remove(l.id);
        this.layersMapZIndexes.remove(l.layer.zindex);
        $('#' + id + '-controller-item-box').remove();
    },

    /*
     * Remove the layer from the Map and from the HashMap
     *
     * @param id
     */
    removeBaseLayerByID: function(id) {
        var l = this.baseLayersMap.get(id);
        // remove layer from the map
        this._map.removeLayer(l.leafletLayer);
    },

    /*
     * Switch a jointype (from Point to Shaded and from Shaded to Point)
     *
     * @param id
     */
    switchJoinType: function(id) {
        var l = this.layersMap.get(id);

        if (  l.layer.jointype.toLowerCase() == 'point') {
            // alert('point')
            $('#' + l.id + '-controller-item-switchjointype').attr( "title", $.i18n.prop('_switchtopoint'));
            this.switchToShaded(id);
        }
        else if ( l.layer.jointype.toLowerCase() == 'shaded') {
            // alert('shaded')
            $('#' + l.id + '-controller-item-switchjointype').attr( "title", $.i18n.prop('_switchtoshaded'));
            this.switchToPoint(id);
        }
        $("#" + l.id +  "-controller-item-switchjointype").tooltip({title: $.i18n.prop('_switchtoshaded') });
    },

    /*
     * Switch a Shaded joined layer to a Point one
     *
     * TODO: da vedere
     *
     * @param id
     */
    switchToPointswitchToPoint: function(id) {
        var l = this.layersMap.get(id);
        l.layer.jointype = 'point';

        if ( l.leafletLayer != null )
            this._map.removeLayer(l.leafletLayer);

        this._fenixMap.createPointLayerRequest(l);
    },

    /*
     * Switch a Point joined layer to a Shaded one
     *
     * TODO: da vedere
     *
     * @param id
     */
    switchToShaded: function(id) {
        var l = this.layersMap.get(id);
        l.layer.jointype = 'shaded';

        // cleaning the pointLayers
        if ( l.layer.pointsLayers != null ) {
            for(var i=0; i < l.layer.pointsLayers.length; i++) {
                this._map.removeLayer(l.layer.pointsLayers[i]);
            }
        }
        this._fenixMap.createShadeLayerRequest(l);
    },

    /**
     *  Show/Hide the layer from the map
     *
     * @param id
     */
    showHide: function(id, isReload) {
        try {
            var l = this.layersMap.get(id);
            if (l) {
                if (l.layer.jointype && l.layer.jointype.toLowerCase() == 'point')
                    this.showHidePointLayer(id);
                else
                    this.showHideLayer(id, isReload);
            }
        }catch (e) {
           // console.warn("showHide warn:" + e);
        }
    },

    /***
     *
     * Show/Hide a Point Layer
     *
     * @param id
     */
    showHidePointLayer: function(id) {
        var l = this.layersMap.get(id);
        for(var i=0; i < l.layer.pointsLayers.length; i++) {
            if (l.layer.visibility == null || l.layer.visibility) {
                l.layer.visibility = false;
                $('#'+ id+ '-controller-item-enabledisable').removeClass('fm-icon-enable');
                $('#'+ id+ '-controller-item-enabledisable').addClass('fm-icon-disable');
                for(var i=0; i < l.layer.pointsLayers.length; i++)
                    this._map.removeLayer(l.layer.pointsLayers[i]);
            }
            else {
                l.layer.visibility = true;
                $('#'+ id+ '-controller-item-enabledisable').removeClass('fm-icon-disable');
                $('#'+ id+ '-controller-item-enabledisable').addClass('fm-icon-enable');
                for(var i=0; i < l.layer.pointsLayers.length; i++)
                    this._map.addLayer(l.layer.pointsLayers[i]);
            }
        }
    },

    /**
     * Show/Hide the layer  removing it and readding ti to leaflet for performance issues
     *
     * @param id
     */
    showHideLayer:function(id, isReload) {
        try {
            var l = this.layersMap.get(id);
            if (isReload != null && !isReload) {
                if (l.layer.visibility == false) {
                    $('#' + id + '-controller-item-enabledisable').removeClass('fm-icon-enable');
                    $('#' + id + '-controller-item-enabledisable').addClass('fm-icon-disable');
                    this._map.removeLayer(l.leafletLayer)
                }
            }
            else if (isReload != null && isReload) {
                // do nothing (this will maintain the old status
            }
            else {
                if (l.layer.visibility == null || l.layer.visibility) {
                    l.layer.visibility = false;
                    ;
                    $('#' + id + '-controller-item-enabledisable').removeClass('fm-icon-enable');
                    $('#' + id + '-controller-item-enabledisable').addClass('fm-icon-disable');
                    //document.getElementById(id).style.display = 'none';
                    this._map.removeLayer(l.leafletLayer)
                }
                else {
                    l.layer.visibility = true;
                    $('#' + id + '-controller-item-enabledisable').removeClass('fm-icon-disable');
                    $('#' + id + '-controller-item-enabledisable').addClass('fm-icon-enable');
                    //document.getElementById(id).style.display = 'block';
                    this._map.addLayer(l.leafletLayer);
                    this.setZIndex(l) // this method assigns the Z-Index and the ID to the layer
                }
            }
        }catch (e) {
           // console.warn("showHideLayer error:"  + e);
        }
    },

    /**
     * Update the Z-Index of a layer retrieving it by ID
     *
     * @param layerID
     * @param updatedZIndex
     */
    updateZIndex: function(layerID, updatedZIndex) {
        var l = this.layersMap.get(layerID);
        l.layer.zindex = updatedZIndex;
        l.leafletLayer.setZindex = updatedZIndex;
        try {
            document.getElementById(l.id).style.zIndex=updatedZIndex;
        }catch (e) {
           // console.log('error updateZIndex: ' + l.id + ' doesnt exists');
        }

    },

    /**
     * This method search for the new layer added (a new layer or a layer that was hidden
     * and set the index and the id of the layer that is missing the ID/Z-Index
     *
     * @param l
     */
    setZIndex: function (l) {
        try {
            var layers = document.getElementById(this._fenixMap.tilePaneID).childNodes;
            for (i = 0, len = layers.length; i < len; i++) {
                if (layers[i] !== this._container) {
                    var zIndex = parseInt(layers[i].style.zIndex, 10);
                    if ( isNaN(zIndex))  {
                        layers[i].style.zIndex = l.layer.zindex;
                        layers[i].id = l.id;
                    }
                }
            }
        } catch (e) {
           // console.warn("setZIndex error:"  + e);
        }
    },

    selectGetFeatureInfoIcon:function (id) {
        for(var i=0; i < this.layersMap.count(); i++) {
            if ( this.layersMap._data[i] == id )
                $('#' + id + '-controller-item-getfeatureinfo').addClass('fm-icon-getfeatureinfo-selected');
            else
                $('#' + id + '-controller-item-getfeatureinfo').removeClass('fm-icon-getfeatureinfo-selected');
        }

    },

    exportOverlays:function() {
        //console.log('exportOverlays');

        /* TODO: make it simpler **/
        var arrayZindex = [];
        this.layersMap.forEach(function(l) {
            arrayZindex.push(l.layer.zindex)
        });
        arrayZindex = arrayZindex.sort()

        //console.log(arrayZindex);

        /** get the id based on the zIndex **/
        var arrayLayers = [];
        for (var i = 0; i < arrayZindex.length; i++ ) {
            var found = false;
            if ( !found)
                this.layersMap.forEach(function(l) {
                    //console.log(e);
                    if (l.layer.zindex == arrayZindex[i]) {
                        arrayLayers.push(l.layer);
                        found = true;
                    }
                });
        }
        var clonedArray = $.map(arrayLayers, function (obj) {
            return $.extend(true, {}, obj);
        });
        return clonedArray;
    },

    exportBaselayers:function() {
        /* TODO: make it easier the load of the baselayers
        *  add a value to set the current selected one (also on startup)
        * **/

        return null;
    }

});

FM.mapController = function (suffix, fenixMap, map, guiController) {
    return new FM.MAPController(suffix, fenixMap, map, guiController);
};