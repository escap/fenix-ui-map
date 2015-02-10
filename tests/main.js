
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
			'jquery-ui',
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
	
	_.extend(FenixMapConf, {
		BASEURL: '../dist',
		BASEURL_LANG: '../dist/i18n/'
	});

	var m = new FM.Map('map', {
		plugins: {
			geosearch: true,
			mouseposition: false,
			controlloading : true,
			zoomControl: 'bottomright'
		},
		guiController: {
			overlay: true,
			baselayer: true,
			wmsLoader: true
		},
		gui: {
			disclaimerfao: true
		}
	}, {
		zoomControl: false,
		attributionControl: false
	});
	
	m.createMap();

	m.addLayer( new FM.layer({
		layers: 'fenix:gaul0_line_3857',
		layertitle: 'Country Boundaries',
		urlWMS: 'http://fenixapps.fao.org/geoserver',
		opacity: '1',
		lang: 'en'
	}) );


	var joincolumnlabel = 'adm0_name';
	var joincolumn =  'adm0_code';
	m.addLayer( new FM.layer({
		layers: 'fenix:gaul0_3857',
		layertitle: 'Join Dataset',
		opacity: '1',
		joincolumn: joincolumn,
		joincolumnlabel: joincolumnlabel,
		joindata: '[{"1":"1"},{"2":"110"},{"3":"120"},{"4":"130"}]',
		layertype: 'JOIN',
		jointype: 'shaded',
		defaultgfi: true,
		lang: 'en',
	    customgfi: {
			content: {
				en: "<div class='fm-popup'> {{" + joincolumnlabel + "}} <div class='fm-popup-join-content'>{{{" + joincolumn + "}}}</div></div>"
			},
			showpopup: true
		}

	}) );

    m.zoomTo("country", "iso3", ["ITA"]);
    //m.zoomTo("country", "iso2", "GE");

   // m.zoomToCountry("iso2", ["IT","GER"]);
});









