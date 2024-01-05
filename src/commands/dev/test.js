const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'test',
	description: 'testing command dev',
	devOnly: true,
	options: [
		{
			name: 'member',
			description: 'the member',
			required: true,
			type: ApplicationCommandOptionType.User,
		},
	],
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: true });
		client.emit('messageCreate', await interaction.channel.messages.fetch('1192894292155449515'));
	},
};