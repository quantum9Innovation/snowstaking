// This script is used to fire up the bot and check that all systems are good 
// to go. Invoke it with: `npm test`

import * as game from './game.js'
import * as mod from './mod.js'

const ID = 8080
game.generateMap(ID)
game.generateObj(ID)

let playerA = mod.meta([], 'A', ID, 'r')
let playerB = mod.meta([], 'B', ID, 'r')
game.generateState(playerA, playerB, ID)

let map = mod.read('map', ID)
let obj = mod.read('obj', ID)
let state = mod.read('state', ID)
game.snapshot(map, obj, state)

console.log('Exited with 0')
