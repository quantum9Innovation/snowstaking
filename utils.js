// Miscellaneous utils for the web client
// All take in `interaction` parameter
// Called via `index.js`


// Imports
import * as fs from 'fs'
import * as game from './game.js'
import * as mod from './mod.js'


// Helper Utils
//  Not exported
let noGameExists = async (int) => {
    // Send message to channel that no game is in progress

    const headers = ['Psst...', 'Pro tip:']
    const tips = [
        'You can start up a game with /initiate',
        'Go to a different channel to join existing games with /register',
    ]
    await int.reply(
        'No game detected...\n' + 
        `*${headers[Math.floor(Math.random() * headers.length)]}* ` +
        `${tips[Math.floor(Math.random() * tips.length)]}`
    )

}

let gameNotStarted = async (int) => {
    // Send message to channel that game has not started

    const headers = ['Psst...', 'Pro tip:']
    const tips = [
        'You can close registration with /close',
        'Try waiting until the registration period closes...',
    ]
    await int.reply(
        'No game detected...\n' + 
        `*${headers[Math.floor(Math.random() * headers.length)]}* ` +
        `${tips[Math.floor(Math.random() * tips.length)]}`
    )

}

let notRegistered = async (int) => {
    // Send message to channel that user is not registered

    const headers = ['Psst...', 'Pro tip:']
    const tips = [
        'Create a new game somewhere else with /initiate',
        'You can join another game in a different channel with /register',
    ]
    await int.reply(
        'You are not registered...\n' +
        `*${headers[Math.floor(Math.random() * headers.length)]}* ` +
        `${tips[Math.floor(Math.random() * tips.length)]}`
    )

}

let startGame = async (int, data) => {
    // Send message to channel that game has started
    
    data.registrationDate = Date.now()
    data.started = true

    data.teamA = []; data.teamB = []
    for ( let i = 0; i < data.members.length; i++ ) { 
        if ( i % 2 == 0 ) { data.teamA.push(data.members[i]) }
        else { data.teamB.push(data.members[i]) }
    }

    fs.writeFileSync(`data/game${int.channelId}.json`, JSON.stringify(data))
    await int.reply('Registration closed :x:')

    game.generateMap(int.channelId)
    game.generateObj(int.channelId)
    let playerA = mod.meta([], 'A', int.channelId, 'r')
    let playerB = mod.meta([], 'B', int.channelId, 'r')
    game.generateState(playerA, playerB, int.channelId)

    let processes = JSON.parse(fs.readFileSync(`data/_HEAP.json`))
    for ( let i = 0; i < processes.length; i++ ) {
        if ( 
            processes[i][0] == 'close' && 
            processes[i][3] == int.channelId
        ) {
            processes.splice(i, 1)
            break
        }
    }
    processes.push(['refill', Date.now(), 5 * 60 * 1000, int.channelId])
    fs.writeFileSync(`data/_HEAP.json`, JSON.stringify(processes))

    await new Promise(resolve => setTimeout(resolve, 2500))
    await int.followUp(
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
        `The game will end in 24 hours.`
    )

}


