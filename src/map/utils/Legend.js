
FM.Legend = {

    getLegend: function(l, id, isReload) {

        var legendOptions = $.extend({
            forceLabels: 'on',
            forceRule: 'true',
            dx: '0',
            dy: '0',
            mx: '0',
            my: '0',
            fontAntiAliasing: 'true',
            fontColor: '0x47576F',
            bgColor: '0xF9F7F3',
            border: 'false',
            fontSize: '10'
        }, l.layer.legendOptions);

        // based on the layer type get the legendURL or Request
        $('#'+id+'-legend-layertitle').empty();
        $('#'+id+'-legendtitle').empty();
        $('#'+id+'-legendsubtitle').empty();
        $('#'+id+'-content').empty();

        if (l.layer.layertitle) {
            $('#'+id+'-legend-layertitle').append(l.layer.layertitle);
        }
        if (l.layer.legendtitle) {
            $('#'+id+'-legendtitle').append(l.layer.legendtitle);
        }
        if (l.layer.legendsubtitle) {
            $('#'+id+'-legendsubtitle').append(l.layer.legendsubtitle);
        }

        /* TODO: handle better, especially the l.layer.openlegend value*/
        var html = '';
        if (l.layer.legendHTML) {
            html = l.layer.legendHTML;
            $('#'+id+'-content').append(html);
        }
        else {
            var url = l.layer.urlWMS  + '?';
            url += '&service=WMS' +
                '&version=1.1.0' +
                '&REQUEST=GetLegendGraphic' +
                '&layer=' + l.layer.layers +
                '&Format=image/png';
                //'&LEGEND_OPTIONS=forceRule:True;dx:0.1;dy:0.1;mx:0.1;my:0.1;border:false;fontAntiAliasing:true;fontColor:0x47576F;fontSize:10;bgColor:0xF9F7F3';
            if (l.layer.style != null && l.layer.style != '' )
                url +=  '&style=' + l.layer.style;
            if (l.layer.sldurl )
                 url +=  '&sld=' + l.layer.sldurl;

            //LEGEND STYLE DOCS
            //http://goo.gl/MUIt8Z
            var alternativeUrl = url;

            url += '&LEGEND_OPTIONS=';
            for(var k in legendOptions) {
                url += k+':'+legendOptions[k]+';'
            }

            FM.Legend._loadLegend(url, alternativeUrl, id)
        }

        if ( isReload ) {
            if(($('#'+id+'-holder').is(":visible"))) {
                $('#'+id+'-holder').hide();
                $('#'+id+'-holder').slideDown();
                l.layer.openlegend = true;
            }
            else {
            }
        }
        else{
            if(!($('#'+id+'-holder').is(":visible"))) {
                $('#'+id+'-holder').slideDown();
                l.layer.openlegend = true;
            } else {
                $('#'+id+'-holder').slideUp();
                l.layer.openlegend = false;
            }
        }

        //$('#'+id+'-holder').draggable();
        $('#' + id+ '-remove').click({id:id + '-holder'}, function(event) {
            $('#' + event.data.id).slideUp();
            l.layer.openlegend = false;
        });
    },

    _loadLegend: function(url, alternativeUrl, id) {
        var img = new Image();
        img.name = url;
        img.src = url;

        var html = '<img id="'+id + '-img" src="'+ img.src +'" class="decoded">';
        img.onload = function() {
            $('#'+id+'-content').append(html);
            $('#'+id+'-img').css('width', this.width);
            $('#'+id+'-img').css('height', this.height);
        }
        img.onerror = function() {
            if ( alternativeUrl )
                FM.Legend._loadLegend(alternativeUrl, null, id)
            else
                FM.Legend._nolegend(id);
            // reload the image with different parameters (without legend_options)
            // if returns again error, then le legend is not available
            // '&LEGEND_OPTIONS=forceRule:True;dx:0.1;dy:0.1;mx:0.1;my:0.1;border:false;fontAntiAliasing:true;fontColor:0x47576F;fontSize:10;bgColor:0xF9F7F3'+
        }
    },

    _nolegend: function(id) {
        /** TODO: getLegendURl http://gis.stackexchange.com/questions/21912/how-to-get-wms-legendgraphics-using-geoserver-and-geowebcache **/
        var html = '<div class="fm-legend-layertitle">'+ $.i18n.prop('_nolegendavailable')+ '</div>';
        $('#'+id+'-content').append(html);
    }
    
}
