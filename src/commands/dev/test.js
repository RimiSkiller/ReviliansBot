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
		client.channels.cache.get('1178482291916427366').send({ embeds: [new EmbedBuilder().setDescription('.')] });
	},
};