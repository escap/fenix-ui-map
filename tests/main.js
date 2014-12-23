
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
		'leaflet'               :'node_modules/leaflet/dist/leaflet',
		//'leaflet.markercluster' :'node_modules/leaflet.markercluster/dist/leaflet.markercluster',
		'powertip'              :'node_modules/jquery-powertip/dist/jquery.powertip.min',

		//optionals
		'chosen'                :'node_modules/chosen-jquery/lib/chosen.jquery.min',
		'jquery-ui'             :'//fenixapps.fao.org/repository/js/jquery-ui/1.10.3/jquery-ui-1.10.3.custom.min',
		'jquery.i18n.properties':'//fenixapps.fao.org/repository/js/jquery/1.0.9/jquery.i18n.properties-min',

		'fenix-map'             :'dist/fenix-ui-map.src',
		'fenix-map-config'      :'dist/fenix-ui-map-config'
		//'import-dependencies'   :'//fenixapps.fao.org/repository/js/FENIX/utils/import-dependencies-1.0',
	},

	shim: {
		'bootstrap' : ['jquery'],
		'chosen'    : ['jquery'],
		'jquery-ui' : ['jquery'],
		'powertip'  : ['jquery'],
		'jquery.i18n.properties': ['jquery'],
		'jquery.hoverIntent'    : ['jquery'],
		'underscore': {
			exports: '_'
		},
		'fenix-map': [
			'i18n',
			'jquery',
			'chosen',
			'leaflet',
			//'leaflet.markercluster'
			//'import-dependencies',				
			//'jquery-ui',
			'hoverintent',
			'powertip',
			'jquery.i18n.properties',
			'fenix-map-config'
		]
	}
});

require([
	'jquery','underscore','bootstrap','handlebars',
	'fenix-map',
	'fenix-map-config',
	'domready!'
], function($,_,bts,Handlebars,
	FenixMap, FenixMapConf) {

	var options = {
		plugins: { geosearch : true, mouseposition: false, controlloading : true,zoomControl: 'bottomright'},
		guiController: { overlay : true,  baselayer: true,  wmsLoader: true },
		gui: {disclaimerfao: true }
	}

	var mapOptions = { zoomControl:false,attributionControl: false };
	var m = new FM.Map('map', options, mapOptions);
	m.createMap();

	var layer = {};
	layer.layers = 'fenix:gaul0_line_3857'
	layer.layertitle = 'Country Boundaries'
	layer.urlWMS = 'http://fenixapps.fao.org/geoserver'
	layer.opacity='1';
	l = new FM.layer(layer);
	m.addLayer(l);

});