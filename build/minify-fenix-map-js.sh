#!/bin/sh

uglify-js/bin/uglifyjs --overwrite --output fenix-map-min.js --no-copyright --stats --lint ../src/FENIXMap.js ../src/core/Class.js ../src/core/Util.js ../src/core/hashmap.js ../src/core/RequestHandler.js ../src/core/UIUtils.js ../src/core/WMSUtils.js ../src/core/fullscreen.js ../src/map/config/DEPENDENCIES.js ../src/map/constants/*.js ../src/map/Map.js ../src/map/utils/LayerLegend.js ../src/map/controller/MapControllerDraggable.js ../src/map/utils/*.js  ../src/map/layer/*.js ../src/map/gui/*.js ../src/plugins/FMPopUp.js
