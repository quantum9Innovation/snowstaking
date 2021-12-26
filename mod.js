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

let grid2alpha = (x, y) => {
    let alpha = ''
    switch (x) {
        case 0: alpha = 'a'; break
        case 1: alpha = 'b'; break
        case 2: alpha = 'c'; break
        case 3: alpha = 'd'; break
        case 4: alpha = 'e'; break
        case 5: alpha = 'f'; break
        case 6: alpha = 'g'; break
        case 7: alpha = 'h'; break
        case 8: alpha = 'i'; break
        case 9: alpha = 'j'; break
    }
    return alpha + y
}
let alpha2grid = (alpha) => {
    let x = 0
    let y = 0
    switch (alpha[0]) {
        case 'a': x = 0; break
        case 'b': x = 1; break
        case 'c': x = 2; break
        case 'd': x = 3; break
        case 'e': x = 4; break
        case 'f': x = 5; break
        case 'g': x = 6; break
        case 'h': x = 7; break
        case 'i': x = 8; break
        case 'j': x = 9; break
    }
    y = parseInt(alpha[1])
    return [x, y]
}


// Exports
export {
    dump,
    read,
    meta,
    grid2alpha,
    alpha2grid
}
