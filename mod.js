// Collection of miscellaneous modules for use by other scripts
//  Imports listed below:
import * as fs from 'fs'
import pkg from 'griddedjs'
const { Grid2D } = pkg


// Modules
let dump = (grid, type, id) => {
    // Dump the map to a file
    // Only applicable for certain game objects

    let data = []
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            data.push(grid.cell(col, row).value)
        }
    }

    fs.writeFileSync(`data/${type}${id}.json`, JSON.stringify(data))

}

let read = (type, id) => {
    // Read any dumped data from a file
    // Universal for all game objects

    let data = fs.readFileSync(`data/${type}${id}.json`, 'utf8')
    data = JSON.parse(data)

    let map = new Grid2D(10, 10)

    for ( let row = 0; row < 10; row++ ) {
        for ( let col = 0; col < 10; col++ ) {
            map.cell(col, row).value = data[row * 10 + col]
        }
    }

    return map

}

let meta = (array, player, id, mode) => {
    // Dump the meta data to a file and read
    // Only applicable for player location data
    
    if (mode == 'r') {
        let data = fs.readFileSync(`data/meta${player}-${id}.json`)
        data = JSON.parse(data)
        return data
    } else if (mode == 'w') {
        fs.writeFileSync(`data/meta${player}-${id}.json`, JSON.stringify(array))
    }

}


// Exports
export {
    dump,
    read,
    meta
}
