const helpers = require('@turf/helpers')
const xml2js = require('xml2js')
const proj4 = require('proj4')
const point = helpers.point
const polygon = helpers.polygon
const featureCollection = helpers.featureCollection

/**
 * Convert a LandXML file to GeoJSON
 */
function landxml2geojson(xml) {
    var result = {}

    var points = {}
    var polygons = []

    // Get CRS
    var projection = xml.LandXML.CoordinateSystem[0].$.datum
    var zone = xml.LandXML.CgPoints[0].$.zoneNumber

    // This will ONLY work for UTM projections... this is an issue, but more an issue with LandXML, which
    // doesn't use a normal way of defining the coordinate system. TODO: complain to the people who wrote that spec!
    var fromProjection = null
    if (projection && zone) {
        fromProjection = '+proj=utm +zone=' + zone + ' +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs ';
    }
    var toProjection = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    const originalPoints = xml.LandXML.CgPoints[0].CgPoint
    const originalParcels = xml.LandXML.Parcels[0].Parcel
    
    // Parse out the points
    for ( const pt in originalPoints) {
        var opt = originalPoints[pt]
        var name = opt.$.name.replace(/ /g,'');
        var coords = opt._.replace(/\r?\n?\t?/g, '').split(' ').map(coord => parseFloat(coord))
        coords = [coords[1], coords[0]]
        if (fromProjection && toProjection) {
            coords = proj4(fromProjection, toProjection, coords)
        }
        points[name] = coords
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
                        // Store the first coord, to put back on to close the polygon
                        endCoord = points[start]
                    }
                }
            }

            if (coords.length > 2) {
                coords.push(endCoord)
                coords = [coords]
                // name="101" class="Lot" state="proposed"  parcelType="Single"
                var parameters = {
                    name: opc.$.name,
                    class: opc.$.class,
                    state: opc.$.state,
                    parcelType: opc.$.parcelType
                }
                polygons.push(polygon(coords, parameters))
            } else {
                console.log("Couldn't create a polygon because we found less than 2 coords")
            }
        } else {
            console.log("No geometry")
        }
    }

    return featureCollection(polygons)
}

function parseParcels(parcel) {

}

exports["default"] = landxml2geojson
