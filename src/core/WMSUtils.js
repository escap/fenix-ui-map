FM.WMSUtils = FM.Class.extend({

    /** TODO: implement WFS **/

    _divID:'',
    _dropdowndID: '',
    _outputID: '',
    _fenixMap: '',
    _wmsServers: '',
    _mapID: '',
    _lang: 'EN',

    // JSON
    WMSCapabilities: function(divID, outputID, fenixmap, wmsServers, lang) {
        this._divID = divID;
        this._dropdowndID = divID + '-dropdown';
        this._outputID = outputID;
        this._fenixmap = fenixmap;
        this._wmsServers = wmsServers;
        if ( lang ) this._lang = lang;

        this._createWMSDropDown(this._wmsServers, this._divID, this._dropdowndID, this._outputID, fenixmap);
    },

    _createWMSDropDown: function(wmsServers, divID, dropdowndID, outputID, fenixmap) {
        //console.log(wmsServers);

        // TODO: dynamic width
        var html = '<select id="'+ dropdowndID+'" style="width:200px;" data-placeholder="'+ $.i18n.prop('_selectaWMSServer') +'" class="">';
        html += '<option value=""></option>';
        for(var i=0; i < wmsServers.length; i++)
            html += '<option value="'+ wmsServers[i].url + '">'+wmsServers[i].label +'</option>';
        html += '</select>';

        $('#' + divID).empty();
        $('#' + divID).append(html);

        try {
            $('#' + dropdowndID).chosen({disable_search_threshold:6, width: '100%'});
        }  catch (e) {}

        // enable on click
        var _this = this;
        $( "#" + dropdowndID ).change({},  function (event) {
            _this._createWMSOutputRequest(outputID, fenixmap, $( this ).val());
        });
    },

    /**
     * Create Layers's List
     *
     * @param id
     * @param fenixmap
     * @param wmsServerURL
     * @param urlOptions
     * @private
     */
     /** TODO: urlOptions (urlParameters) non e' usato!!! **/
    _createWMSOutputRequest: function(id, fenixmap, wmsServerURL) {
        $("#" + id).empty();
        FM.UIUtils.loadingPanel(id, '30px');

        var url = FMCONFIG.BASEURL_MAPS  + FMCONFIG.MAP_SERVICE_WMS_GET_CAPABILITIES
        url += (url.contains('?'))? "&": "?";
        url += 'SERVICE=WMS';
        url += '&VERSION=1.1.1';
        url += '&request=GetCapabilities';
        url += '&urlWMS=' + wmsServerURL;

        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            // do something to response
            var response = this.responseText;
            var xmlResponse = $.parseXML( response );
            _this._createWMSOutput(id, fenixmap, xmlResponse, wmsServerURL)
        };
        xhr.send();

    },

    _createWMSOutput: function(id, fenixmap, xmlResponse, wmsServerURL ) {

        $("#" + id).empty();
        $(xmlResponse).find('Layer').each(function() {

            if ($(this).children("Name").text() && $(this).children("Name").text() != '') {
                var rand = FM.Util.randomID();
                var layerPanel = FM.replaceAll(FM.guiController.wmsLoaderLayer, 'REPLACE', rand);
                $("#" + id).append(layerPanel);
                $('#' + rand + '-WMSLayer-title').append($(this).children("Title").text());
                $('#' + rand + '-WMSLayer-title').attr( "title", $(this).children("Title").text());
                try { $('#' + rand + '-WMSLayer-title').powerTip({placement: 'n'}); } catch (e) {}


                var layer = {};
                layer.layers= $(this).children("Name").text();
                layer.layername= $(this).children("Name").text();
                layer.layertitle=$(this).children("Title").text();
                layer.style = $(this).children("Style").children("Name").text();
                layer.urlWMS = wmsServerURL;
                // setting the default CRS of the map
                layer.srs = fenixmap.map.options.crs.code;
                layer.openlegend = true; //this will open the legend by on preview (choose on add if we want to leave it open **/

                /** TODO: save legengdURL **/
                //.legendurl = $(this).children("Style").children("LegendURL");
                //console.log(layer.legendurl);

                /** TODO: save getLegendURl http://gis.stackexchange.com/questions/21912/how-to-get-wms-legendgraphics-using-geoserver-and-geowebcache **/


                /*
                 console.log($(this).children("EX_GeographicBoundingBox").children("westBoundLongitude").text())
                 console.log($(this).children("westBoundLongitude").text());
                 console.log($(this).children("eastBoundLongitude").text());
                 console.log($(this).children("southBoundLatitude").text());
                 console.log($(this).children("northBoundLatitude").text());*/

                // TODO: get bounding box with the current CRS
                $("#" + rand + "-WMSLayer-box").click({fenixmap:fenixmap, layer: layer}, function(event) {
                    event.data.layer.openlegend = false; // if on add we want to close the legend
                    var layer = new FM.layer(event.data.layer);
                    event.data.fenixmap.addLayer(layer);

                    // TODO: multilanguage PopUp onAdd
                    var content = 'The Layer <b>' + event.data.layer.layertitle + '</b><br> has been added to the map';
                    FMPopUp.init({ parentID: event.data.fenixmap.id, content: content})

                });

                // add on hoverIntent the layer
                var _fenixMap = fenixmap;
                var _layer =  $.extend(true, {}, layer);
                //_layer.hideLayerInControllerList = true;
                var _tmpLayer = new FM.layer(_layer, _fenixMap);
                try {
                    $("#" + rand + "-WMSLayer-box").hoverIntent({
                        over: function () { _tmpLayer.addLayer();    },
                        out:  function () { _tmpLayer.removeLayer(); },
                        timeout: 500
                    });
                }catch(e) {
                    // try catch in case the jquery.hoverIntent plugin is not been imported
                }
            }
        });
    },

    // add a new Server to the servers list
    addWMSServer: function() {

    },


    _WMSCapabilities: function(id, fenixmap, wmsServerURL) {
        // TODO: check it because in theory it shouldn't be needed
        var url = FMCONFIG.BASEURL_MAPS  + FMCONFIG.MAP_SERVICE_WMS_GET_CAPABILITIES;
        url += (url.contains('?'))? "&": "?";
        url += 'SERVICE=WMS';
        url += '&VERSION=1.1.1';
        url += '&request=GetCapabilities';
        url += '&urlWMS=' + wmsServerURL;

        var _this = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            // do something to response
            var response = this.responseText;
            var xmlResponse = $.parseXML( response );
            _this._createWMSDropwDown(id, fenixmap, xmlResponse, wmsServerURL)
        };
        xhr.send();
    },

    _createWMSDropwDown: function(id, fenixmap, xmlResponse, wmsServerURL ) {
        var rand = FM.Util.randomID();
        $(xmlResponse).find('Layer').each(function() {
            var rand = FM.Util.randomID();
            if ($(this).children("Name").text()) {

                $("#" + id).append("<div id='WMSLayer-"+ rand +"'>" + $(this).children("Title").text() + " + " +  $(this).children("Style").children("Name").text() + " <div>");

                var layer = {};
                layer.layers= $(this).children("Name").text();
                layer.layername= $(this).children("Name").text();
                layer.layertitle=$(this).children("Title").text();
                layer.style = $(this).children("Style").children("Name").text();
                layer.urlWMS = wmsServerURL;
                layer.openlegend = true;

                // setting the default CRS of the map
                layer.srs = fenixmap.map.options.crs.code;

                $("#WMSLayer-" + rand).click({fenixmap:fenixmap, layer: layer}, function(event) {
                    var layer = new FM.layer(event.data.layer);
                    event.data.fenixmap.addLayerWMS(layer);
                });
            }
        });
    },


    WFSCapabilities: function(id, fenixmap, wmsServerURL) {
        var url = FMCONFIG.BASEURL_MAPS  + FMCONFIG.MAP_SERVICE_WMS_GET_CAPABILITIES;
        url += (url.contains('?'))? "&": "?";
        url += 'SERVICE=WFS';
        url += '&VERSION=1.0.0';
        url += '&request=GetCapabilities';
        url += '&urlWMS=' + wmsServerURL;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.onload = function () {
            // do something to response
            var response = this.responseText;

            var xmlResponse = $.parseXML( response );

            FM.WMSUtils._createWMSDropwDown(id, fenixmap, xmlResponse, wmsServerURL)
        };
        xhr.send();
    },

    _createWFSDropwDown: function(id, fenixmap, xmlResponse, wmsServerURL ) {
        $(xmlResponse).find('Layer').each(function() {
            /** TODO: optimize ramdon function **/
            var rand = FM.Util.randomID();
            if ($(this).children("Name").text()) {

                //console.log($(this).children("Name").text() + ' | ' +  $(this).children("Title").text());
                $("#" + id).append("<div id='WMSLayer-"+ rand +"'>" + $(this).children("Title").text() + " + " +  $(this).children("Style").children("Name").text() + " <div>");
                //$("#" + id).append("<li> <a href='#'>" + $(this).children("Title").text() + " + " +  $(this).children("Style").children("Name").text() + "</a><li>");

                var layer = {};
                layer.layers= $(this).children("Name").text();
                layer.layername= $(this).children("Name").text();
                layer.layertitle=$(this).children("Title").text();
                layer.style = $(this).children("Style").children("Name").text();
                layer.urlWMS = wmsServerURL;
                layer.openlegend = true;

                // setting the default CRS of the map
                layer.srs = fenixmap.map.options.crs.code;

                $("#WMSLayer-" + rand).click({fenixmap:fenixmap, layer: layer}, function(event) {
                    var layer = new FM.layer(event.data.layer);
                    event.data.fenixmap.addLayerWMS(layer);
                });
            }
        });
    }
});