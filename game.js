// Here lies the core logic behind the game.
//  This script is invoked each time `index.js` receives a request.


// Imports
//  CommonJS modules imported differently for compatibility reasons.
import * as fs from 'fs'
import * as mod from './mod.js'
import * as route from './route.js'
import pkg from 'griddedjs'
const { Grid2D } = pkg
import pkg2 from 'canvas'
const { createCanvas } = pkg2


// Initializers
let generateMap = (id) => {
    // Initialize the map
    //  0 => Player A (right)
    //  1 => Player B (left)

    let map = new Grid2D(10, 10)
    map.fill(0)
    
    let rows = [...map.getY()];
    let cols = [...map.getX()];
    
    for (let col = 0; col < cols.length / 2; col++) {
        for (let row = 0; row < rows.length; row++) {
            map.cell(col, row).value = 1
        }
    }

    mod.dump(map, 'map', id)

}

let generateObj = (id) => {
    // Initialize game objects
    //  0 => Capitol
    //  1 => Base
    //  2 => Factory

    let objects = new Grid2D(10, 10)
    objects.fill([])
    
    let playerA = []
    let playerB = []
    
    while (playerA.length < 3) { 

        let coordinates = [
            Math.floor(Math.random() * 5) + 5,
            Math.floor(Math.random() * 10) + 0
        ]

        let duplicate = false
        for ( let i = 0; i < playerA.length; i++ ) {
            if ( JSON.stringify(coordinates) == JSON.stringify(playerA[i]) ) {
                duplicate = true
            }
        }

        if ( !duplicate ) {
            playerA.push(coordinates)
        }

    } while (playerB.length < 3) { 

        let coordinates = [
            Math.floor(Math.random() * 5) + 0,
            Math.floor(Math.random() * 10) + 0
        ]

        let duplicate = false
        for ( let i = 0; i < playerB.length; i++ ) {
            if ( JSON.stringify(coordinates) == JSON.stringify(playerB[i]) ) {
                duplicate = true
            }
        }

        if ( !duplicate ) {
            playerB.push(coordinates)
        }

    }
    
    for (let i = 0; i < 3; i++) {
        objects.cell(playerA[i][0], playerA[i][1]).value = [
            ...objects.cell(playerA[i][0], playerA[i][1]).value,
            i
        ]
        objects.cell(playerB[i][0], playerB[i][1]).value = [
            ...objects.cell(playerB[i][0], playerB[i][1]).value,
            i
        ]
    }

    mod.dump(objects, 'obj', id)
    mod.meta(playerA, 'A', id, 'w')
    mod.meta(playerB, 'B', id, 'w')

}

let generateState = (playerA, playerB, id) => {
    // Initialize game state
    //  Keeps track of board configuration

    let state = new Grid2D(10, 10)
    state.fill(0)

    state.cell(playerA[1][0], playerA[1][1]).value = 1
    state.cell(playerB[1][0], playerB[1][1]).value = 1

    mod.dump(state, 'state', id)

}


// Visualizers
//  These functions are invoked by `index.js` to visualize the game state.
//  They produce a .png image of the current game state.
let toPng = (canvas, name) => {
    // [Canvas Object] => [PNG Stream]
    // Output is stored at `temp/`

    const out = fs.createWriteStream(`temp/${name}.png`)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    // For verbose debugging:
    //out.on('finish', () => console.log('The PNG file was created.'))

}