// Core Utils
let initiate = async (int) => {
    // Initialize a game session

    // Check if a game is already in progress
    fs.access(`data/game${int.channelId}.json`, fs.F_OK, async (err) => {

        if (err) { 

            const user = int.member
            const names = {
                'Democrats': {
                    'adjectives': [
                        'Deceitful',
                        'Decent',
                        'Decisive',
                        'Dedicated',
                        'Defiant',
                        'Deliberate',
                        'Delightful',
                        'Demanding',
                        'Demonic',
                        'Deplorable',
                        'Depressed',
                        'Desperate',
                        'Despicable',
                        'Determined',
                        'Detestable',
                        'Devastating',
                        'Devoted',
                        'Devout',
                    ],
                    'animals': [
                        'Dachshunds',
                        'Dalmatians',
                        'Damselfish',
                        'Dark-eyed Juncos',
                        'Deer',
                        'Desert Tortoises',
                        'Dik-Dik',
                        'Dingoes',
                        'Dodos',
                        'Dogs',
                        'Dolphins',
                        'Donkeys',
                        'Doves',
                        'Dragons',
                        'Dragonfish',
                        'Dragonflies',
                        'Drum Fish',
                        'Ducks',
                    ],
                },
                'Republicans': {
                    'adjectives': [
                        'Reactive',
                        'Realistic',
                        'Reasonable',
                        'Reassuring',
                        'Rebellious',
                        'Receptive',
                        'Reckless',
                        'Reclusive',
                        'Rectifiable',
                        'Recyclable',
                        'Red',
                        'Red-blooded',
                        'Reddish',
                        'Redeemable',
                        'Redundant',
                        'Reflective',
                        'Refundable',
                        'Refurbished',
                        'Regal',
                        'Regional',
                        'Regretful',
                        'Regular',
                        'Reigning',
                        'Relaxed',
                        'Relentless',
                        'Reliable',
                        'Relieved',
                        'Religious',
                        'Reluctant',
                        'Remaining',
                        'Remarkable',
                        'Remedial',
                        'Remorseful',
                        'Remote',
                        'Renewable',
                        'Repairable',
                        'Repaired',
                        'Representative',
                        'Repressive',
                        'Reproachful',
                        'Repulsive',
                        'Resident',
                        'Residential',
                        'Resilient',
                        'Resolute',
                        'Resounding',
                        'Resourceful',
                        'Respectable',
                        'Respectful',
                        'Responsible',
                        'Responsive',
                        'Rested',
                        'Restful',
                        'Restless',
                        'Restrained',
                        'Restrictive',
                        'Retired',
                        'Retrogressive',
                        'Revengeful',
                        'Revolting',
                        'Revolutionary',
                    ],
                    'animals': [
                        'Rabbits',
                        'Racoons',
                        'Racoon Dogs',
                        'Rats',
                        'Rattlesnakes',
                        'Red Finches',
                        'Red Foxes',
                        'Red Pandas',
                        'Red Wolves',
                        'Reindeer',
                        'Rhinos',
                        'River Turtles',
                        'Robins',
                        'Rock Hyraxes',
                        'Rockfish',
                        'Rockhopper Penguins',
                        'Royal Penguins',
                    ],
                },
            }

            const playerA_name = 
            names.Democrats.adjectives[
                Math.floor(Math.random() * names.Democrats.adjectives.length)
            ] + ' Democratic ' + names.Democrats.animals[
                Math.floor(Math.random() * names.Democrats.animals.length)
            ]
            const playerB_name =
            names.Republicans.adjectives[
                Math.floor(Math.random() * names.Republicans.adjectives.length)
            ] + ' Republican ' + names.Republicans.animals[
                Math.floor(Math.random() * names.Republicans.animals.length)
            ]

            const data = {
                'id': int.channelId,
                'user': user.id,
                playerA_name,
                playerB_name,
                'registrationDate': Date.now() + (5 * 60 * 1000),
                'game': Date.now() + (24 * 60 * 60 * 1000),
                'members': [user.id],
                'started': false,
            }
            fs.writeFileSync(
                `data/game${int.channelId}.json`, JSON.stringify(data)
            )
            await int.reply(
                `Starting game... **${playerA_name} vs ${playerB_name}**\n` + 
                `Registration closes in 5 minutes (use /close to close it before).\n` +
                `Register with /register`
            )

            let processes = JSON.parse(fs.readFileSync('data/_HEAP.json'))
            processes.push(['close', Date.now(), 5 * 60 * 1000, int.channelId])
            fs.writeFileSync('data/_HEAP.json', JSON.stringify(processes))

        } else {
            const headers = ['Psst...', 'Pro tip:']
            const tips = [
                'You can close the game with /close',
                'Go to a different channel to create a new game',
            ]
            await int.reply(
                'A game is already in progress...\n' + 
                `*${headers[Math.floor(Math.random() * headers.length)]}* ` +
                `${tips[Math.floor(Math.random() * tips.length)]}`
            )
        }
    })

}

