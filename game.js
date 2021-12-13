// Here lies the core logic behind the game.
// This script is invoked each time `index.js` receives a request.

// Imports
//  CommonJS modules imported differently for compatibility reasons.
import pkg from 'griddedjs'
const { Grid2D } = pkg


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

// Testing stuff:
//console.log(objects.cell(playerA[0][0], playerA[0][1]).value)
//console.log(objects.cell(0, 0).value)
//console.log(playerA, playerB)
