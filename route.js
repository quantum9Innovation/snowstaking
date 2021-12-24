// This script contains route-finding algorithms employed by `./game.js`
// Only one function is exported*, which returns the shortest path from a given
// starting point to the desired destination.
//  *Excluding the `runTests()` function, which is only used during testing.


// Imports
import pkg from 'griddedjs'
const { Grid2D } = pkg


let label = (grid, allowed, dest, co) => {
    // Given a coordinate `co` on `grid`, label all allowed squares (specified 
    // by `allowed`) with an integer corresponding to `i+1`, where `i` is the 
    // integer of the previous square.
    // End Cases:
    // (1) No more allowed squares to jump to
    //     => Return `false`
    // (2) Successfully labeled all allowed squares
    //     => Return array of all labeled square coordinates
    // (3) Labeled destination square (`dest`)
    //     => Return `true`

    let x = co[0]; let y = co[1]
    let int = grid.cell(x, y).value + 1
    let labeled = []
    let out = false
    
    grid.cell(x, y).adjacent().forEach(c => {

        let ax = c.position().x; let ay = c.position().y

        if ( [ax, ay] == dest ) { out = true; return }
        else if ( allowed.cell(ax, ay).value && !c.value ) { 
            grid.cell(ax, ay).value = int
            labeled.push([ax, ay])
        }

    })

    if ( out ) { return true }
    else if ( labeled.length == 0 ) { return false }
    else { return labeled }

}

let backtrace = (grid, dest) => {
    // Given the `dest` coordinate of a labeled grid, backtrace the path
    // and return an array of coordinates. Each square on the grid should either 
    // be labeled `false` (if not reached by the path) or with an integer 
    // corresponding to the number of steps that square is away from the start.

    let x = dest[0]; let y = dest[1]
    let path = []
    let int = grid.cell(x, y).value

    while ( int != 1 ) {

        let found = false
        grid.cell(x, y).adjacent().forEach(c => {    

            let ax = c.position().x; let ay = c.position().y

            if ( grid.cell(ax, ay).value == int - 1 && !found ) { 
                path.push([ax, ay])
                x = ax; y = ay
                found = true
                int --
            }

        })

    }

    return path.reverse()

}

let findPath = (allowed, start, dest) => {
    // Given a `grid` and `allowed` grid, find the shortest path from `start`
    // to `dest`; runs `label` recursively until destination is found.
    // Return `false` if no path exists.
    // Return array of coordinates if path exists.

    // Initialize variables
    let x = start[0]; let y = start[1]
    let grid = new Grid2D(10, 10)
    grid.fill(false)
    grid.cell(x, y).value = 0
    let finish = false
    let labeled = label(grid, allowed, dest, [x, y])

    // Label the grid
    while ( !finish ) {

        let newlyLabeled = []

        for ( let i = 0; i < labeled.length; i++ ) {

            let ax = labeled[i][0]; let ay = labeled[i][1]
            let item = label(grid, allowed, dest, [ax, ay])
            
            if ( item == true ) { finish = true; break }
            else if ( item != false ) { newlyLabeled = newlyLabeled.concat(item) }

        }
    
        if ( newlyLabeled.length == 0 ) { finish = true }
        else { labeled = newlyLabeled }

    }

    if ( grid.cell(x, y).value ) { 
        return backtrace(grid, dest)
    } else { return false }

}


let runTests = () => {

    let allowed = new Grid2D(10, 10)
    allowed.fill(true)
    allowed.cell(3, 5).value = false

    let path = findPath(allowed, [5, 5], [0, 5])
    console.log(path)
    return true 

}


export { findPath, runTests }
