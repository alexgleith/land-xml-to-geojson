# land-xml-to-geojson

This was an effort to write a LandXML to GeoJSON converter.

While it does work in a limited way, and only for the easy parcels, it will only work for simple cases where there are real world coordinates.

Also note that two cases are unhandled, currently: `Curves` and `IrregularLines`. TODO: implement some kind of solution for these!

##
To develop, set up the dependencies with `yarn` or `npm install`.

You can run the test with `yarn test` or `npm run test`.

(I took inspiration for the structure from Turf.js, thanks!)

###

One test file is from Victoria [www.spear.land.vic.gov.au](https://www.spear.land.vic.gov.au/spear/documents/eplan/PS619178.xml).

The other is from New South Wales.
