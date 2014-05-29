FM.TileLayer = FM.Layer.extend({

    createTileLayer: function() {
       var tileTitle = 'TITLE_' + this.layer.lang.toUpperCase();
       var layer = FM.TILELAYER[this.layer.layername];
       this.layer.layertitle = {};
       this.layer.layertitle = layer[tileTitle];
       this.layer.layertype= 'TILE';
       var leafletLayer =  new L.TileLayer(layer.URL);
       return leafletLayer;
    }

});

FM.TileLayer.createBaseLayer = function (layername, lang) {
    var layer = {};
    layer.layername =layername;
    layer.layertype ='TILE';
    layer.lang = lang;
    var l = new FM.TileLayer(layer);
    l.leafletLayer = l.createTileLayer(layer.layername);
    return l;
};

// TODO: create a method to import an dependencies baselayer