// This script is used to fire up the bot and check that all systems are good 
// to go. Invoke it with: `npm test`

import * as game from './game.js'
import * as mod from './mod.js'
import * as route from './route.js'

const ID = 8080
game.generateMap(ID)
game.generateObj(ID)

let playerA = mod.meta([], 'A', ID, 'r')
let playerB = mod.meta([], 'B', ID, 'r')
game.generateState(playerA, playerB, ID)

let map = mod.read('map', ID)
let obj = mod.read('obj', ID)
let state = mod.read('state', ID)

let refills = 3
for ( let i = 0; i < refills; i++ ) { 
    game.refill(map, state, playerA, playerB, ID)
}

state = mod.read('state', ID)
game.move(map, state, [0, 0], [4, 5], ID)
state = mod.read('state', ID)
game.invade(map, state, [4, 5], 0, ID)
map = mod.read('map', ID)
state = mod.read('state', ID)
game.snapshot(map, obj, state)

console.log('Path test:'); route.runTests()
console.log('\nIs game over?')
console.log(game.isGameOver(map, playerA, playerB))

console.log('\n===\nExited with 0')
