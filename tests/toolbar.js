
requirejs(['../src/paths'], function (paths) {
	'use strict';

	paths.baseUrl = '../';

	require.config(paths);
	
	require([
		'jquery','jquery','underscore','bootstrap','handlebars',
		'fenix-map',
		'fenix-map-config',
		'tests/data/rise',
		'domready!'
	], function($,jQuery,_,bts,Handlebars,
		FenixMap, FenixMapConf,
		Data) {
		
		_.extend(FenixMapConf, {
			BASEURL: '../dist',
			BASEURL_LANG: '../dist/i18n/'
		});

		window.map = new FM.Map('#map', {
			plugins: {
				fullscreen: false,
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
				container: '#gui_controller',
				overlay: true,
				baselayer: true,
				wmsLoader: false
			},
			baselayers: {
				"cartodb": {
					title_en: "CartoDB light",
					url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
					attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
					subdomains: 'abcd',
					maxZoom: 19
				},				
				"world_imagery": {
					title_en: "World Imagery",
					url: "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
					attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
				},				
				"esri_grayscale": {
					url: "http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
					title_en: "Esri WorldGrayCanvas",
					attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
					maxZoom: 16
				}
			}
		});
		
		map.createMap(0,0,3);

        var data = _.map(Data, function(d){
            var v = {};
            v[d[0]] = parseFloat(d[2])
            return v;
        });
        
        var joincolumnlabel = 'areanamee',
        	joincolumn = 'faost_code',
        	mu = 'Tonnes';

        map.addLayer( new FM.layer({
            layers: 'fenix:gaul0_faostat_3857',
            layertitle: 'Rice Paddy Production 2013',
            opacity: '0.7',
            joincolumn: joincolumn,
            joincolumnlabel: joincolumnlabel,
            joindata: data,
            mu: mu,
            measurementunit: mu,
            layertype: 'JOIN',
            jointype: 'shaded',
            openlegend: true,
            defaultgfi: true,
            colorramp: 'Reds',
            lang: 'en',
            customgfi: {
            	showpopup: true,
                content: {
                    en: '<div class="fm-popup">'+
                    		'{{' + joincolumnlabel + '}} <br />'+
                    		'<b>{{{' + joincolumn + '}}} </b> '+ mu +
                    	'</div>'
                }
            }
        }) );//*/

		$('#cklabels').on('change', function(e) {
			if(e.target.checked)
				map.labelsShow();
			else
				map.labelsHide();
		});

		$('#ckbounds').on('change', function(e) {
			if(e.target.checked)
				map.boundariesShow();
			else
				map.boundariesHide();
		});		

	});
});







