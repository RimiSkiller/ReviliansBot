const { createCanvas, loadImage, registerFont } = require('canvas');

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
		client.emit('guildMemberAdd', interaction.member);
	},
};