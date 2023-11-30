const { EmbedBuilder } = require('@discordjs/builders');
const make = require('../../utils/helpers/proofMaker');

module.exports = {
	name: 'test',
	description: 'testing command',
	devOnly: true,
	testOnly: true,
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		console.log(client.application.commands.cache.map(cmd => cmd.name));
	},
};