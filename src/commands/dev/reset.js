const Level = require('../../models/reset');

module.exports = {
	name: 'reset',
	description: 'Restart the bot.',
	devOnly: true,
	testOnly: true,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').Interaction} interaction
	 */
	callback: async (client, interaction) => {
		await new Level({
			check: true,
			channel: interaction.channelId,
		}).save();
		client.guilds.cache.forEach(async gs => {
			await gs.fetch().then(async g => await g.commands.fetch().then(cs => cs.forEach(async c => await c.delete())));
		});
		client.application.commands.cache.forEach(async c => await c.delete());
		process.abort();
	},
};
