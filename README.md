# land-xml-to-geojson

This was an effort to write a LandXML to GeoJSON converter.

While it does work in a limited way, and only for the easy parcels, it will only work for simple cases where there are real world coordinates.

Also note that two cases are unhandled, currently: `Curves` and `IrregularLines`. TODO: implement some kind of solution for these!

## Usage
To use it, you'll need to get an XML file loaded as a string, and then pass it in, like this:

    conxt xml = '<?xml version="1.0" encoding="iso-8859-1" ?>'  // This should be valid land-xml
    const landxml2geojson = require('land-xml-to-geojson')
    const geoJson = landxml2geojson.convert(xml)

For another example of loading an XML file, see the `test.js` file.

## Development
To develop, set up the dependencies with `yarn` or `npm install`.

You can run the test with `yarn test` or `npm run test`.

(I took inspiration for the structure from Turf.js, thanks!)

## Attribution

One test file is from Victoria [www.spear.land.vic.gov.au](https://www.spear.land.vic.gov.au/spear/documents/eplan/PS619178.xml).

The other is from New South Wales.
