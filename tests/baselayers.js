
require.config({

	baseUrl: '../',

	paths: {
		'i18n'                  :'node_modules/i18n/i18n',
		'text'                  :'node_modules/text/text',
		'domready'              :'node_modules/domReady/domReady',

		'jquery'                :'node_modules/jquery/dist/jquery.min',
		'bootstrap'             :'node_modules/bootstrap/dist/js/bootstrap.min',		
		'underscore'            :'node_modules/underscore/underscore-min',
		'handlebars'            :'node_modules/handlebars/dist/handlebars.min',
		
		'hoverintent'           :'node_modules/hoverintent/dist/hoverintent.min',
		'leaflet'               :'node_modules/leaflet/dist/leaflet-src',
		//'leaflet.markercluster' :'node_modules/leaflet.markercluster/dist/leaflet.markercluster',
		'powertip'              :'node_modules/jquery-powertip/dist/jquery.powertip.min',

		//optionals
		'chosen'                :'node_modules/chosen-jquery/lib/chosen.jquery.min',
		'jquery-ui'             :'//fenixrepo.fao.org/cdn/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
		'jquery.i18n.properties':'//fenixrepo.fao.org/cdn/js/jquery/1.0.9/jquery.i18n.properties-min',
        'jquery.hoverIntent'    :'node_modules/jquery.hoverIntent/jquery.hoverIntent.min',


        'fenix-map'             :'dist/fenix-ui-map.src',
		'fenix-map-config'      :'dist/fenix-ui-map-config'
		//'import-dependencies'   :'//fenixrepo.fao.org/cdn/js/FENIX/utils/import-dependencies-1.0',
	},

	shim: {
		'bootstrap' : ['jquery'],
		'chosen'    : ['jquery'],
		'jquery-ui' : ['jquery'],
		'powertip'  : ['jquery'],
		'jquery.i18n.properties': ['jquery'],
		'jquery.hoverIntent'    : ['jquery'],
        'hoverintent'    : ['jquery'],
		'underscore': {
			exports: '_'
		},
		'fenix-map': [
			'i18n',
			'jquery',
			'jquery-ui',
			'chosen',
			'leaflet',
			//'leaflet.markercluster'
			//'import-dependencies',				
			//'jquery-ui',
			//'hoverintent',
			'powertip',

			'jquery.i18n.properties',
			'fenix-map-config',
            'jquery.hoverIntent'
		]
	}
});

require([
	'jquery','jquery','underscore','bootstrap','handlebars',
	'fenix-map',
	'fenix-map-config',
	'domready!'
], function($,jQuery,_,bts,Handlebars,
	FenixMap, FenixMapConf) {

	
	_.extend(FenixMapConf, {
		BASEURL: '../dist',
		BASEURL_LANG: '../dist/i18n/'
	});

	window.map = new FM.Map('#map', {
		plugins: {
			disclaimerfao: true,
			geosearch: true,
			mouseposition: false,
			controlloading : true,
			zoomcontrol: 'bottomright'
		},
		url: {
			MAP_SERVICE_SHADED: 'http://fenix.fao.org/test/geo/fenix/mapclassify/join/',
			DEFAULT_WMS_SERVER: 'http://fenix.fao.org/geoserver',
			MAP_SERVICE_GFI_JOIN: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/',
			MAP_SERVICE_GFI_STANDARD: 'http://fenix.fao.org/test/geo/fenix/mapclassify/request/'
		},
		guiController: {
			overlay: true,
			baselayer: true,
			wmsLoader: false
		},
		baselayers: {
			"osm": {
				title_en: "CartoDB light",
				url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
				attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
				subdomains: 'abcd',
				maxZoom: 19
			},
			"osm_grayscale": {
				url: "http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png",
				title_en: "OpenStreetMap Gray"
			},
			"esri_grayscale": {
				url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
				title_en: "Esri WorldGrayCanvas",
				attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
				maxZoom: 16
			}
		}
	});
	
	map.createMap();

	map.addLayer( new FM.layer({
		layers: 'fenix:gaul0_line_3857',
		layertitle: 'Country Boundaries',
		urlWMS: 'http://fenixapps.fao.org/geoserver',
		opacity: '0.8',
		lang: 'EN'
	}) );

	var labelsLayer = new FM.layer({
        layername: 'labels',
        layertype: 'TILE',
        layertitle: 'Country Labels',
        lang: 'EN'
    });

	labelsLayer.leafletLayer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
		subdomains: 'abcd',
		maxZoom: 19
	});

	map.addLayer(labelsLayer);
   //map.zoomTo("country", "iso3", ["THA"]);
   //map.zoomTo("country", "iso2", "GE");
});









