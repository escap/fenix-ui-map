FM.WMSSERVERS = {

    DEFAULT_EXTERNAL_WMS_SERVERS: [
        {
            label: 'FENIX Crops Area',
            label_EN: 'FENIX', // not currently used for the multilingual, it is needed?
            url: 'http://fenix.fao.org/demo/fenix/geoserver/earthstat/wms'
        },
        {
            label: 'Green Housegasses Data',
            label_EN: 'FENIX', // not currently used for the multilingual, it is needed?
            url: 'http://fenix.fao.org/demo/ghg/geoserver/wms'
        },
//        {
//            label: 'FENIX WMS Server',
//            label_EN: 'FENIX', // not currently used for the multilingual, it is needed?
//            url: 'http://fenixapps.fao.org/geoserver'
//        },
        {
            label: 'DATA.FAO.ORG',
            label_EN: 'data.fao.org WMS Server',
            //url: 'http://data.fao.org/maps/wms?AUTHKEY=d30aebf0-ab2a-11e1-afa6-0800200c9a66'
            url: 'http://data.fao.org/maps/wms'
        },
        {
            label: 'UNREDD Congo',
            label_EN: 'UNREDD Congo',
            url: 'http://rdc-snsf.org/diss_geoserver/gwc/service/wms'
        },
        {
            label: 'Wales OpenData',
            label_EN:  'Wales OpenData',
            url: 'http://inspire.wales.gov.uk/maps/ows'
        },
        {
            label: 'Scotland OpenData',
            label_EN:  'Scotland OpenData',
            url: 'http://sedsh127.sedsh.gov.uk/arcgis/services/ScotGov/StatisticalUnits/MapServer/WMSServer'
        },
        {
            label: 'Netherlands OpenData',
            label_EN:  'Netherlands OpenData',
            url: 'http://geodata.nationaalgeoregister.nl/ahn2/wcs'
        },
        {
            label: 'German OpenData',
            label_EN:  'German OpenData',
            url: 'http://geo.sv.rostock.de/geodienste/verwaltung/wms'
        },
//        {
//            label: 'De Agostini of',
//            label_EN:  'De Agostini',
//            url: 'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/de_agostini.map'
//        },
        {
            label: 'ENVIRONMENT OpenData',
            label_EN:  'Scotland OpenData',
            url: 'http://lasigpublic.nerc-lancaster.ac.uk/ArcGIS/services/Biodiversity/GMFarmEvaluation/MapServer/WMSServer'
        },
        {
            label: 'OpenGeo Demo Server',
            label_EN: 'OpenGeo Demo Server',
            url: 'http://demo.opengeo.org/geoserver/ows'
        },
        //{
        //    label: 'HarvestChoice 1',
        //    label_EN: 'HarvestChoice 1',
        //    url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_1/MapServer/WMSServer'
        //},
        //{
        //    label: 'HarvestChoice 2',
        //    label_EN: 'HarvestChoice 2',
        //    url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_2/MapServer/WMSServer'
        //},
        //{
        //    label: 'HarvestChoice 3',
        //    label_EN: 'HarvestChoice 3',
        //    url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_3/MapServer/WMSServer'
        //},
        //{
        //    label: 'HarvestChoice 4',
        //    label_EN: 'HarvestChoice 4',
        //    url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_4/MapServer/WMSServer'
        //},
        //{
        //    label: 'HarvestChoice 5',
        //    label_EN: 'HarvestChoice 5',
        //    url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_5/MapServer/WMSServer'
        //},
        //{
        //    label: 'HarvestChoice 6',
        //    label_EN: 'HarvestChoice 6',
        //    url: 'http://apps.harvestchoice.org/arcgis/services/MapServices/cell_values_6/MapServer/WMSServer'
        //},
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
        {
            label: 'Vienna OpenData',
            label_EN:  'Vienna OpenData',
            url: 'http://data.wien.gv.at/daten/wms'
        },
        {
            label: 'Vienna OpenData',
            label_EN:  'Vienna OpenData',
            url: 'http://data.wien.gv.at/daten/wms'
        }
        /*,
        {
            label: 'toscana',
            label_EN: 'Cubewerx Map Service',
            url: 'http://eusoils.jrc.ec.europa.eu/wrb/wms_Threats.asp'
        }*/


/*        ,{
            label: 'OCHA Map Service',
            label_EN: 'OCHA Map Service',
            url: 'http://carto.iict.ch/geoserver/wms',
            urlParameters: 'service=WMS'  // used as additional parameters
        }*/

    ]
}

