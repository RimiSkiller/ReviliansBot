const Level = require('../../models/reset');

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
		await client.guilds.cache.forEach(async gs => {
			await gs.fetch().then(async g => await g.commands.fetch().then(cs => cs.forEach(async c => await c.delete())));
		});
		(await client.application.commands.fetch()).forEach(async c => await c.delete());
		const msg = await (await interaction.reply('**🔄️ - Restarting in 5 seconds...**')).fetch();
		await new Level({
			reply: msg.id,
			channel: interaction.channelId,
		}).save();
		setTimeout(async () => {
			await interaction.editReply('**🔄️ - Restarting now...**');
			process.abort();
		}, 5000);
	},
};
