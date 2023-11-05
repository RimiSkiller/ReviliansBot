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
		client.guilds.cache.forEach(gs => {
			gs.fetch().then(g => g.commands.fetch().then(cs => cs.forEach(c => c.delete())));
		});
		client.application.commands.cache.forEach(c => c.delete());
		process.abort();
	},
};
