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
		await interaction.deferReply();
		client.emit('guildMemberAdd', await interaction.guild.members.fetch(interaction.options.get('member').value));
	},
};