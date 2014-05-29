FM.SpatialQuery = {

    /**
     *
     * Perform a GetFeautreInfo with a Joined Layer
     *
     * @param l
     * @param layerPoint
     * @param latlng
     * @param map
     */
    getFeatureInfoJoin: function(l, layerPoint, latlng, map) {
        // setting a custom popup if it's not available
        if (l.layer.custompopup == null ) FMDEFAULTLAYER.joinDefaultPopUp(l.layer)
        FM.SpatialQuery.getFeatureInfoStandard(l, layerPoint, latlng, map);
    },


    /**
     *
     * GetFeatureInfo standard (used to WMS GetFeatureInfoRequests)
     *
     * @param l
     * @param layerPoint
     * @param latlng
     * @param map
     */
    getFeatureInfoStandard: function(l, layerPoint, latlng, map) {
        // var latlngStr = '(' + latlng.lat.toFixed(3) + ', ' + latlng.lng.toFixed(3) + ')';
        var bounds = map.getBounds();
        var sw = map.options.crs.project(bounds.getSouthWest()),ne = map.options.crs.project(bounds.getNorthEast());
        var BBOX = sw.x + ',' + sw.y +',' + ne.x + ',' + ne.y;
        var WIDTH = map.getSize().x;
        var HEIGHT = map.getSize().y;
        var X = map.layerPointToContainerPoint(layerPoint).x;
        var Y = map.layerPointToContainerPoint(layerPoint).y;

        // TODO: check it because in theory it shouldn't be needed
        X = new Number(X);
        X = X.toFixed(0) //13.3714
        Y = new Number(Y);
        Y = Y.toFixed(0) //13.3714

        var url = 'http://' + FMCONFIG.BASEURL_MAPS  + FMCONFIG.MAP_SERVICE_GFI_STANDARD;
        url += '?SERVICE=WMS';
        url += '&VERSION=1.1.1';
        url += '&REQUEST=GetFeatureInfo';
        url += '&BBOX='+BBOX;
        url += '&HEIGHT='+HEIGHT;
        url += '&WIDTH='+WIDTH;
        url += '&X='+X;
        url += '&Y='+Y;
        url += '&FORMAT=image/png';
        url += '&INFO_FORMAT=text/html';

        // get the selected layer and layer values
        if ( l != '' && l != null ) {
            url += '&LAYERS=' + l.layer.layers;
            url += '&QUERY_LAYERS=' + l.layer.layers;
            url += '&STYLES=';
            url += '&SRS='+l.layer.srs; //EPSG:3857
            url += '&urlWMS=' + l.layer.urlWMS;
            //  FM.SpatialQuery.getFeatureInfoJoinRequest(url, 'GET', null,latlng, map, outputID, l.layer.custompopup, l.layer.lang, l.layer.joindata);
            FM.SpatialQuery.getFeatureInfoJoinRequest(url, 'GET', latlng, map, l);
        }
        else {
            // alert('no layer selected')
        }

    },

    // TODO: use an isOnHover flag?
    getFeatureInfoJoinRequest: function(url, requestType, latlon, map, l) {
        console.log('SpatialQuery.getFeatureInfoJoinRequest()')
        console.log(l.layer)
        var lang = ( l.layer.lang )? l.layer.lang.toLocaleLowerCase(): null;
        var _map = map;
        var _l = l;
        /** TODO: use JQuery? **/
        var r = new RequestHandler();
        r.open(requestType, url);
        r.setContentType('application/x-www-form-urlencoded');
        r.onload(function () {
            // do something to response
            var response = this.responseText
            if ( response != null ) {
                // rendering the output
                var maxWidth = $('#' + _map._fenixMap.id).width() - 15;
                var maxHeight = $('#' + _map._fenixMap.id).height() - 15;
                var popup = new L.Popup({ maxWidth: maxWidth, maxHeight: maxHeight });

                /** TODO: do it MUCH nicer **/
                var r = response;
                if (_l.layer.customgfi) {
                    var result = FM.SpatialQuery.customPopup(response, _l.layer.customgfi, _l.layer.lang, _l.layer.joindata)
                    // TODO: handle multiple outputs
                    r =  ( result != null )? result[0]: response;
                }
                else {
                    var result = FM.SpatialQuery.transposeHTMLTable(response);
                    r =  ( result != null )? result[0]: response;
                }

                // check if the output is an empty (geoserver) output
                r = FM.SpatialQuery._checkGeoserverDefaultEmptyOutput(r);

                // how to handle custom callback
                if ( _l.layer.customgfi ) {
                    if ( _l.layer.customgfi && _l.layer.customgfi.callback) ( _l.layer.customgfi.callback(r, _l.layer) )
                    if ( _l.layer.customgfi && _l.layer.customgfi.output && _l.layer.customgfi.output.show ) {
                        $('#' + _l.layer.customgfi.output.id).empty();
                        if ( r ) {
                            $('#' + _l.layer.customgfi.output.id).append(r);
                        }
                    }
                    if ( _l.layer.customgfi && _l.layer.customgfi.showpopup) {
                        if ( r ) {
                            popup.setLatLng(latlon).setContent(r);
                            _map.openPopup(popup);
                        }
                    }
                }
                else {
                    if ( r ) {
                        popup.setLatLng(latlon).setContent(r);
                        _map.openPopup(popup);
                    }
                }
            }
        });
        r.send();
    },

    customPopup: function(response, custompopup, lang, joindata) {
        console.log('SpatialQuery.customPopup()')
        console.log(joindata)
        var values = this._parseHTML(custompopup.content[lang]);
        if ( values.id.length > 0 || values.joinid.length > 0) {
            var h = $('<div></div>').append(response);
            var responsetable = h.find('table');
            if ( responsetable) {
                return FM.SpatialQuery._customizePopUp(custompopup.content[lang], values, responsetable, joindata );
            }
        }

    },

    /** TODO: how to check it?  **/
    _checkGeoserverDefaultEmptyOutput: function(response) {
        return response;
    },

    _customizePopUp:function(content, values, responsetable, joindata) {
        console.log('SpatialQuery._customizePopUp()')
        console.log(joindata)
        var tableHTML = responsetable.find('tr');
        var headersHTML = $(tableHTML[0]).find('th');
        var rowsData = [];

        // get only useful headers
        var headersHTMLIndexs = [];
        for ( var i=0;  i < headersHTML.length; i ++) {
            for (var j=0; j< values.id.length; j++) {
                if ( values.id[j].toUpperCase() == headersHTML[i].innerHTML.toUpperCase()) {
                    headersHTMLIndexs.push(i); break;
                }
            }
        }

        // this is in case the joinid is not empty TODO: split the code
        if ( joindata ) {
            var headersHTMLJOINIndexs = [];
            console.log( 'values.joinid');
            console.log( values.joinid);
            for ( var i=0;  i < headersHTML.length; i ++) {
                for (var j=0; j< values.joinid.length; j++) {
                    if ( values.joinid[j].toUpperCase() == headersHTML[i].innerHTML.toUpperCase()) {
                        headersHTMLJOINIndexs.push(i); break;
                    }
                }
            }
        }

        // get rows data
        for(var i=1; i<tableHTML.length; i ++) {
            rowsData.push($(tableHTML[i]).find('td'))
        }

        console.log(rowsData);
        console.log(headersHTML);

        // create the response results
        var htmlresult = [];
        console.log(rowsData);
        for( var j=0; j < rowsData.length; j++) {

            // this is done for each row of result (They could be many rows)
            var c = content;

            // Replace IDs
            for(var i=0; i<headersHTMLIndexs.length; i ++) {
                var header = '{{' + headersHTML[headersHTMLIndexs[i]].innerHTML + '}}'
                var d = rowsData[j][headersHTMLIndexs[i]].innerHTML;
                console.log(d);
                c = FM.Util.replaceAll(c, header, d);
            }

            // Replace joindata (if needed)
            if ( joindata ) {
                console.log('here');
                console.log(headersHTMLJOINIndexs);

                for(var i=0; i<headersHTMLJOINIndexs.length; i ++) {
                    console.log(headersHTML[headersHTMLJOINIndexs[i]]);
                    var header = '{{{' + headersHTML[headersHTMLJOINIndexs[i]].innerHTML + '}}}'
                    var d = rowsData[j][headersHTMLJOINIndexs[i]].innerHTML;
                    var v = FM.SpatialQuery._getJoinValueFromCode(d, joindata);
                    console.log(v);
                    c = FM.Util.replaceAll(c, header, v);
                }
            }

            // adding the row result to the outputcontent
            htmlresult.push(c)
        }
        return htmlresult;
    },


    _getJoinValueFromCode: function(code, joindata) {
        console.log("SpatialQuery._getJoinValueFromCode()");

        //TODO: do it nicer: the problem on the gaul is that the code is a DOUBLE and in most cases it uses an INTEGER
        var integerCode = ( parseInt(code) )? parseInt(code): null
        console.log(joindata);
        var json = ( typeof joindata == 'string' )? $.parseJSON(joindata) : joindata;
        for(var i=0; i< json.length; i++) {
            if ( json[i][code] || json[i][integerCode] ) {
                if ( json[i][code] ) json[i][code];
                else return json[i][integerCode];
            }
        }
        return '';
        //return 'No data available for this point';
    },

    /**
     *
     * Get all {{value}}
     * @private
     */
    _parseHTML: function(content) {
        var values = {};
        values.id = [];
        values.joinid = [];

        console.log(content);
        var array = content.match(/\{\{.*?\}\}/g);
        for (var i=0; i < array.length; i++) {
            array[i] = FM.Util.replaceAll(array[i], "{{", "");
            array[i] = FM.Util.replaceAll(array[i], "}}", "");

            // if it contains $ (this means that is a joinid
            if ( array[i].indexOf('{') >= 0 ) {
                array[i] = FM.Util.replaceAll(array[i], "{", "");
                array[i] = FM.Util.replaceAll(array[i], "}", "");
                values.joinid.push(array[i]);
            }
            else {
                values.id.push(array[i]);
            }
        }
        return values;
    },

    transposeHTMLTable: function(response){
        /** TODO: make it nicer **/
        var h = $('<div></div>').append(response);
        var table = h.find('table');
        var result = [];
        if ( table ) {
            var r = FM.SpatialQuery.transposeHTML(table)
            console.log(r);
            if ( r != null ) return r;
        }
        return null;
    },

    transposeHTML:function(table) {
        var div = $('<div class="fm-transpose-popup"></div>');

        var titleHTML = table.find('caption');

        console.log(table)

        try {
            div.append(titleHTML[0].innerHTML)

            var tableHTML = table.find('tr');

            var headers = $(tableHTML[0]).find('th');
            var rowsData = [];
            for ( var i =1;  i < tableHTML.length; i ++) {
                rowsData.push($(tableHTML[i]).find('td'))
            }

            var t = $('<table></table>');
            var tb = $('<tbody></tbody>');
            for( var i =0; i < headers.length; i++) {
                var tr = '<tr>';
                var td = '<td>' + headers[i].innerHTML + '</td>';
                for(var j = 0; j < rowsData.length; j++) {
                    td += '<td>' +rowsData[j][i].innerHTML + '</td>';
                }
                tr += td;
                tr += '</tr>';
                tb.append(tr);
            }
            return div.append(t.append(tb));
        } catch (e) {
            return null;
        }
    },


    /**
     * @param l
     * @param fenixMap
     * @param series
     * @param xmin
     * @param xmax
     * @param ymin
     * @param ymax
     * @param zoomToFeatures
     * @param layer used to highlight/filter the features
     */
    scatterLayerFilter:function(l, fenixMap, series, xmin, xmax, ymin, ymax, zoomToFeatures, layerHighlight, reclassify ) {

        // TODO: make a better function (this is to avoid that when the data are requested the values are empty)
        // if the layer is not defined OR if it's needed to reclassify the data are inserted again
        if ( !l.leafletLayer || reclassify ) l.layer.joindata = [];

        var spCodes = '';
        for(var i=0; i < series.length; i++) {
            if ( series[i].data[0][0] >= xmin && series[i].data[0][0] <= xmax && series[i].data[0][1] >= ymin && series[i].data[0][1] <= ymax )  {
                var geocode =  series[i].geocode;
                if ( spCodes != '') spCodes += ','
                if ( geocode) spCodes += "'"+ geocode +"'"
                var s = {};
                var value = series[i].data[0][0] / series[i].data[0][1];
                s[series[i].geocode] = value;

                // TODO: make a better function (this is to avoid that when the data are requested the values are empty)
                // if the layer is not defined OR if it's needed to reclassify the data are inserted again
                if ( !l.leafletLayer || reclassify ) l.layer.joindata.push(s);
            }
        }

        // TODO: make a better function (this is to avoid that when the data are requested the values are empty)
        // if the layer is not defined OR if it's needed to reclassify the data are inserted again
        if ( !l.leafletLayer || reclassify )  l.layer.joindata = JSON.stringify(l.layer.joindata);

        if (l.leafletLayer ) {
            // Highlight the layer (if exist)
            if ( layerHighlight ) FM.SpatialQuery.highlightFeaturesOfLayer(layerHighlight, spCodes);

            // reclassify the layer
            if ( reclassify ) fenixMap.createShadeLayerRequest(l, true);

            // SPATIAL QUERY
            if ( zoomToFeatures ) {
                FM.SpatialQuery._sampleSpatialQueryBoundingBox(fenixMap.map, spCodes, l.layer);
                //FM.SpatialQuery._sampleSpatialQueryCentroid(fenixMap.map, spCodes)
            }

        }
        else {
            fenixMap.addShadedLayer(l);
            //fenixMap.addLayer(l);
        }
    },

    scatterLayerFilterFaster:function(l, fenixMap, series, xmin, xmax, ymin, ymax, layerHighlight, reclassify, formula) {
        //console.log('----------scatterLayerFilterFaster');
        //console.log(formula);
        //console.log(series);
        var zoomToFeatures = ( l.layer.zoomToFeatures )?  l.layer.zoomToFeatures : false;
        if ( !l.leafletLayer || reclassify ) l.layer.joindata = [];

        var spCodes = '';
        for(var i=0; i < series.length; i++) {
            //console.log('-->' + series[i]);
            for ( var j = 0; j < series[i].data.length; j++) {
                //console.log('---->' + series[i].data[j]);
                if ( series[i].data[j].x >= xmin && series[i].data[j].x <= xmax && series[i].data[j].y >= ymin && series[i].data[j].y <= ymax )  {
                    var code =  series[i].data[j].code;
                    if ( spCodes != '') spCodes += ','
                    if ( code) spCodes += "'"+ code +"'"
                    var s = {};

                    // console.log('-->data: ' + series[i].data[j]);
                    //console.log('-->code: ' + code);

                    /* TODO: remove eval **/
                    if ( series[i].data[j].x != 0 && series[i].data[j].y != 0) {
                        var value = ( formula )? eval(formula) : series[i].data[j].x / series[i].data[j].y;

                        s[series[i].data[j].code] = value;

                        // TODO: make a better function (this is to avoid that when the data are requested the values are empty)
                        // if the layer is not defined OR if it's needed to reclassify the data are inserted again
                        if ( !l.leafletLayer || reclassify ) l.layer.joindata.push(s);

                    }
                }
            }
        }

        //console.log('END---');

        // this is to filter the result output without getting all the polygons, just the ones needed
        // TODO add a parameter to enable or disable this feature on the layer
        // if ( spCodes ) l.layer.cql_filter= l.layer.joincolumn +" IN (" + spCodes + ")";

        // TODO: make a better function (this is to avoid that when the data are requested the values are empty)
        // if the layer is not defined OR if it's needed to reclassify the data are inserted again
        if ( !l.leafletLayer || reclassify )  l.layer.joindata = JSON.stringify(l.layer.joindata);

        if (l.leafletLayer ) {
            // Highlight the layer (if exist)
            if ( layerHighlight ) FM.SpatialQuery.highlightFeaturesOfLayer(layerHighlight, spCodes);

            // reclassify the layer
            if ( reclassify ) fenixMap.createShadeLayerRequest(l, true);

            // SPATIAL QUERY
            if ( zoomToFeatures ) {
                FM.SpatialQuery._sampleSpatialQueryBoundingBox(fenixMap.map, spCodes, l.layer);
                //FM.SpatialQuery._sampleSpatialQueryCentroid(fenixMap.map, spCodes)
            }

        }
        else {
            fenixMap.addShadedLayer(l);
            //fenixMap.addLayer(l);
        }
    },

    // Highlight the features (it's passed not '10','15' that has to be converted)
    highlightFeaturesOfLayer:  function(l, codes) {
        //console.log('highlightFeaturesOfLayer')
        //console.log(l)
        console.log(codes)
        codes = FM.Util.replaceAll(codes, "'", "");


        l.layer.cql_filter = l.layer.joincolumn + " IN (" + codes + ")";
        if ( l.layerAdded )
            l.redraw();
        else
            l.addLayerWMS();
    },

    _sampleSpatialQueryBoundingBox: function(map, spCodes, layer) {
        //console.log(map);
        var data = {};
        data.datasource = 'FENIX';
        // default geometry column if it doesnt exist TODO: launch an alert in case
        var geom = (layer.geometrycolumn) ? layer.geometrycolumn : 'geom'
        data.select = 'ST_AsText(ST_Transform(ST_Envelope(ST_Collect(' + layer.geometrycolumn + ')), 4326)) ';
        /* data.from = 'gaul0_faostat_3857';
         data.where = "faost_code IN (" + spCodes + ") "*/
        data.from = ( layer.layername)? layer.layername : layer.layers;
        data.where = layer.joincolumn + " IN (" + spCodes + ") " ;
        $.ajax({
            type : 'POST',
            url :  FMCONFIG.BASEURL_WDS + FMCONFIG.WDS_SERVICE_SPATIAL_QUERY,
            data : data,
            success : function(response) {
                //console.log(response);
                var wkt = new Wkt.Wkt();
                wkt.read(response)
                //console.log(wkt)
                var BBOX = {
                    "xmin" : wkt.components[0][0].x,
                    "xmax" : wkt.components[0][2].x,
                    "ymax" : wkt.components[0][1].y,
                    "ymin" : wkt.components[0][0].y
                }
                FM.LayerUtils.zoomTOBBOX(map, BBOX);
            },
            error : function(err, b, c) { }
        });
    },

    _sampleSpatialQueryCentroid: function(map, spCodes) {
        var data = {};
        data.datasource = 'FENIX',
            data.select = 'ST_AsText(ST_Transform(ST_Centroid(ST_Collect(geom)), 4326)) ';
        data.from = 'gaul0_faostat_3857';
        data.where = "faost_code IN (" + spCodes + ") "
        $.ajax({
            type : 'POST',
            url :  FMCONFIG.BASEURL_WDS + FMCONFIG.WDS_SERVICE_SPATIAL_QUERY,
            data : data,
            success : function(response) {
                //console.log(response);
                var wkt = new Wkt.Wkt();
                wkt.read(response)
                console.log(wkt)
                map.panTo([wkt.components[0].y,wkt.components[0].x]);
            },
            error : function(err, b, c) { }
        });
    },

    filterLayerMinEqualThan: function(l, value) {
        FM.LayerUtils.filterLayerMinEqualThan(this, l, value);
    },

    filterLayerGreaterEqualThan:function(l, value) {
        FM.LayerUtils.filterLayerGreaterEqualThan(this, l, value);
    },

    filterLayerInBetweenEqualThan:function(l, min, max) {
        FM.LayerUtils.filterLayerInBetweenEqualThan(this, l, min, max);
    },

    filterLayerOuterEqualThan:function(l, min, max) {
        FM.LayerUtils.filterLayerOuterEqualThan(this, l, min, max);
    }

}