let register = async (int) => {
    // Register for an upcoming game
    // Must be done within the registration period

    if ( !fs.existsSync(`data/game${int.channelId}.json`) ) { 
        noGameExists(int); return
    }
    let data = JSON.parse(fs.readFileSync(`data/game${int.channelId}.json`))
    
    if (Date.now() >= data.registrationDate) {
        await int.reply('Registration period has ended.')
    } else if (data.members.includes(int.member.id)) {
        const headers = ['Psst...', 'Pro tip:']
        const tips = [
            'You can unregister with /unregister',
            'You can close registration with /close',
        ]
        await int.reply(
            'You are already registered! Hold tight...\n' + 
            `*${headers[Math.floor(Math.random() * headers.length)]}* ` +
            `${tips[Math.floor(Math.random() * tips.length)]}`
        )
    } else {
        data.members.push(int.member.id)
        fs.writeFileSync(`data/game${int.channelId}.json`, JSON.stringify(data))
        await int.reply('Registered! :white_check_mark:')
    }

}

let unregister = async (int) => {
    // Unregister from an upcoming game
    // Must be done within the registration period

    if ( !fs.existsSync(`data/game${int.channelId}.json`) ) { 
        noGameExists(int); return
    }

    let data = JSON.parse(fs.readFileSync(`data/game${int.channelId}.json`))
    if (Date.now() >= data.registrationDate) {
        await int.reply('Registration period has already ended.')
    } else if (!data.members.includes(int.member.id)) {
        await int.reply('You are not registered.')
    } else {
        data.members.splice(data.members.indexOf(int.member.id), 1)
        fs.writeFileSync(`data/game${int.channelId}.json`, JSON.stringify(data))
        const headers = ['Psst...', 'Pro tip:']
        const tips = [
            'You can re-register with /register',
            'You can close registration with /close',
        ]
        await int.reply(
            'Unregistered! :white_check_mark:\n' + 
            `*${headers[Math.floor(Math.random() * headers.length)]}* ` +
            `${tips[Math.floor(Math.random() * tips.length)]}`
        )
    }

}

let close = async (int) => {
    // Close registration for a game
    // Or, in the case that a game is already in progress,
    // terminate the game (can only be done by the host)

    if ( !fs.existsSync(`data/game${int.channelId}.json`) ) { 
        noGameExists(int); return
    }

    let data = JSON.parse(fs.readFileSync(`data/game${int.channelId}.json`))
    if (Date.now() >= data.registrationDate) {
        if ( data.user == int.member.id ) {
            fs.unlinkSync(`data/game${int.channelId}.json`, () => {})
            let processes = JSON.parse(fs.readFileSync('data/_HEAP.json'))
            for ( let i = 0; i < processes.length; i++ ) {
                if (  processes[i][3] == int.channelId ) {
                    processes.splice(i, 1)
                    break
                }
            }
            fs.writeFileSync('data/_HEAP.json', JSON.stringify(processes))
            await int.reply(
                'Game closed!* :white_check_mark:\n' + 
                '**Winners not reported for premature games*'
            )
        } else { await int.reply('Registration has already been closed.') }
    } else if (data.members.length < 2) {
        await int.reply('Not enough players to start a game. :no_entry_sign:')
    } else { startGame(int, data) }

}

let map = async (int) => {
    // Generate a map of the current game state
    // Call `game.snapshot()` to generate a .png image and then send it
    // as an attachment to the channel

    if ( !fs.existsSync(`data/game${int.channelId}.json`) ) { 
        noGameExists(int); return
    }

    let data = JSON.parse(fs.readFileSync(`data/game${int.channelId}.json`))
    if ( !data.started ) { gameNotStarted(int) }

    let map = mod.read('map', int.channelId)
    let obj = mod.read('obj', int.channelId)
    let state = mod.read('state', int.channelId)

    game.snapshot(map, obj, state, int.channelId)
    int.reply({
        content:
        `Here is the current game state:\n` +
        `**Blue is ${data.playerA_name}, Red is ${data.playerB_name}.*`,
        files: [`./temp/${int.channelId}.png`],
        ephemeral: true,
    })

}

