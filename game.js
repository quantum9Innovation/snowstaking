// Here lies the core logic behind the game.
//  This script is invoked each time `index.js` receives a request.


// Imports
//  CommonJS modules imported differently for compatibility reasons.
import * as fs from 'fs'
import pkg from 'griddedjs'
const { Grid2D } = pkg
import pkg2 from 'canvas'
const { createCanvas } = pkg2


// Initialize the map
//  0 => Player A
//  1 => Player B
let map = new Grid2D(10, 10)
map.fill(0)

let rows = [...map.getY()];
let cols = [...map.getX()];

for (let col = 0; col < cols.length / 2; col++) {
    for (let row = 0; row < rows.length; row++) {
        map.cell(col, row).value = 1
    }
}


// Initialize game objects
//  0 => Capitol
//  1 => Igloo
//  2 => Factory
let objects = new Grid2D(10, 10)
objects.fill([])

let playerA = new Set()
let playerB = new Set()

while (playerA.size < 3) { 
    playerA.add([
        Math.floor(Math.random() * 5) + 0,
        Math.floor(Math.random() * 10) + 0
    ]) 
} while (playerB.size < 3) { 
    playerB.add([
        Math.floor(Math.random() * 5) + 5,
        Math.floor(Math.random() * 10) + 0
    ]) 
}

playerA = [...playerA]
playerB = [...playerB]

for (let i = 0; i < 3; i++) {
    objects.cell(playerA[i][0], playerA[i][1]).value = [
        ...objects.cell(playerA[i][0], playerA[i][1]).value,
        i
    ]
}


// Initialize game state
//  Keeps track of board configuration
let state = new Grid2D(10, 10)
state.fill(0)

state.cell(playerA[1][0], playerA[1][1]).value = 1
state.cell(playerB[1][0], playerB[1][1]).value = 1


// Visualizers
//  These functions are invoked by `index.js` to visualize the game state.
//  They produce a .png image of the current game state.
let snapshot = () => {
    
    const canvas = createCanvas(800, 800)
    const ctx = canvas.getContext('2d')
    const cs = canvas.height
    
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
                return 255 - (intensity / (intensity + 1) * 255)
            }
            let red = `rgb(255, ${transformer(intensity)}, ${transformer(intensity)})`
            let blue = `rgb(${transformer(intensity)}, ${transformer(intensity)}, 255)`

            if ( map.cell(x, y).value == 0 ) {
                ctx.fillStyle = red
            } else if ( map.cell(x, y).value == 1 ) {
                ctx.fillStyle = blue
            } else {
                ctx.fillStyle = 'white'
            }
            ctx.fillRect(cs / 12 * (1 + x), cs / 12 * (1 + y), cs / 12, cs / 12)
        
        }
    }

    const out = fs.createWriteStream('./test.png')
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  console.log('The PNG file was created.'))

}

snapshot()
