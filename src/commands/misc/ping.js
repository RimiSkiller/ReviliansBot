module.exports = {
	name: 'ping',
	description: 'Measures the ping of the bot.',

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').Interaction} interaction
	 */
	callback: async (client, interaction) => {
		await interaction.deferReply();
		const m = await interaction.fetchReply();
		interaction.editReply(`**⌛ - Bot Ping: ${m.createdTimestamp - interaction.createdTimestamp}ms, Websocket Ping: ${client.ws.ping}ms .**`);
	},
};
