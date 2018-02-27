const fs = require('fs')
const test = require('tape')
const path = require('path')
const load = require('load-json-file')
const write = require('write-json-file')
const xml2js = require('xml2js')

const landxml2geojson = require('./').default

const parser = new xml2js.Parser({ mergeAttrs: true })

function loadXml(filename) {
    console.log("Loading ", filename)
    var p = new xml2js.Parser()
    var sXMLData = fs.readFileSync(filename)
    var out = null

    p.parseString( sXMLData, ( err, result ) => { 
        var s = JSON.stringify( result, undefined, 3 )
        out = result
    })
    return out
}

const directories = {
    in: path.join(__dirname, 'test', 'in') + path.sep,
    out: path.join(__dirname, 'test', 'out') + path.sep
}

const fixtures = fs.readdirSync(directories.in).map(filename => {
    return {
        filename,
        name: path.parse(filename).name,
        xml: loadXml(directories.in + filename)
    }
})

test('landxml2json', t => {
    for (const fixture of fixtures) {
        const name = fixture.name
        const xml = fixture.xml

        const results = landxml2geojson(xml)

        if (process.env.REGEN) write.sync(directories.out + name + '.json', results)
        // t.equal(results, load.sync(directories.out + name + '.json'), name)
    }
    t.end()
})
