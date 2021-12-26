// Automatically-run modules are stored here
// These modules make direct interactions with the Discord API as opposed to
// responding to received interactions. All functions are synchronous, but call
// asynchronous functions for sending messages


// Imports
import * as fs from 'fs'
import * as mod from './mod.js'
import * as game from './game.js'


// Helper funcs (async)
let send = async (message, client, id) => {
    // Asynchronous helper function for sending messages

    const channel = await client.channels.fetch(id)
    await channel.send(message)

}


// Core funcs (sync)
let close = (client, id) => {
    // Autonomous version of `utils.startGame()`

    if ( !fs.existsSync(`data/game${id}.json`) ) { return 1 }
    let data = JSON.parse(fs.readFileSync(`data/game${id}.json`))

    if ( data.members.length < 2 ) { 
        send(
            'Failed to initialize game: not enough players detected :x:', 
            client, id
        )
        fs.unlink(`data/game${id}.json`, () => {})
        return 2
    }

    data.registrationDate = Date.now()
    data.started = true

    data.teamA = []; data.teamB = []
    for ( let i = 0; i < data.members.length; i++ ) { 
        if ( i % 2 == 0 ) { data.teamA.push(data.members[i]) }
        else { data.teamB.push(data.members[i]) }
    }

    fs.writeFileSync(`data/game${id}.json`, JSON.stringify(data))

    let processes = JSON.parse(fs.readFileSync(`data/_HEAP.json`))
    processes.push(['refill', Date.now(), 5 * 60 * 1000, id])
    fs.writeFileSync(`data/_HEAP.json`, JSON.stringify(processes))

    game.generateMap(id)
    game.generateObj(id)
    let playerA = mod.meta([], 'A', id, 'r')
    let playerB = mod.meta([], 'B', id, 'r')
    game.generateState(playerA, playerB, id)

    send(
        `Registration closed :x:\n` +
        `The game has started!\n\n` +
        `Here's the backstory (listen carefully):\n` +
        `> Once upon a time (in the near future), Republicans came back ` +
        `for a second coup attempt, which was arguably more successful ` + 
        `than the first. Joe Biden, old and confused, left in exile, ` + 
        `leaving the Union and Democrats in general in a state of ` + 
        `despair. With a ferocious thirst for power, Republican states ` + 
        `seized on the Democrat's confusion to re-establish the ` + 
        `Confederacy. The Union was crumbling fast but it had support ` + 
        `from the majority of states, including Washington D.C., and ` + 
        `thus Democrats continued to hold control of the U.S. Capitol. ` + 
        `During Democrats' inaction, however, Republican states had been ` + 
        `seceding from the Union in rapidfire succession. Despite their ` + 
        `frail efforts, the Republican Confederacy in the South was ` + 
        `defeated by the Union, leaving just one more problem for ` + 
        `Democrats: Alaska. Being the last state to secede, Alaska had ` + 
        `become a Republican stronghold, and they quickly established a ` + 
        `capital there. The Confederacy was being reborn, and Democrats ` + 
        `had one last chance to stop it. So it begins ...\n\n` +
        `Now, both Republicans and Democrats have established a Capitol, ` +
        `Factory, and Military Base on the territory. If your team's ` + 
        `Capitol falls, so does your victory. As for the Factory, it ` +
        `supplies your team with snowballs, which are necessary for war ` + 
        `and also for maintaining purchasing power. Lastly (but ` + 
        `certainly not least), the Base will supply you troops at a rate ` +
        `double that of any other square, so make sure to keep it!\n\n` +
        `Run /help for commands.\n` +
        `The game will end in 24 hours.`,
        client, id
    )

    return 2

}

let refill = (client, id) => {
    // Autonomous version of `game.refill()`

    if ( !fs.existsSync(`data/game${id}.json`) ) { return 2 }
    let data = JSON.parse(fs.readFileSync(`data/game${id}.json`))

    if ( !data.started ) { return 1 }

    let map = mod.read('map', id)
    let state = mod.read('state', id)
    let playerA = mod.meta([], 'A', id, 'r')
    let playerB = mod.meta([], 'B', id, 'r')
    game.refill(map, state, playerA, playerB, id)

    return 0

}


// Exports
export { close, refill }
