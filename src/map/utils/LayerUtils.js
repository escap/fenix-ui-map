FM.LayerUtils = {

    zoomToLayer: function(map, layer) {
       if ( layer.bbox)  FM.LayerUtils.zoomTOBBOX(map, layer.bbox)
       else if ( layer.zoomTo ) FM.LayerUtils.zoomToBoundary(map, layer.zoomTo.boundary, layer.zoomTo.code, layer.zoomTo.srs)
    },

    zoomToBoundary: function(map, boundary, code, srs) {
        FM.LayerUtils._zoomToRequest(map, boundary, code, srs);
    },


    zoomTOBBOX: function(map, bbox) {
        var bounds;
        if ( bbox.ymin ) {
            var southWest = new L.LatLng(bbox.ymin,bbox.xmin);
            var northEast = new L.LatLng(bbox.ymax, bbox.xmax);
            bounds = new L.LatLngBounds(southWest, northEast);
        }
        else if ( bbox ) {
            if ( bbox.length > 0) {
                var southWest = new L.LatLng(bbox[0],bbox[1]);
                var northEast = new L.LatLng(bbox[2], bbox[3]);
                bounds = new L.LatLngBounds(southWest, northEast);
            }
        }
        if ( bounds) FM.LayerUtils.zoomToBounds(map, bounds)
    },

    zoomToBounds: function(map, bounds) {
        map.fitBounds(bounds);
    },

    _zoomToRequest: function(map, boundary, code, srs) {
        var _this = this;
        var url = FMCONFIG.BASEURL_MAPS + FMCONFIG.MAP_SERVICE_ZOOM_TO_BOUNDARY + '/'+ boundary +'/'+ code+'/'+ srs+'';
        $.ajax({
            type: "GET",
            url: url,
            data: FM.Util.parseLayerRequest(l.layer),
            success: function(response) {
                if (typeof response == 'string')
                    response = $.parseJSON(response);

                var southWest = new L.LatLng(response.ymin,response.xmin);
                var northEast = new L.LatLng(response.ymax, response.xmax);
                var bounds = new L.LatLngBounds(southWest, northEast);
                map.fitBounds(bounds);
            }
        });
    },

    setLayerOpacity: function(l, opacity) {
        if (l.leafletLayer) l.leafletLayer.setOpacity(opacity)
        l.layer.opacity = opacity;
        l.leafletLayer.options.opacity = opacity;
        //console.log( l.leafletLayer)
    },

    filterLayerMinEqualThan:function(fenixMap, l, value) {
         l = FM.LayerUtils.getValuesMinEqualThan(l, value);
        FM.LayerUtils._refreshLayer(fenixMap, l);
    },

    filterLayerGreaterEqualThan:function(fenixMap, l, value) {
        l = FM.LayerUtils.getValuesGreaterEqualThan(l, value);
        FM.LayerUtils._refreshLayer(fenixMap, l);
    },

    filterLayerInBetweenEqualThan:function(fenixMap, l, min, max) {
        l = FM.LayerUtils.getValuesInBetweenEqualThan(l, min, max);
        FM.LayerUtils._refreshLayer(fenixMap, l);
    },

    filterLayerOuterEqualThan:function(fenixMap, l, min, max) {
        l = FM.LayerUtils.getValuesOuterEqualThan(l, min, max);
        FM.LayerUtils._refreshLayer(fenixMap, l);
    },

    _refreshLayer: function(fenixMap, l) {
        switch (l.layer.jointype) {
            case 'point' :  fenixMap.createPointLayerRequest(l); break;
            case 'shaded' : fenixMap.createShadeLayerRequest(l, true); break;
        }
    },

    getValuesMinEqualThan:function(l, value) {
        if (typeof l.layer.defaultdata == 'string')
            l.layer.defaultdata = $.parseJSON(l.layer.defaultdata);
        l.layer.joindata = [];
        for(i=0; i < l.layer.defaultdata.length; i++) {
            $.each(l.layer.defaultdata[i], function(k, v) {
                if ( v <= value)  {
                    // TODO: optimize it
                    l.layer.joindata.push(l.layer.defaultdata[i]);
                }
            });
        }
        l.layer.joindata = JSON.stringify(l.layer.joindata);
        return l;
    },
    getValuesGreaterEqualThan:function(l, value) {
        if (typeof l.layer.defaultdata == 'string')
            l.layer.defaultdata = $.parseJSON(l.layer.defaultdata);
        l.layer.joindata = [];
        for(i=0; i < l.layer.defaultdata.length; i++) {
            $.each(l.layer.defaultdata[i], function(k, v) {
                if ( v >= value)  {
                    // TODO: optimize it
                    l.layer.joindata.push(l.layer.defaultdata[i]);
                }
            });
        }
        l.layer.joindata = JSON.stringify(l.layer.joindata);
        return l;
    },

    getValuesInBetweenEqualThan:function(l, min, max) {
        if (typeof l.layer.defaultdata == 'string')
            l.layer.defaultdata = $.parseJSON(l.layer.defaultdata);
        l.layer.joindata = [];
        for(i=0; i < l.layer.defaultdata.length; i++) {
            $.each(l.layer.defaultdata[i], function(k, v) {
                if ( v >= min && v <= max)  {
                    // TODO: optimize it
                    l.layer.joindata.push(l.layer.defaultdata[i]);
                }
            });
        }
        l.layer.joindata = JSON.stringify(l.layer.joindata);
        return l;
    },

    getValuesOuterEqualThan:function(l, min, max) {
        if (typeof l.layer.defaultdata == 'string')
            l.layer.defaultdata = $.parseJSON(l.layer.defaultdata);
        l.layer.joindata = [];
        for(i=0; i < l.layer.defaultdata.length; i++) {
            $.each(l.layer.defaultdata[i], function(k, v) {
                if ( (min &&  v <= min) || (max &&  v >= max)) {
                    // TODO: optimize it
                    l.layer.joindata.push(l.layer.defaultdata[i]);
                }
            });
        }
        l.layer.joindata = JSON.stringify(l.layer.joindata);
        return l;
    }





}
