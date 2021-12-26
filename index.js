/* eslint-disable no-case-declarations */
// This is the Discord wrapper script that interacts with the other scripts
// to provide a Discord interface to the game.

// Require the necessary discord.js classes
import pkg from 'discord.js'
const { Client, Intents } = pkg
import * as fs from 'fs'
import * as utils from './utils.js'
import * as auto from './auto.js'

// Get the config file
const config = JSON.parse(fs.readFileSync('config.json'))
const token = config.token

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!')
})


// When the client receives a message, run this code
client.on('interactionCreate', async int => {

	if (!int.isCommand()) return
	const { commandName: com } = int

    switch (com) {
        case 'ping':
            await int.reply(
                `From current bot location in US West,\n` + 
                `Latency estimates suggest a ping of: ` +
                `${Date.now() - int.createdTimestamp}ms.`
            ); break
        case 'server':
            await int.reply({
                content: 
                `Developer information for this server:\n\n` +
                `> **Name:** \`${int.guild.name}\`\n` +
                `> **ID:** \`${int.guild.id}\`\n` +
                `> **Verification Level:** \`${
                    int.guild.verificationLevel
                }\`\n` +
                `> **Member Count:** \`${int.guild.memberCount}\``,
                ephemeral: true
            }); break
        case 'initiate': utils.initiate(int); break
        case 'register': utils.register(int); break
        case 'unregister': utils.unregister(int); break
        case 'close': utils.close(int); break
        case 'map': utils.map(int); break
        case 'move': utils.move(int); break
        case 'attack': utils.attack(int); break
        case 'help': 
            await int.reply({
                content:
                'Docs are currently a WIP, stay tuned for more.\n' + 
                'In the meantime, browse the command list to familiarize ' + 
                'yourself with the bot\'s functionality.\n' + 
                'Please note only a select few of the commands have been ' + 
                'implemented.',
                ephemeral: true
            }); break
        default:
            await int.reply({
                content: 'Attempted interaction with unknown command',
                ephemeral: true
            })
    }

})

// Login to Discord with your client's token
client.login(token)


// Manage continuously running processes
let processes = []
fs.writeFileSync('data/_HEAP.json', JSON.stringify(processes))

setInterval(() => {

    processes = JSON.parse(fs.readFileSync('data/_HEAP.json'))
    let index = 0
    processes.forEach(proc => {

        if (Date.now() - proc[1] > proc[2]) {
            let status = false
            switch (proc[0]) {
                case 'close': status = auto.close(client, proc[3]); break
                case 'refill': status = auto.refill(client, proc[3]); break
            } switch (status) {
                case 0: proc[1] = Date.now(); break
                case 1: console.log('Process returned error'); break
                case 2: processes.splice(index, 1); break
                default: console.log('Invalid process')
            }
        }

        index++

    })

    fs.writeFileSync('data/_HEAP.json', JSON.stringify(processes))

} , 60 * 1000)
