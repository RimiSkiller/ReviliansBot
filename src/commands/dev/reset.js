const { REST, Routes } = require('discord.js');
const Reset = require('../../models/reset');

module.exports = {
	name: 'reset',
	description: 'Restart the bot.',
	devOnly: true,
	testOnly: true,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const rest = new REST().setToken(process.env.TOKEN);
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
			.then(() => console.log('Successfully deleted all application commands.'))
			.catch(console.error);
		client.guilds.cache.forEach(async g => {
			await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, g.id), { body: [] })
				.catch(console.error);
		});
		await interaction.reply('**🔄️ - Restarting now...**');
		const msg = await interaction.fetchReply();
		await new Reset({
			reply: msg.id,
			channel: interaction.channelId,
		}).save();
		process.abort();
	},
};
