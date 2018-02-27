const helpers = require('@turf/helpers')
const xml2js = require('xml2js')
const point = helpers.point
const polygon = helpers.polygon
const featureCollection = helpers.featureCollection

/**
 * Convert a LandXML file to GeoJSON
 */
function landxml2geojson(xml) {
    var result = {}
    console.dir(xml)

    var points = {}
    var polygons = []

    const originalPoints = xml.LandXML.CgPoints[0].CgPoint
    const originalParcels = xml.LandXML.Parcels[0].Parcel
    
    // Parse out the points
    for ( const pt in originalPoints) {
        var opt = originalPoints[pt]
        var name = opt.$.name.replace(/ /g,'');
        var coords = opt._.replace(/\r?\n?\t?/g, '').split(' ')
        points[name] = coords.map(coord => parseFloat(coord))
    }

    // Parse out the parcels
    for ( const pc in originalParcels) {
        var opc = originalParcels[pc]
        var geom = opc.CoordGeom
        if (geom !== undefined) {
            coords = []
            // Need to store the start to add at the end
            var endCoord = null
            var origCoords = opc.CoordGeom[0].Line

            for (oc in origCoords) {
                var start = origCoords[oc].Start[0].$.pntRef
                // We don't use the end
                var end = origCoords[oc].End[0].$.pntRef

                var startPoint = points[start]
                if (!startPoint) {
                    console.log('Failed to get start point', start, startPoint)
                } else {
                    // Start creating the polygon
                    coords.push(points[start])
                    if (!endCoord) {
                        console.log("Storing first coord")
                        // Store the first coord, to put back on to close the polygon
                        endCoord = points[start]
                    }
                }
            }

            if (coords.length > 0) {
                coords.push(endCoord)
                coords = [coords]
                console.log(coords)
                polygons.push(polygon(coords))
            } else {
                console.log("Couldn't create a polygon because we found no coords")
            }
        } else {
            console.log("No geom", opc)
        }
        console.log(polygons)
    }

    return featureCollection(polygons)
}

function parseParcels(parcel) {

}

exports["default"] = landxml2geojson