let snapshot = (map, objects, state) => {
    // [Grid2D Object] => [Canvas Object]
    // Calls `legend` to append a legend to the base map
    // Output is stored at `temp/snap.png`

    const canvas = createCanvas(640, 800)
    const ctx = canvas.getContext('2d')
    const cs = canvas.width

    ctx.fillStyle = 'white'; ctx.lineWidth = 0
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    
    let count = 0
    for ( let x = 0; x < 10; x++ ) {
        for ( let y = 0; y < 10; y++ ) {
            count += state.cell(x, y).value
        }
    }

    for ( let x = 0; x < 10; x++ ) {
        for ( let y = 0; y < 10; y++ ) {

            let intensity = state.cell(x, y).value / count * 100
            let transformer = (intensity) => {
                return Math.round(255 - (intensity / (intensity + 1) * 255))
            }
            let red = `rgb(255, ${transformer(intensity)}, ${transformer(intensity)})`
            let blue = `rgb(${transformer(intensity)}, ${transformer(intensity)}, 255)`
            let color = ''

            if ( map.cell(x, y).value == 0 ) {
                ctx.fillStyle = red; color = '#f00'
            } else if ( map.cell(x, y).value == 1 ) {
                ctx.fillStyle = blue; color = '#00f'
            } else {
                ctx.fillStyle = 'white'; color = '#fff'
            }
            ctx.fillRect(cs / 12 * (1 + x), cs / 12 * (1 + y), cs / 12, cs / 12)
        
            let contents = objects.cell(x, y).value
            if ( contents.length > 0 ) {
                for ( let i = 0; i < contents.length; i++ ) {

                    ctx.fillStyle = color
                    ctx.fillRect(
                        cs / 12 * (2 + x) - cs / 12 / 3,
                        cs / 12 * (2 + y) - cs / 12 / 3,
                        cs / 12 / 3, cs / 12 / 3
                    )
                    ctx.fillStyle = '#fff'
                    ctx.font = `${cs / 12 / 4}px Roboto`

                    if ( contents[i] == 0 ) {
                        ctx.fillText(
                            'C', cs / 12 * (2 + x) - cs / 12 / 6, 
                                 cs / 12 * (2 + y) - cs / 12 / 6
                        )
                    } else if ( contents[i] == 1 ) {
                        ctx.fillText(
                            'B', cs / 12 * (2 + x) - cs / 12 / 6, 
                                 cs / 12 * (2 + y) - cs / 12 / 6
                        )
                    } else if ( contents[i] == 2 ) {
                        ctx.fillText(
                            'F', cs / 12 * (2 + x) - cs / 12 / 6, 
                                 cs / 12 * (2 + y) - cs / 12 / 6
                        )
                    }

                }
            }

        }
    }

    legend(state, canvas.width, ctx)
    toPng(canvas, 'snap')

}

let legend = (state, width, ctx) => {

    let count = 0
    for ( let x = 0; x < 10; x++ ) {
        for ( let y = 0; y < 10; y++ ) {
            count += state.cell(x, y).value
        }
    }

    //let color = (value) => {
    //    let intensity = state.cell(x, y).value / count * 100
    //    return 255 - (intensity / (intensity + 1) * 255)
    //}
    let value = (color) => {
        // Inverse of the color function (color^-1)
        return (255 * count - count * color) / (100 * color)
    }

    let colors = []; let values = []

    for ( let i = 0; i <= 10; i++ ) {
        let shade = 55 + (200 - 55) * i / 10
        colors.push(shade)
        values.push(value(shade))
    }

    let cw = width; let ch = cw / 4; let ih = cw
    
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillStyle = 'black'
    ctx.font = `${ch / 6}px Roboto`
    ctx.fillText(`${Math.round(values[0])}`, cw / 8, ih + ch / 2)
    ctx.fillText(
        `${Math.round(values[values.length - 1])}`, cw * 7 / 8, ih + ch / 2
    )

    for ( let i = 0; i < colors.length; i++ ) {
        
        colors[i] = Math.round(colors[i])
        ctx.fillStyle = `rgb(255, ${colors[i]}, ${colors[i]})`
        ctx.fillRect(
            cw / 4 + (cw / 2) * (i / colors.length),
            ih + ch / 4,
            cw / 2 / colors.length,
            ch / 4
        )

        ctx.fillStyle = `rgb(${colors[i]}, ${colors[i]}, 255)`
        ctx.fillRect(
            cw / 4 + (cw / 2) * (i / colors.length),
            ih + ch / 2,
            cw / 2 / colors.length,
            ch / 4
        )

    }

    return ctx

}


