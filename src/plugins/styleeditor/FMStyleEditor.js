// Wrap code with module pattern.
(function() {
    var global = this;

    // widget constructor function
    global.FMStyleEditor = function() {

        var o = {

        };

        // private instance methods
        var init = function(obj) {
            o = $.extend(true, {}, o, obj);
            switch(o.chart.datatype.toUpperCase()) {
                case 'CSV': createFromCSV(o.chart.data, o.chart.delim); break;
                case 'JSON': createFromJSON(o, o.chart.data); break;
                default: createFromJSON(o.chart.data); break;
            }
        };

        // public instance methods
        return {
            init: init,
            linkSlaveCharts: linkSlaveCharts,
            removeEventsExceptMaps: removeEventsExceptMaps,
            removeAllEvents: removeAllEvents,
            highlightChartValues: highlightChartValues,
            getObj: function()    {return o;},
            getChart: function()  {return o.chart;},
            getSuffix: function() { return o.suffix;}
        };
    };

})();