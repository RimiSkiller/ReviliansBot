const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: 'clear',
	description: 'delete a specific amount of messages in a channel',
	options: [
		{
			name: 'amount',
			description: 'the amount of messages to delete',
			type: ApplicationCommandOptionType.Number,
		},
	],
	permissions: PermissionFlagsBits.ManageMessages,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		await interaction.deferReply({ ephemeral: true });
		const amount = interaction.options.get('amount')?.value || 100;
		if (amount > 100 || amount < 1) return interaction.followUp('**❌ - You can\'t clear more the 100 or less than 2 messages.**');
		interaction.channel.messages.fetch({ limit: amount, cache: false }).then(async messages => {
			await interaction.channel.bulkDelete(messages, true).then(deleted => {
				interaction.deleteReply();
				interaction.channel.send(`**🗑️ - Deleted __${deleted.size}__ messages from this channel.**`).then(msg => setTimeout(() => msg.delete(), 5000));
			});
		});
	},
};