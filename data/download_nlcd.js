// This script was run within Google Earth Engine
// Import the NLCD collection.
var dataset = ee.ImageCollection('USGS/NLCD_RELEASES/2019_REL/NLCD');

// This is the state boundary
// ma_shp is the name that I call raw/cb_2018_25_cousub_500k.shp
// on Google Earth Engine
var roi = ee.FeatureCollection("projects/downloadlandsat/assets/ma_shp");

// The collection contains images for multiple years and regions in the USA.
print('Products:', dataset.aggregate_array('system:index'));

// Filter the collection to the 2016 product.
var nlcd2016 = dataset.filterBounds(roi)
                      .filter(ee.Filter.eq('system:index', '2016'))
                      .first();

// Each product has multiple bands for describing aspects of land cover.
print('Bands:', nlcd2016.bandNames());

// Select the land cover band.
var landcover = nlcd2016.select('landcover').clip(roi);

// Display land cover on the map.
Map.setCenter(-95, 38, 5);
Map.addLayer(landcover, null, 'Landcover');

Export.image.toDrive({
    image: landcover,        
    fileNamePrefix: "NLCD_MA_2016", 
    folder: "gee",               
    scale:30,    
    description: "NLCD_MA_2016",
    maxPixels:1e13,                       
    region:roi.geometry().bounds(),
    fileFormat: "GeoTIFF",
    crs:"EPSG:2249"
  });
