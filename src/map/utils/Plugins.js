FM.Plugins = {

    _addfullscreen: function(_fenixmap, show) {
        if ( show ) {
            //$("#" + _fenixmap.mapContainerID).append("<div class='fm-icon-box-background fm-btn-icon fm-fullscreen'><div class='fm-icon-sprite fm-icon-fullscreen' id='"+ _fenixmap.suffix +"-fullscreenBtn'><div></div>");
           // FM.UIUtils.fullscreen(_fenixmap.suffix +"-fullscreenBtn", _fenixmap.mapContainerID);
            $("#" + _fenixmap.mapContainerID).append("<div class='fm-icon-box-background fm-btn-icon fm-fullscreen'><div class='fm-icon-sprite fm-icon-fullscreen' id='"+ _fenixmap.suffix +"-fullscreenBtn'><div></div>");
            FM.UIUtils.fullscreen(_fenixmap.suffix +"-fullscreenBtn",_fenixmap.options.gui.fullscreenID);
        }
    },

    _addlayercontroller: function(_fenixmap, show){
        if ( show )
            $("#" + this.suffix +"-controller").show();
        else
            $("#" + this.suffix +"-controller").hide();
    },

    _addgeosearch: function(_fenixmap, show) {
        if ( show && L.GeoSearch) {
            new L.Control.GeoSearch({
                provider: new L.GeoSearch.Provider.OpenStreetMap()
            }).addTo(_fenixmap.map);
        }
    },

    _addgeocoder: function(_fenixmap, show) {
        // TODO: should be load here dinamically the requires JS
        if ( show && L.Control.OSMGeocoder) {
            var osmGeocoder = new L.Control.OSMGeocoder();
            _fenixmap.map.addControl(osmGeocoder);
        }
    },

    _addmouseposition: function(_fenixmap, show) {
        if ( show && L.control.mousePosition) {
        	L.control.mousePosition().addTo(_fenixmap.map);
        }
    },

    _addexport: function(_fenixmap, show) {
        if ( show && L.Control.Export) {
        	_fenixmap.map.addControl(new L.Control.Export())
        }
    },

    _addzoomcontrol: function(_fenixmap, position) {
        var zoomControl = new L.Control.Zoom();
        zoomControl.setPosition('bottomright');
        _fenixmap.map.addControl(zoomControl);
        return zoomControl;
    },

    _addprintmodule: function(_fenixmap, show) {
        if ( show && L.print)
            /** TODO: install print module **/
            var printProvider = L.print.provider({
                method: 'GET',
                url: 'http://hqlprfenixapp1.hq.un.fao.org:10090/geoserver/pdf',
                autoLoad: true,
                dpi: 254
            });
        var printControl = L.control.print({ provider: printProvider });
        _fenixmap.map.addControl(printControl);
    },

    _adddisclaimerfao: function(_fenixmap, show) {
        if ( show ) {
            var structure = FM.replaceAll(FM.guiMap.disclaimerfao, 'REPLACE', _fenixmap.suffix);
            $("#" + _fenixmap.suffix + '-container-map').append(structure);
            var text = '';
            switch(_fenixmap.options.lang.toUpperCase()) {
                case 'ES':
                    text = FM.guiMap.disclaimerfao_S;
                    break;
                case 'FR':
                    text = FM.guiMap.disclaimerfao_F;
                    break;
                default:
                    text = FM.guiMap.disclaimerfao_E;
                    break;
            }
            text = FM.replaceAll(text, 'REPLACE', _fenixmap.suffix);

            $("#" + _fenixmap.suffix + '-disclaimerfao').attr( "title", text);

            try {
                $("#" + _fenixmap.suffix + '-disclaimerfao').powerTip({placement: 'nw'});
            } catch (e) {

            }
        }
    },


    /**
     *
     *
     * TODO: handle the layer control on layer selection to make spatial query
     *
     * (i.e. if a layer has certain properties add the draw control and remove it when is deselected )
     *
     *
     **/
    _adddrawcontrol: function(_fenixmap, show) {
        if ( show && L.Control.Draw) {

            var drawnItems = new L.FeatureGroup();
            _fenixmap.map.addLayer(drawnItems);

            var drawControl = new L.Control.Draw({
                draw: {
                    position: 'topleft',
                    polygon: {
                        title: 'Draw a polygon!',
                        allowIntersection: false,
                        drawError: {
                            color: '#b00b00',
                            timeout: 1000
                        },
                        shapeOptions: {
                            color: '#bada55'
                        }
                    },
                    circle: {
                        shapeOptions: {
                            color: '#662d91'
                        }
                    }
                },
                edit: {
                    featureGroup: drawnItems
                }
            });
            _fenixmap.map.addControl(drawControl);

            _fenixmap.map.on('draw:created', function (e) {
                var type = e.layerType,
                    layer = e.layer;

                if (type === 'marker') {

                    layer.bindPopup('A popup!');
                    //console.log(layer.getLatLng());
                    //console.log(_fenixmap.map.options.crs.project(layer.getLatLng()));
                }
                //console.log("created " + e.layerType);
                l = layer;
                l.layerType = type;
                drawnItems.addLayer(layer);

                _fenixmap.spatialQuery(layer)

            });

            _fenixmap.map.on('draw:edited', function (e) {
                var layers = e.layers;
                var countOfEditedLayers = 0;
                layers.eachLayer(function(layer) {
                    countOfEditedLayers++;
                });
                //console.log("Edited " + countOfEditedLayers + " layers");
            });
        }
    },

    _addcontrolloading: function( _fenixmap, show) {
        if ( show && L.Control.loading) {
            var loadingControl = L.Control.loading({
                separate: true,
                position: 'topright'
            });
            _fenixmap.map.addControl(loadingControl)
        }
    },

    _addzoomresetcontrol: function( _fenixmap, show) {
    	if( show ) {
			(function() {

				console.log(_fenixmap.plugins);

				var pos = typeof _fenixmap.options.plugins.zoomresetcontrol === 'string' ? _fenixmap.options.plugins.zoomresetcontrol : 'bottomright',
					control = new L.Control({position: pos}),
					container = _fenixmap.plugins.zoomcontrol._container;

				control.onAdd = function(map) {
						var azoom = L.DomUtil.create('div','leaflet-control-zoom-reset',container);
						azoom.innerHTML = "Reset";
						L.DomEvent
							.disableClickPropagation(azoom)
							.addListener(azoom, 'click', function() {
								map.setView(map.options.center, map.options.zoom);
							},azoom);
						var d=  L.DomUtil.create('span');
						d.style.display = 'none';
						return d;
					};
				return control;
			}())
			.addTo(_fenixmap.map);
		}    	
    }
}
