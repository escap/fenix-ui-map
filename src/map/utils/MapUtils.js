FM.MapUtils = function() {

    var syncMapsOnMove = function (map, mapToSync) {
        // this let you pass the FenixMap or the LeafletMap
        var m = ( map.map ? map.map: map);
        var mToSync = ( mapToSync.map ? mapToSync.map: mapToSync);
        m.on('dragend zoomend', function(e) {
            if ( m.getCenter() != mToSync.getCenter && m.getZoom() != mToSync.getZoom) {
                mToSync.setView(m.getCenter(), m.getZoom());
            }
        });
    };

    var exportLayers = function(fenixmap) {
        //console.log(fenixmap);
    };

    var zoomTo = function(m, layer, column, codes) {
        var url = FMCONFIG.ZOOM_TO_BBOX + layer +'/'+ column+'/'+ codes.toString();
        $.ajax({
            type: "GET",
            url: url,
            success: function(response) {
                if (m.hasOwnProperty("map"))
                    m.map.fitBounds(response);
                else
                    m.fitBounds(response);
            }
        });
    };

    var zoomToCountry = function(m, column, codes) {
        zoomTo(m, "country", column, codes);
    };

    var getSLDfromCSS = function(layername, css) {
        var sld = '';
        $.ajax({
            url: FMCONFIG.CSS_TO_SLD,
            data: {
                stylename: layername,
                style: css
            },
            async: false,
            type: 'POST',
            success: function(response) {
                sld = response;
            }
        });
        return sld;
    };

    var fitWorldByScreen = function(m) {
    	//http://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds

		var worldBB = L.latLngBounds([[-90, -180], [90, 180]]),
			GLOBE_WIDTH = 190, // a constant in Google's map projection
			GLOBE_HEIGHT = 190, // a constant in Google's map projection

			west = worldBB.getSouthWest().lng,
			east = worldBB.getNorthEast().lng,
			angleW = east - west,

			north = worldBB.getNorthEast().lat,
			south = worldBB.getSouthWest().lat,
			angleH = north - south,

			mapW = m.getSize().x,
			mapH = m.getSize().y;

		if (angleW < 0)
			angleW += 360;
		if (angleH < 0)
			angleH += 360;			

		var zoomW = Math.round(Math.log(mapW * 360 / angleW / GLOBE_WIDTH) / Math.LN2),
			zoomH = Math.round(Math.log(mapH * 360 / angleH / GLOBE_HEIGHT) / Math.LN2),
			zoom = Math.max(zoomW, zoomH) - 1;

		m.setZoom(zoom, { animate: false });
    };

    return {
        syncMapsOnMove: syncMapsOnMove,
        exportLayers: exportLayers,
        zoomTo: zoomTo,
        zoomToCountry: zoomToCountry,
        getSLDfromCSS: getSLDfromCSS,
        fitWorldByScreen: fitWorldByScreen
    }

}();