define(function() {

	return window.FMCONFIG = {

		BASEURL_LANG: 'http://fenixrepo.fao.org/cdn/js/fenix-ui-map/0.1.4/i18n/',

		MAP_SERVICE_SHADED: 'http://fenix.fao.org/test/geo/fenix/mapclassify/join/',
		DEFAULT_WMS_SERVER: 'http://fenix.fao.org/demo/fenix/geoserver',
		MAP_SERVICE_GFI_JOIN: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/',
		MAP_SERVICE_GFI_STANDARD: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/',

		// ZOOM TO BBOX
		ZOOM_TO_BBOX: 'http://fenix.fao.org/geo/fenix/spatialquery/db/spatial/bbox/layer/',

		CSS_TO_SLD: 'http://fenixapps2.fao.org/geoservices/CSS2SLD',

		BASEURL_MAPS: 'http://fenixapps2.fao.org/maps-demo',
		MAP_SERVICE_ZOOM_TO_BOUNDARY: '/rest/service/bbox',
		MAP_SERVICE_WMS_GET_CAPABILITIES: '/rest/service/request',
		MAP_SERVICE_PROXY: '/rest/service/request',

		LAYER_BOUNDARIES: 'fenix:gaul0_line_3857',
		LAYER_LABELS: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
    };
});
