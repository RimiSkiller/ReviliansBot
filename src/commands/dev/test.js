const { createCanvas, loadImage, registerFont } = require('canvas');

module.exports = {
	name: 'test',
	description: 'testing command dev',
	devOnly: true,
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const msg = await (await client.mainServer.channels.fetch('1185352927104204881')).messages.fetch('1185356899860885514');
		console.log(msg);
	},
};