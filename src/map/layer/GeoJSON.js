/*FMGeoJSON = FM.GeoJSON.extend({

    *//** TODO: make a GeoJSON Layer: this as been done to don't put it on Map.js **//*

    *//** TODO: check the probleb with the WFS GeoJSON output **//*

    createGeoJSONLayer: function(l) {
        return l;
    },

    addGeoJSON: function() {

        var reqURL = 'http://suite.opengeo.org/geoserver/wfs';
        var url = 'http://' + FMCONFIG.BASEURL_MAPS  + FMCONFIG.MAP_SERVICE_WMS_GET_CAPABILITIES;
        //      url += '?service=wfs&version=1.1.0&request=GetFeature&typename=usa:states&featureid=states.39&outputformat=json';
        url += '?service=wfs&version=1.1.0&request=GetFeature&typename=world:cities';
        url +=  '&outputFormat=application/json';
        url += '&urlWMS=' + reqURL;
        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        *//** TODO: find the problem with the GeoJSON and WFS. aAnd move it from here **//*
        xhr.onload = function () {
            // do something to response
            var response = this.responseText;
            response = $.parseJSON(response);
            if (response.type && response.type == "FeatureCollection") {
                *//*               this.jsonData = response;
                 coordinates = _this.map.options.crs.code;
                 inputCrs = "EPSG:900913";

                 console.log( coordinates);
                 console.log( inputCrs);

                 function projectPoint(coordinates, inputCrs) {
                 var
                 x = coordinates[1],
                 y = coordinates[0],
                 p = new L.Point(x,y);
                 return [p.x, p.y];
                 }

                 features = this.jsonData.features || [];
                 for (var f = 0; f < features.length; f++) {
                 switch (features[f].geometry.type) {
                 case "Point":
                 projectedCoords = projectPoint(features[f].geometry.coordinates);
                 features[f].geometry.coordinates = projectedCoords;
                 break;
                 case "MultiPoint":
                 for (var p = 0; p < features[f].geometry.coordinates.length; p++) {
                 projectedCoords = projectPoint(features[f].geometry.coordinates[p]);
                 features[f].geometry.coordinates[p] = projectedCoords;
                 }
                 break;
                 case "MultiPolygon":
                 for (var p = 0; p < features[f].geometry.coordinates.length; p++) {
                 console.log( features[f].geometry.coordinates[p] );
                 projectedCoords = projectPoint(features[f].geometry.coordinates[p]);
                 features[f].geometry.coordinates[p] = projectedCoords;
                 }
                 break;
                 }
                 }


                 console.log(features)*//*

                *//*               var geojsonLayer = new L.GeoJSON(features, {
                 style: function (feature) {
                 return {color: feature.properties.color};
                 },
                 onEachFeature: function (feature, layer) {
                 layer.bindPopup(feature.properties.City + " | " + feature.properties.Country);
                 }
                 });*//*

                var geojsonLayer = new L.GeoJSON(response, {
                    style: function (feature) {
                        return {color: feature.properties.color};
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(feature.properties.City + " | " + feature.properties.Country);
                    }
                });
                console.log(geojsonLayer)
                _this.map.addLayer(geojsonLayer);
            }
        };
        xhr.send();
    },

    _toGeographicCoords: function() {
        function projectPoint(coordinates *//* [x,y] *//*, inputCrs) {
            var source = new Proj4js.Proj(inputCrs || "EPSG:900913"),
                dest = new Proj4js.Proj("EPSG:4326"),
                x = coordinates[0],
                y = coordinates[1],
                p = new Proj4js.Point(x,y);
            Proj4js.transform(source, dest, p);
            return [p.x, p.y];
        }

        var features = this.jsonData.features || [];
        for (var f = 0; f < features.length; f++) {
            switch (features[f].geometry.type) {
                case "Point":
                    projectedCoords = projectPoint(features[f].geometry.coordinates);
                    features[f].geometry.coordinates = projectedCoords;
                    break;
                case "MultiPoint":
                    for (var p = 0; p < features[f].geometry.coordinates.length; p++) {
                        projectedCoords = projectPoint(features[f].geometry.coordinates[p]);
                        features[f].geometry.coordinates[p] = projectedCoords;
                    }
                    break;
            }
        }
    }

});*/
