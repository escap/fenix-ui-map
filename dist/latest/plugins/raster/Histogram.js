// Wrap code with module pattern.
(function() {
    var global = this;

    // widget constructor function
    global.FMHistogram = function() {
        var o = {
            chart: {
                //color: ['rgba(0, 0, 0, .5)'],
                id: '',
                series: '',
                decimalvalues: 1,
                chart_title: '',
                yaxis_title: '',
                xaxis_title: '',
                keyword: 'FAOSTAT_DEFAULT_LINE',

                // Chart Obj
                chartObj: ''
            },
            l: '', // layer
            map: '', // map if we want interact with the map
            callback: ''
        };

        // private instance methods
        var init = function(obj) {
            o = $.extend(true, {}, o, obj);
            createHistogram(o)
        };

        var createHistogram = function(o) {
            var url = FMCONFIG.WPS_SERVICE_HISTOGRAM + o.l.layer.layers;
            console.log(url)
            $.ajax({
                type : 'GET',
                url : url,
                success : function(response) {
                    response = (typeof response == 'string')? $.parseJSON(response): response;
                    parseHistogramResponse(response);
                },
                error : function(err, b, c) {}
            });
        };

        var parseHistogramResponse = function(response) {
            o.l.layer.histogram = {};
            o.l.layer.histogram.min = response.min;
            o.l.layer.histogram.max = response.max;
            o.l.layer.histogram.buckets = response.buckets;
            o.l.layer.histogram.values = response.values;
            console.log(response)
            o.chart.series = parseChartSeries(response.values);
            o.chart.categories = createCategories(response.min, response.max, response.buckets, o.chart.decimalvalues);

            createChart(o);
        }

        /** TODO: handle multiple raster bands **/
        var parseChartSeries = function(data) {
            var series = [];
            series.push({
                name: 'Histogram',
                data: data
            });
            return series;
        }

        var createCategories = function(min, max, buckets, decimalvalues) {
            // sum the absolute values of min max
            // |min|+|max| / buckets
            var categories = [];
            var step = (Math.abs(min) + Math.abs(max) ) / buckets
            while(min < max) {  //check if < or <= ??
                // TODO: check decimalvalues toFixed(0) why it doesn't work
                categories.push((decimalvalues)? min.toFixed(decimalvalues) : min);
                min = min + step;
            }
            //console.log(min)
            //console.log(max)
            //console.log(categories)
            //console.log(categories.length)
            if ( categories.length < buckets )  { }
            return categories;
        }

        var createChart = function() {
            var chart_payload = {};
            chart_payload.engine = 'highcharts';
            chart_payload.keyword = o.chart.keyword;
            chart_payload.renderTo = o.chart.id;

            chart_payload.title = o.chart.chart_title;
            chart_payload.legend = {};
            chart_payload.legend.enabled = true;

            chart_payload.yaxis = {};
            chart_payload.yaxis.title = o.chart.yaxis_title;
            chart_payload.xaxis = {};
            chart_payload.xaxis.title =  o.chart.xaxis_title;
            chart_payload.series = o.chart.series;
            chart_payload.categories = o.chart.categories;
            chart_payload.chart = {};
            chart_payload.chart.events = {};
            console.log(chart_payload);
            o.chart.chartObj = plotChart(chart_payload);
        }


        var plotChart = function(payload) {
            var chart = new Highcharts.Chart({
                chart : {
                    renderTo: payload.renderTo,
                    type: 'line',
                    zoomType : 'xy'
                },
                colors : FENIXCharts.COLORS,
                xAxis: {
                    categories: payload.categories,
                    minTickInterval: 10,
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: '9px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                title : {
                    text : payload.title
                },
                credits: {
                    position : {
                        align : 'left',
                        x : 10
                    },
                    text : payload.credits,
                    href : null
                },
                yAxis: {
                    min: payload.yaxis.min,
                    max: payload.yaxis.max,
                    tickInterval: payload.yaxis.tickInterval,
                    title : {
                        text: payload.yaxis.title
                    }
                },
                plotOptions : {
                    line : {
                        marker : {
                            enabled : false
                        }
                    }
                },
                tooltip : {
                    shared : true,
                    crosshairs: true
                },
                series: payload.series
            });
        }

        return {
            init: init
        };
    };

})();