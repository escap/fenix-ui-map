
FM.TileLayer = FM.Layer.extend({

  createTileLayer: function() {
    var tileTitle = 'TITLE_' + this.layer.lang.toUpperCase();
    var layer = (this.layer.layername)? FM.TILELAYER[this.layer.layername]: FM.TILELAYER[this.layer.layers];
    this.layer.layertype = 'TILE';
    this.layer.layertitle = {};
    this.layer.layertitle = layer[tileTitle];
    var leafletLayer =  new L.TileLayer(layer.URL);
    return leafletLayer;
  }

});

FM.TileLayer.createBaseLayer = function (layername, lang) {
    var layer = {};
    // this is replicated because in wms it's used "layers" instead of layername
    layer.layername = layername;
    layer.layers = layername;
    layer.layertype ='TILE';
    layer.lang = lang;
    var l = new FM.TileLayer(layer);
    l.leafletLayer = l.createTileLayer(layer.layername);
    return l;
};

// TODO: create a method to import an dependencies baselayer