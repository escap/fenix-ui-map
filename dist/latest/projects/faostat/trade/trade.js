
var FAOSTATTrade = (function() {

    var o = {
        lang: 'E',
        item: {
            id: 'item',
            defaultcode: '',
            url: 'items/faostat2/TM/E',
            callback: '',
            width: '250px',
            chosenOptions: {disable_search_threshold:10, no_results_text: "Nothing found"}
        },
        area: {
            id: 'area',
            defaultcode: '',
            url: 'countries/faostat2/TM/E',
            callback: '',
            width: '250px',
            chosenOptions: {disable_search_threshold:10, no_results_text: "Nothing found"}
        },
        year: {
            fromyear: {
                url: 'years/faostat2/TM/E',
                id:  'fromyear',
                defaultcode: '2005',
                callback: '',
                width: '70px',
                chosenOptions: {disable_search_threshold: 10, no_results_text: "Nothing found"}
            },
            toyear: {
                url: 'years/faostat2/TM/E',
                id:  'toyear',
                defaultcode: '2010',
                callback: '',
                width: '70px',
                chosenOptions: {disable_search_threshold: 10, no_results_text: "Nothing found"}
            }
        },
        elements: [
            {
               // code: '5610,5608,5609,5607'
                code: '5622'
            },
            {
                //code: '5910,5908,5909,5907'
                code: '5922'
            }
        ],
        wdsurl: 'http://faostat3.fao.org/bletchley/rest/codes/',
        datasource: 'faostat2',
        domain: 'TP',
        maps: [
             {
               id: 'importmap-growthrate',
               id_container: 'importmap-container',
               id_nodata: 'importmap-nodata',
               title: 'Import Value',
               measurementunit: 'Growth Rate (&#37;)',
               fenixmap: '',
               colorramp: 'YlOrRd',
               colors: '1a9850,66bd63,a6d96a,d9ef8b,ffffbf,fee08b,fc8d59,d73027',
               l: {
                   layer: { layertitle : 'test'}
               }

            },
            {
                id: 'exportmap-growthrate',
                id_container: 'exportmap-container',
                id_nodata: 'exportmap-nodata',
                title: 'Export Value',
                measurementunit: 'Growth Rate (&#37;)',
                colorramp: 'YlGn',
                colors: 'd73027,fc8d59,fee08b,ffffbf,d9ef8b,a6d96a,66bd63,1a9850',
                fenixmap: '',
                l: {
                    layer: { layertitle : 'test'}
                }
            }
        ]
    }

    /*
    var sql = {"selects":[
        {"aggregation":"NONE","column":"DOM.DomainNameE","alias":"Domain"},
        {"aggregation":"NONE","column":"A1.AreaNameE","alias":"Reporter_Country"},
        {"aggregation":"NONE","column":"D.ReporterAreaCode","alias":"Reporter_Country_Code"},
        {"aggregation":"NONE","column":"A2.AreaNameE","alias":"Partner_Country"},
        {"aggregation":"NONE","column":"D.PartnerAreaCode","alias":"Partner_Country_Code"},
        {"aggregation":"NONE","column":"I.ItemNameE","alias":"Item"},
        {"aggregation":"NONE","column":"D.ItemCode","alias":"Item_Code"},
        {"aggregation":"NONE","column":"E.ElementNameE","alias":"Element"},
        {"aggregation":"NONE","column":"D.ElementCode","alias":"Element_Code"},
        {"aggregation":"NONE","column":"D.Year","alias":"Year"},
        {"aggregation":"NONE","column":"E.UnitNameE","alias":"Unit"},
        {"aggregation":"NONE","column":"D.Value","alias":"Value"}],
        "froms":[{"column":"TradeMatrix","alias":"D"},{"column":"Item","alias":"I"},{"column":"Element","alias":"E"},{"column":"Area","alias":"A1"},{"column":"Area","alias":"A2"},{"column":"Domain","alias":"DOM"}],
        "wheres":[{"datatype":"TEXT","column":"D.DomainCode","operator":"=","value":"TM","ins":[]},
            {"datatype":"TEXT","column":"DOM.DomainCode","operator":"=","value":"TM","ins":[]},
            {"datatype":"DATE","column":"D.ReporterAreaCode","operator":"=","value":"A1.AreaCode","ins":[]},
            {"datatype":"DATE","column":"D.PartnerAreaCode","operator":"=","value":"A2.AreaCode","ins":[]},
            {"datatype":"DATE","column":"D.DomainCode","operator":"=","value":"DOM.DomainCode","ins":[]},
            {"datatype":"DATE","column":"D.ItemCode","operator":"=","value":"I.ItemCode","ins":[]},
            {"datatype":"DATE","column":"D.ElementCode","operator":"=","value":"E.ElementCode","ins":[]},
            {"datatype":"TEXT","column":"D.ElementCode","operator":"IN","value":"E.ElementCode","ins":[5910]},
            {"datatype":"TEXT","column":"D.ReporterAreaCode","operator":"IN","value":"A1.AreaCode","ins":[9]},
            //{"datatype":"TEXT","column":"D.PartnerAreaCode","operator":"IN","value":"A2.AreaCode","ins":[2,3,4,5,7,8,9,1,22,10,11,52,12,13,16,14,57,255,15,23,53,17,18,20,21,239,26,27,233,29,35,115,32,33,36,37,39,40,96,128,41,214,44,45,46,47,48,107,98,49,50,167,51,116,250,54,72,55,56,58,59,60,61,178,63,238,62,65,64,66,67,68,70,74,75,73,79,81,84,86,88,89,90,175,91,93,95,97,99,100,101,102,103,104,105,106,109,110,112,108,114,83,118,113,120,119,121,122,123,124,126,256,129,130,131,132,133,134,136,137,138,141,273,143,144,28,147,148,149,150,151,153,156,157,158,159,160,161,162,299,221,164,165,166,168,169,170,171,173,174,179,117,146,183,185,184,188,189,190,191,244,193,194,195,272,186]},
            {"datatype":"TEXT","column":"D.ItemCode","operator":"IN","value":"I.ItemCode","ins":[176]},
            // {"datatype":"TEXT","column":"D.Year","operator":"IN","value":"D.Year","ins":[2011,2010,2009,2008]}],
            {"datatype":"TEXT","column":"D.Year","operator":">=","value":"1997","ins":[]},
            {"datatype":"TEXT","column":"D.Year","operator":"<=","value":"2002","ins":[]}
        ],
        "orderBys":[
            //{"column":"D.Year","direction":"DESC"},
            //{"column":"A1.AreaNameE","direction":"ASC"},
            {"column":"A2.AreaNameE","direction":"ASC"},
            {"column":"D.Year","direction":"ASC"}
            // {"column":"I.ItemNameE","direction":"ASC"},
            // {"column":"E.ElementNameE","direction":"ASC"}
        ],
        "limit":null,"query":null,
        "frequency":"NONE"}
         */


    var sql =
    {"selects":[
        {"aggregation":"NONE","column":"DOM.DomainName_$lang","alias":"Domain"},
        {"aggregation":"NONE","column":"A1.AreaName_$lang","alias":"Reporter_Country"},
        {"aggregation":"NONE","column":"D.ReporterAreaCode","alias":"Reporter_Country_Code"},
        {"aggregation":"NONE","column":"A2.AreaName_$lang","alias":"Partner_Country"},
        {"aggregation":"NONE","column":"D.PartnerAreaCode","alias":"Partner_Country_Code"},
        {"aggregation":"NONE","column":"I.ItemName_$lang","alias":"Item"},
        {"aggregation":"NONE","column":"D.ItemCode","alias":"Item_Code"},
        {"aggregation":"NONE","column":"E.ElementName_$lang","alias":"Element"},
        {"aggregation":"NONE","column":"D.ElementCode","alias":"Element_Code"},
        {"aggregation":"NONE","column":"D.Year","alias":"Year"},
        {"aggregation":"NONE","column":"E.UnitName_$lang","alias":"Unit"},
        {"aggregation":"NONE","column":"D.Value","alias":"Value"}],
        "froms":[{"column":"TradeMatrix","alias":"D"},{"column":"Item","alias":"I"},{"column":"Element","alias":"E"},{"column":"Area","alias":"A1"},{"column":"Area","alias":"A2"},{"column":"Domain","alias":"DOM"}],
        "wheres":[{"datatype":"TEXT","column":"D.DomainCode","operator":"=","value":"TM","ins":[]},
            {"datatype":"TEXT","column":"DOM.DomainCode","operator":"=","value":"TM","ins":[]},
            {"datatype":"DATE","column":"D.ReporterAreaCode","operator":"=","value":"A1.AreaCode","ins":[]},
            {"datatype":"DATE","column":"D.PartnerAreaCode","operator":"=","value":"A2.AreaCode","ins":[]},
            {"datatype":"DATE","column":"D.DomainCode","operator":"=","value":"DOM.DomainCode","ins":[]},
            {"datatype":"DATE","column":"D.ItemCode","operator":"=","value":"I.ItemCode","ins":[]},
            {"datatype":"DATE","column":"D.ElementCode","operator":"=","value":"E.ElementCode","ins":[]},
            {"datatype":"TEXT","column":"D.ElementCode","operator":"IN","value":"E.ElementCode","ins":["_$elementcode"]},
            {"datatype":"TEXT","column":"D.ReporterAreaCode","operator":"IN","value":"A1.AreaCode","ins":["_$reporterareacode"]},
            {"datatype":"TEXT","column":"D.ItemCode","operator":"IN","value":"I.ItemCode","ins":["_$itemcode"]},
            {"datatype":"TEXT","column":"D.Year","operator":">=","value":"_$fromyear","ins":[]},
            {"datatype":"TEXT","column":"D.Year","operator":"<=","value":"_$toyear","ins":[]}
        ],
        "orderBys":[
            {"column":"A2.AreaNameE","direction":"ASC"},
            {"column":"D.Year","direction":"ASC"}
        ],
        "limit":null,"query":null,
        "frequency":"NONE"}



    function init(obj){
        o = $.extend(true, {}, o, obj);

        // load codes
        loadCode(o.item);
        loadCode(o.area);
        loadCode(o.year.fromyear)
        loadCode(o.year.toyear)

        // onclick
        $('#apply').click(function() {
            fetchCodes();
        });

    };

    function applyJoin(m, joindata) {
        $('#' +m.id).empty();
        // Create Maps and layers
        if ( joindata.length <= 2 ) {  // because here it is a string TODO: make the test before to stringfy
            $('#' +m.id_container).show();
            $('#' +m.id).hide();
            $('#' +m.id_nodata).show();
        }
        else {
            m.fenixmap = createMap(m.id);
            m.l = createLayer(m.l.layer, m);
            m.l.layer.joindata = joindata;
            m.fenixmap.addLayer(m.l)
            $('#' +m.id_nodata).hide();
            $('#' +m.id_container).show();
            $('#' +m.id).show();
            m.fenixmap.map.invalidateSize();
            syncMaps();
        }
    }

    /** TODO: optimize the function **/
    function syncMaps() {
        if (o.maps[0].fenixmap.map && o.maps[1].fenixmap.map) {
            o.maps[0].fenixmap.syncOnMove(o.maps[1].fenixmap);
            o.maps[1].fenixmap.syncOnMove(o.maps[0].fenixmap);
            //o.maps[0].fenixmap.map.sync(o.maps[1].fenixmap.map);
           // o.maps[1].fenixmap.map.sync(o.maps[0].fenixmap.map);
        }
    }

    function loadCode(obj) {
        var url = o.wdsurl + obj.url;
        $.ajax({
            type : 'GET',
            url : url,
            success : function(response) {
                response = (typeof data == 'string')? $.parseJSON(response): response;
                createDD(response, obj);
            },
            error : function(err, b, c) {}
        });
    };

    function loadYear() {
        var url = o.wdsurl + o[type].url;
        $.ajax({
            type : 'GET',
            url : url,
            success : function(response) {
                response = (typeof data == 'string')? $.parseJSON(response): response;
                createDDFromYear(response, type)
                createDDToYear(response, type)
            },
            error : function(err, b, c) {}
        });
    };


    function createDD(json, obj, callback) {

        var html = '<select id="'+ obj.id +'-select" style="width:'+ obj.width +';" class="">';
        //html += '<option value=""></option>';
        for(var i=0; i < json.length; i++) {
            var selected = (json[i].code == obj.defaultcode)? 'selected': '';
            html += '<option value='+  json[i].code + ' '+ selected +'>'+json[i].label +'</option>';
        }
        html += '</select>';

        $('#' + obj.id).empty();
        $('#' + obj.id).append(html);


        try {
            $('#' + obj.id + '-select').chosen(obj.chosenOptions);

        }  catch (e) {
            console.log('chosen error')
        }
    };

    function fetchCodes() {
      o.item.code = $("#" + o.item.id + '-select').val();
      o.area.code = $("#" + o.area.id + '-select').val();
      o.year.fromyear.code = $("#" + o.year.fromyear.id + '-select').val();
      o.year.toyear.code = $("#" + o.year.toyear.id+ '-select').val();
      queryData(o.elements[0].code, o.maps[0]); // import
      queryData(o.elements[1].code, o.maps[1]); // export
    }

    function queryData(elementcode, m) {

        var sqlString = JSON.stringify(sql);
        sqlString = replaceAll(sqlString, '_$lang', o.lang)
        sqlString = replaceAll(sqlString, '_$itemcode', o.item.code);
        sqlString = replaceAll(sqlString, '_$reporterareacode', o.area.code);
        sqlString = replaceAll(sqlString, '_$fromyear', o.year.fromyear.code);
        sqlString = replaceAll(sqlString, '_$toyear', o.year.toyear.code);
        sqlString = replaceAll(sqlString, '_$elementcode', elementcode);

        var data = {};
        data.datasource = 'faostat2';
        data.thousandSeparator = ',';
        data.decimalSeparator = '.';
        data.decimalNumbers = '2';
        data.json = sqlString

        $.ajax({
            type : 'POST',
            url : 'http://faostat3.fao.org/wds/rest/table/json',
            data: data,
            success : function(response) {

                var data = (typeof response == 'string')? $.parseJSON(response): response;
                if ( data.length <= 0 ) {
                   // console.log(m)
                  applyJoin(m, data)
                }
                else {
                    var label = data[0][4];
                    var labels = [];
                    labels.push(label);
                    var numbers = [];
                    var matrix = [];
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][4] == label) {
                            if ( data[i][11] != 0 ) numbers.push(data[i][11]);
                        } else {
                            label = data[i][4];

                            if ( numbers.length > 0) {
                                labels.push(label);
                                matrix.push(numbers);
                            }
                            numbers = [];
                            if ( data[i][11] != 0 ) numbers.push(data[i][11]);
                        }
                    }
                    if ( numbers.length > 0) matrix.push(numbers);

                    createMultipleGrowthRate(labels, matrix, m)
                }

            },
            error : function(err, b, c) {}
        });
    };


    function createMultipleGrowthRate(labels, matrix, m) {
        var data = {};
        data.labels = JSON.stringify(labels);
        data.json = JSON.stringify(matrix);
        $.ajax({
            type: 'POST',
            url: 'http://faostat3.fao.org/r/rest/eval/multiplegrowthrate',
            data: data,
            success: function (response) {
                var data = (typeof response == 'string')? $.parseJSON(response): response;
                var joindata = parseJoindataResponse(data)
                applyJoin(m, joindata);
            },
            error: function (err, b, c) {
                // console.log(err.status + ", " + b + ", " + c);
            }
        });
    };

    function parseJoindataResponse(json) {
        var joindata = [];
        for(var i=0; i < json.length; i++) {
            if ( json[i][1] != "NaN") { //TODO make it nicer
                var o = {}
                o[json[i][0]] = json[i][1]
                joindata.push(o);
            }
        }
        return JSON.stringify(joindata);
    }

    function createMap(mapID) {
        var options = {
            plugins: {
                geosearch : false,
                mouseposition: false,
                controlloading : true,
                zoomControl: 'bottomright'
            },
            guiController: {
                overlay : true,
                baselayer: true,
                wmsLoader: true
            },
            gui: {
                disclaimerfao: true
                //,fullscreenID: 'content'
            }
        }

        var mapOptions = {
            zoomControl:false,
            attributionControl: false
        };

        var m = new FM.Map(mapID, options, mapOptions);
        m.createMap();

        return m;
    }

    function createLayer(o, m) {

        var layer = FMDEFAULTLAYER.getLayer('GAUL0_FAOSTAT', true, 'Growth Rate %');

        layer.layertitle = m.title;
        layer.measurementunit = m.measurementunit;
        layer.legendtitle=m.measurementunit;
        layer.mu = "";
        layer.opacity='0.9'



        layer.addborders='true'
        layer.borderscolor='FFFFFF'
        layer.bordersstroke='0.8'
        layer.bordersopacity='0.4'

        layer.visibility=true;

        layer.srs = 'EPSG:3857';
        layer.layertype = 'JOIN';
        layer.lang='en'; // dynamic
        layer.jointype='shaded';
        layer.defaultgfi = true;
        layer.openlegend = true;
        layer.decimalnumbers='0';

        layer.colorramp= m.colorramp;
        layer.intervals= '5';

       // layer.classification= 'custom';
        //layer.ranges='-30,-20,-10,0,10,20,30';
        //layer.colors= m.colors;
        // layer.colors='d73027,fc8d59,fee08b,ffffbf,d9ef8b,a6d96a,66bd63,1a9850';


        var l = new FM.layer(layer, m.fenixmap);
        return l;
    }

    function replaceAll(text, stringToFind, stringToReplace) {
        var temp = text;
        var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
    }

    function noDataAvailable(id) {
        //var html = '<div>No Data Available</div>'
        //$('#' + id).append(html);
       // $('#' +id).show();
        //var html = '<select id="'+ obj.id +'-select" style="width:'+ obj.width +';" class="">';
    }


    return {
        init : init
    }

})();