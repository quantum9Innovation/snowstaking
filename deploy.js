// This script is required for deploying slash commands to the Discord API.
// It is not required for the game itself.

import * as pkg from '@discordjs/builders'
const { SlashCommandBuilder } = pkg
import * as pkg2 from '@discordjs/rest'
const { REST } = pkg2
import pkg3 from 'discord-api-types/v9'
const { Routes } = pkg3
import * as fs from 'fs'

const config = JSON.parse(fs.readFileSync('config.json'))
const { token, clientId, guildId } = config

const commands = [
	new SlashCommandBuilder().setName('ping').
    setDescription('Get current latency estimates for your server'),
	new SlashCommandBuilder().setName('server').
    setDescription('Replies with known server information (for developers)'),
	new SlashCommandBuilder().setName('initiate').
    setDescription('Start a game session'),
    new SlashCommandBuilder().setName('register').
    setDescription('Register for an upcoming game session'),
    new SlashCommandBuilder().setName('unregister').
    setDescription('Unregister from an upcoming game session'),
    new SlashCommandBuilder().setName('close').
    setDescription('Close a game session/registration period'),
    new SlashCommandBuilder().setName('map').
    setDescription('Get the current map'),
    new SlashCommandBuilder().setName('info').
    setDescription(
        'Pull up information on any game object; with no arguments, pulls up ' +
        'game information'
    ),
    new SlashCommandBuilder().setName('help').
    setDescription('Redirects to manual'),
    new SlashCommandBuilder().setName('stats').
    setDescription('Get your stats, game stats, and leaderboard information'),
    new SlashCommandBuilder().setName('move').
    setDescription('Move snowmen to a new location')
    .addStringOption(option =>
		option.setName('start')
			.setDescription('Starting square coordinates')
			.setRequired(true))
    .addStringOption(option =>
        option.setName('end')
            .setDescription('Ending square coordinates')
            .setRequired(true)),
    new SlashCommandBuilder().setName('attack').
    setDescription('Attack a square')
    .addStringOption(option =>
		option.setName('square')
			.setDescription('Coordinates of square to attack')
			.setRequired(true)),
    new SlashCommandBuilder().setName('count').
    setDescription('Get information on your snowball and snowmen counts'),
    new SlashCommandBuilder().setName('purchase').
    setDescription('Purchase power (among other things)'),
].map(command => command.toJSON())

const rest = new REST({ version: '9' }).setToken(token)

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error)