// Logic
let isGameOver = (map, playerA, playerB) => {
    // Return a boolean value indicating whether the game is over or not
    
    let capitolA = playerA[0]
    let capitolB = playerB[0]

    if ( map.cell(...capitolA).value == 1 ) { return true }
    else if ( map.cell(...capitolB).value == 0 ) { return true }
    else { return false }

}

let refill = (map, state, playerA, playerB, id) => {
    // Deploy new snowmen to the map

    let baseA = playerA[1]
    let baseB = playerB[1]

    let k = (n) => { return Math.log2(n ** 2 + Math.sqrt(n)) }

    if ( map.cell(...baseA).value == 1 ) { 
        state.cell(...baseA).value = 
        state.cell(...baseA).value + 2 * k(state.cell(...baseA).value)    
    }
    if ( map.cell(...baseB).value == 0 ) { 
        state.cell(...baseB).value = 
        state.cell(...baseB).value + 2 * k(state.cell(...baseB).value)
    }

    for ( let x = 0; x < 10; x++ ) {
        for ( let y = 0; y < 10; y++ ) {
            
            if ([x, y] == baseA || [x, y] == baseB) { continue }
            if ( state.cell(x, y).value >= 1 ) {
                state.cell(x, y).value = 
                state.cell(x, y).value + k(state.cell(x, y).value)
            } else {
                state.cell(x, y).value = 1
            }
            
        }
    }

    mod.dump(state, 'state', id)

}

let move = (map, state, to, from, id) => {
    // Move snowmen across squares
    
    let start_x = from[0]; let start_y = from[1]
    let end_x = to[0]; let end_y = to[1]

    if ( 
        map.cell(start_x, start_y).value != map.cell(end_x, end_y).value 
    ) { return false } else if ( map.cell(start_x, start_y) <= 1 ) { 
        return false 
    }
    let player = map.cell(start_x, start_y).value
    let allowed = new Grid2D(10, 10)
    allowed.fill(false)

    for ( let x = 0; x < 10; x++ ) {
        for ( let y = 0; y < 10; y++ ) {
            if ( map.cell(x, y).value == player ) {
                allowed.cell(x, y).value = true
            }
        }
    }

    let path = route.findPath(allowed, [start_x, start_y], [end_x, end_y])
    if ( !path ) { return false }

    // One snowman stays on start square.
    // 5% of snowmen are requested by elders to defend their territory
    // and stay on various squares across the path.
    let snowmen = state.cell(start_x, start_y).value - 1
    for ( let i = 0; i < path.length; i++ ) {
        state.cell(...path[i]).value = 
        state.cell(...path[i]).value + snowmen * 0.05
        snowmen *= 0.95
    }

    state.cell(start_x, start_y).value = 1
    state.cell(end_x, end_y).value = state.cell(end_x, end_y).value + snowmen
    mod.dump(state, 'state', id)

    return true

}

let invade = (map, state, to, player, id) => {
    // Invade a square

    let x = to[0]; let y = to[1]
    let defenders = state.cell(x, y).value
    let attackers = 0

    map.cell(x, y).neighbor().forEach(c => {
        if ( c.value == player ) {
            let x = c.position().x; let y = c.position().y
            if ( state.cell(x, y).value > 1 ) {
                attackers += (state.cell(x, y).value - 1) / 2
                state.cell(x, y).value = 1 + (state.cell(x, y).value - 1) / 2
            }
        }
    })

    let defense = Math.random() * defenders
    let attack = Math.random() * attackers

    if ( attack > defense ) {
        map.cell(x, y).value = player 
        state.cell(x, y).value = attackers
        mod.dump(map, 'map', id)
        mod.dump(state, 'state', id)
        return true
    } else { return false }

}


// Export functions
export {
    generateMap,
    generateObj,
    generateState,
    snapshot,
    isGameOver,
    refill,
    move,
    invade
}
