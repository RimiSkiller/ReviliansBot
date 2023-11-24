const nodeHtmlToImage = require('node-html-to-image');
const { generateFromMessages } = require('discord-html-transcripts');
const { ApplicationCommandOptionType } = require('discord.js');
const Points = require('../../models/staffPoints');

module.exports = {
	name: 'test',
	description: 'testing command',
	options: [
		{
			name: 'user',
			description: 'msgid',
			required: true,
			type: ApplicationCommandOptionType.User,
		},
		{
			name: 'points',
			description: 'msgid',
			required: true,
			type: ApplicationCommandOptionType.Number,
		},
	],
	devOnly: true,
	testOnly: true,
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		await new Points({
			staff: interaction.options.get('user').value,
			points: interaction.options.get('points').value,
		}).save();
	},
};