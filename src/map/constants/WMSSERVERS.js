FM.WMSSERVERS = {

    DEFAULT_EXTERNAL_WMS_SERVERS: [
        {
            label: 'FENIX WMS Server',
            label_EN: 'FENIX', // not currently used for the multilingual, it is needed?
            url: 'http://fenixapps.fao.org/geoserver'
        },
        {
            label: 'DATA FAO ORG',
            label_EN: 'DATA FAO ORG',
            //url: 'http://data.fao.org/maps/wms?AUTHKEY=d30aebf0-ab2a-11e1-afa6-0800200c9a66'
            url: 'http://data.fao.org/maps/wms'
        },
        {
            label: 'UNREDD Congo',
            label_EN: 'UNREDD Congo',
            //url: 'http://rdc-snsf.org/diss_geoserver/gwc/service/wms'
            url: 'http://rdc-snsf.org/diss_geoserver/gwc/service/wms'
        },
        {
            label: 'OpenGeo Demo Server',
            label_EN: 'OpenGeo Demo Server',
            url: 'http://demo.opengeo.org/geoserver/ows'
        },
        {
            label: 'HarvestChoice 1',
            label_EN: 'HarvestChoice 1',
            url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_1/MapServer/WMSServer'
        },
        {
            label: 'HarvestChoice 2',
            label_EN: 'HarvestChoice 2',
            url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_2/MapServer/WMSServer'
        },
        {
            label: 'HarvestChoice 3',
            label_EN: 'HarvestChoice 3',
            url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_3/MapServer/WMSServer'
        },
        {
            label: 'HarvestChoice 4',
            label_EN: 'HarvestChoice 4',
            url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_4/MapServer/WMSServer'
        },
        {
            label: 'HarvestChoice 5',
            label_EN: 'HarvestChoice 5',
            url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_5/MapServer/WMSServer'
        },
        {
            label: 'HarvestChoice 6',
            label_EN: 'HarvestChoice 6',
            url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_6/MapServer/WMSServer'
        },
        {
            label: 'Alberts Map Service',
            url: 'http://maps.gov.bc.ca/arcserver/services/Province/albers_cache/MapServer/WMSServer',
            urlParameters: 'service=WMS'  // used as additional parameters
        },
        {
            label: 'Cubert Map Service',
            label_EN: 'Cubert',
            url: 'http://portal.cubewerx.com/cubewerx/cubeserv/cubeserv.cgi'
        },
        {
            label: 'GP Map Service',
            label_EN: 'gp map service201',
            url: 'http://geoportal.logcluster.org:8081/gp_map_service201/wms'
        },


/*        ,{
            label: 'OCHA Map Service',
            label_EN: 'OCHA Map Service',
            url: 'http://carto.iict.ch/geoserver/wms',
            urlParameters: 'service=WMS'  // used as additional parameters
        }*/

    ]
}

