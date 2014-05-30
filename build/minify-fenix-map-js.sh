#!/bin/sh

# TODO: use it
# dist_folder = ../dist/0.2/


# TODO: use a variable for the files (or an external source)
uglify-js/bin/uglifyjs --overwrite --output fenix-map-min.js --no-copyright --stats --lint ../src/FENIXMap.js ../src/core/Class.js ../src/core/Util.js ../src/core/hashmap.js ../src/core/RequestHandler.js ../src/core/UIUtils.js ../src/core/WMSUtils.js ../src/core/fullscreen.js ../src/map/config/DEPENDENCIES.js ../src/map/constants/*.js ../src/map/Map.js ../src/map/utils/LayerLegend.js ../src/map/controller/MapControllerDraggable.js ../src/map/utils/*.js  ../src/map/layer/*.js ../src/map/gui/*.js ../src/plugins/FMPopUp.js

# move the library to the dist folder
cp fenix-map-min.js ../dist/0.2/

# add a boolean to check if copy all or not
cp -r ../src/plugins/ ../dist/0.2/
cp -r ../dist/css/* ../dist/0.2/
cp -r ../dist/I18N ../dist/0.2/

# remove file that is created
rm fenix-map-min.js