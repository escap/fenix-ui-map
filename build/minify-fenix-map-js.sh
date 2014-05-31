#!/bin/sh

# distributino folder (in case use 0.1 etc)
DISTRIBUTION_FOLDER=../dist/latest
mkdir -p $DISTRIBUTION_FOLDER

# Create a demo folder with the files placed in ../projects
CREATE_DEMO_FILES=true
DEMO_FOLDER=projects


# TODO: use a variable for the files (or an external source)
uglify-js/bin/uglifyjs --overwrite --output fenix-map-min.js --no-copyright --stats --lint ../src/FENIXMap.js ../src/core/Class.js ../src/core/Util.js ../src/core/hashmap.js ../src/core/RequestHandler.js ../src/core/UIUtils.js ../src/core/WMSUtils.js ../src/core/fullscreen.js ../src/map/config/DEPENDENCIES.js ../src/map/constants/*.js ../src/map/Map.js ../src/map/utils/LayerLegend.js ../src/map/controller/MapControllerDraggable.js ../src/map/utils/*.js  ../src/map/layer/*.js ../src/map/gui/*.js ../src/plugins/FMPopUp.js

# move the library to the dist folder
cp fenix-map-min.js $DISTRIBUTION_FOLDER

# add a boolean to check if copy all or not
cp -r ../src/plugins/ $DISTRIBUTION_FOLDER
cp -r ../dist/css/* $DISTRIBUTION_FOLDER
cp -r ../dist/I18N $DISTRIBUTION_FOLDER

# this is the configuration file (usually should be at application level)
cp ../src/fenix-map-config.js $DISTRIBUTION_FOLDER

# remove file that hass been created
rm fenix-map-min.js

if [ $CREATE_DEMO_FILES = true ]
then
    # FOLDER OF THE PROJECTS to move to demo
    FOLDER_PATH=../projects/

    #FOLDERS=$(find $FOLDER_PATH -type d | sort | awk '$0 !~ last "/" {print last} {last=$0} END {print last}')
    FOLDERS=$(find $FOLDER_PATH -type d)
    for FOLDER in $FOLDERS
    do
        #echo $FOLDER
        DEST_FOLDER=${FOLDER:11}
        #echo $DEST_FOLDER

        # destination folder
        DESTINATION_FOLDER=$DISTRIBUTION_FOLDER/$DEMO_FOLDER/$DEST_FOLDER/

#        echo "DESTINATION FOLDER"
#        echo $FOLDER
#        echo $DESTINATION_FOLDER

        # create folder (if it doesn't exists yet)
        rm $DESTINATION_FOLDER -Rf
        mkdir -p $DESTINATION_FOLDER

        FILES=$FOLDER/*

        for f in $FILES
        do
            if [ -f "$f" ]
            then
                filename="${f##*/}"
                #echo $filename

                #temporary file created
                TMP=$DESTINATION_FOLDER$filename.tmp

                #final destination path of the file
                DEFNITITIVE_PATH=$DESTINATION_FOLDER$filename

                #changing css folder
                # 's/dist\/css\///g'
                # /dist\/css\/ is the String to find
                # the second / is the String to change with, that is EMPTY
                sed "s/dist\/css\///g" $f | tee $TMP >/dev/null
                # echo $TMP

                #changing javascript folder
                TMP2=$DESTINATION_FOLDER$filename.tmp2
                sed "s/dist\/latest\///g" $TMP | tee $TMP2 >/dev/null
                # echo $DEFNITITIVE_PATH

                #changing plugins folder
                sed "s/src\/plugins\//plugins\//g" $TMP2 | tee $DEFNITITIVE_PATH >/dev/null
                # echo $DEFNITITIVE_PATH

                #remove tmp file
                rm $TMP
                rm $TMP2
            fi
        done
    done
fi