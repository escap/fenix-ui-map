// FMStyleCodePanel it's the panel used to write the code
(function() {
    var global = this;
    // widget constructor function
    global.FMStyleCSSPanel = function() {
        var o = {
            id: '',
            codePanel: new FMStyleCodePanel(), // new FMStyleCodePanel();
            l: '',
            defaultText: '',
            SLD: '',

            SUFFIX: FMStyleUtils.randomID(),
            ID_CODE_PANEL: "fm_style_code_panel_", // then should be added the suffix
            ID_APPLY_BTN: "fm_style_apply_btn_",
            SERVICE_CSS2SLD: 'http://168.202.28.214:8090/geoserver/CSS2SLD' //TODO move to a configuration file
        };

        var init = function(obj) {
            o = $.extend(true, {}, o, obj);
            createGUI();
        };

        var createGUI = function() {
            // creating GUI
            var gui = FMStyleUtils.replaceAll(FMStyleGUI.cssPanel, '{DEFAULT_TEXT}', o.defaultText);
            gui = FMStyleUtils.replaceAll(gui, 'REPLACE', o.SUFFIX);
            $('#' + o.id).html(gui);

            // creating Code Panel
            o.codePanel.init({id: o.ID_CODE_PANEL + o.SUFFIX})

            // apply style listener
            $('#' + o.ID_APPLY_BTN + o.SUFFIX).bind( "click", applyStyle);
        }

        var getCodePanelValue = function() {
           return o.codePanel.getValue();
        }

        var setLayer = function(l) {
            return o.l = l;
        }

        var applyStyle = function() {
            var data = {};
            data.stylename = o.l.layer.layers;
            data.style = getCodePanelValue();
            $.ajax({
                type : 'POST',
                url  : o.SERVICE_CSS2SLD,
                data : data,
                success : function(response) {
                    // this is to refresh the layer
                    // TODO use just one sld_body, the .leafletLayer.wmsParams.sld_body is the one actually used in leaflet
                    o.l.layer.sld_body = response;
                    o.l.leafletLayer.wmsParams.sld_body = response;
                    o.l.leafletLayer.redraw();
                    o.SLD = response;
                },
                error : function(err, b, c) {}
            });
        }

        return {
            init: init,
            applyStyle: applyStyle,
            setLayer: setLayer
        };
    };
})()
