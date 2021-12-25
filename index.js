/* eslint-disable no-case-declarations */
// This is the Discord wrapper script that interacts with the other scripts
// to provide a Discord interface to the game.

// Require the necessary discord.js classes
import pkg from 'discord.js'
const { Client, Intents } = pkg
import * as fs from 'fs'
import * as utils from './utils.js'

// Get the config file
const config = JSON.parse(fs.readFileSync('config.json'))
const token = config.token

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!')
})

// Store all interval-based functions and conditionals in an array
let intervals = []

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
        case 'close': utils.close(int, intervals); break
        case 'map': utils.map(int); break
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
