FMCONFIG = {

    // fenix-maps-js config variables
    BASEURL: 'http://localhost:8080/fenix-map-js',

    //BASEURL_DEPENDENCIES: 'config/DEPENDENCIES.json',
    BASEURL_LANG: 'http://localhost:63342/FENIX-MAPS/fenix-map-js/dist/I18N/',

    // MAPS Servicies config variables
    BASEURL_MAPS: 'fenixapps.fao.org/maps',

    DEFAULT_WMS_SERVER: 'http://fenix.fao.org/geoserver',


    // BASEURL_MAPS: 'fenixapps.fao.org/maps',
    //BASEURL_MAPS: '168.202.23.224:8081/maps',
    MAP_SERVICE_SHADED: '/rest/service/sld2',
    MAP_SERVICE_POINT:  '/rest/service/sld2',
    MAP_SERVICE_GFI_JOIN: '/rest/service/joingfi',
    MAP_SERVICE_GFI_STANDARD: '/rest/service/request',
    MAP_SERVICE_ZOOM_TO_BOUNDARY: '/rest/service/bbox',
    MAP_SERVICE_WMS_GET_CAPABILITIES: '/rest/service/request',

    MAP_SERVICE_WPS_HISTOGRAM: '/rest/wps/hist',

    /** WDS configuration **/
    //BASEURL_WDS: 'http://fenix.fao.org/wdshm',
    // BASEURL_WDS: 'http://168.202.23.224:8082/wds',
    BASEURL_WDS: 'http://fenixapps.fao.org/wds',
    WDS_SERVICE_SPATIAL_QUERY: '/rest/geo/sq',

    // Map Store
    D3SP_SERVICE_SAVEMAP: 'http://fenixapps.fao.org/d3sp/service/msd/dm/dataset/',
    D3SP_SERVICE_LOADMAP: 'http://fenixapps.fao.org/d3sp/service/msd/dm/',


    WPS_SERVICE_HISTOGRAM: 'http://127.0.0.1:1235/wps/hist/'

};