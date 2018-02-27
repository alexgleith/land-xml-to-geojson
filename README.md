# land-xml-to-geojson

This was an effort to write a LandXML to GeoJSON converter.

While it does work in a limited way, and only for the easy parcels, I gave up because there is no relationship between a local horizontal datum and the 'real world' of GeoJSON coordinates in WGS84.

So, buyer beware. This is a harder thing to do than I thought!

##
To develop, set up the dependencies with `yarn` or `npm install`.

You can run the test with `yarn test` or `npm run test`.

(I took inspiration for the structure from Turf.js, thanks!)

###
I retrieved the one test XML file from [landxml.org](http://www.landxml.org/webapps/landxmlsamples.aspx).