let move = async (int) => {
    // Wrapper for `game.move()`

    const start = int.options.getString('start')
    const end = int.options.getString('end')

    if ( !fs.existsSync(`data/game${int.channelId}.json`) ) {
        noGameExists(int); return
    }
    
    let data = JSON.parse(fs.readFileSync(`data/game${int.channelId}.json`))
    if ( !data.started ) { gameNotStarted(int) }
    
    let team = false
    if ( data.teamA.includes(int.member.id) ) { team = 0 }
    else if ( data.teamB.includes(int.member.id) ) { team = 1 }
    else { notRegistered(int) }

    let map = mod.read('map', int.channelId)
    let state = mod.read('state', int.channelId)

    let coordinates = []
    let start_sq
    let end_sq
    
    try {
        coordinates = [mod.alpha2grid(start), mod.alpha2grid(end)]
        start_sq = map.cell(...coordinates[0]).value
        // eslint-disable-next-line no-unused-vars
        end_sq = map.cell(...coordinates[1]).value
    } catch (e) {
        await int.reply(`Invalid coordinates.`); return
    }

    if ( start_sq != team ) { 
        await int.reply(`You can't move the other team's pieces.`); return
    }

    let result = game.move(
        map, state, coordinates[1], coordinates[0], int.channelId
    )

    if ( result ) {
        await int.reply(
            `${int.member} moved snowmen from ${start} to ${end}! :snowflake:`
        )
    } else {
        await int.reply({
            content: 
            `This move interaction failed. Make sure squares are contiguous.`,
            ephemeral: true,   
        })
    }

}

let attack = async (int) => {
    // Wrapper for `game.invade()`

    const square = int.options.getString('square')

    if ( !fs.existsSync(`data/game${int.channelId}.json`) ) {
        noGameExists(int); return
    }
    
    let data = JSON.parse(fs.readFileSync(`data/game${int.channelId}.json`))
    if ( !data.started ) { gameNotStarted(int) }
    
    let team = false
    if ( data.teamA.includes(int.member.id) ) { team = 0 }
    else if ( data.teamB.includes(int.member.id) ) { team = 1 }
    else { notRegistered(int) }

    let map = mod.read('map', int.channelId)
    let state = mod.read('state', int.channelId)

    let coordinates = []
    let square_val

    try {
        coordinates = mod.alpha2grid(square)
        square_val = map.cell(...coordinates).value
    } catch (e) {
        await int.reply(`Invalid coordinates.`); return
    }

    if ( square_val == team ) { 
        await int.reply(`You can't attack your own pieces.`); return
    }

    let result = game.invade(
        map, state, coordinates, team, int.channelId
    )

    if ( result ) {
        await int.reply(
            `:rotating_light: ${int.member} attacked and acquired ${square}! ` + 
            `:snowman: :rotating_light:`
        )
    } else {
        await int.reply(
            `${int.member} suffers a costly defeat on ${square}! :shield:`
        )
    }

    map = mod.read('map', int.channelId)
    let playerA = mod.meta([], 'A', int.channelId, 'r')
    let playerB = mod.meta([], 'B', int.channelId, 'r')
    let gameRes = game.isGameOver(map, playerA, playerB)

    if ( gameRes ) {

        fs.unlink(`data/game${int.channelId}.json`, () => {})

        let winner = 'Unknown Winner'
        if ( team == 0 ) { winner = data.playerA_name }
        else if ( team == 1 ) { winner = data.playerB_name } 

        await int.followUp(
            `:fireworks: **Game over! ${winner} won!** :tada: :fireworks:\n` +
            `*Hint: Want to start a new game? Try /initiate*` 
        )

    } else { return }

}


// Exports
export {
    initiate,
    register,
    unregister,
    close,
    map,
    move,
    attack,
}
