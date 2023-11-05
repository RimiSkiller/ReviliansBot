const Level = require('../../models/reset');
const { testServer } = require('../../../config.json');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const level = await Level.findOne({ check: true });
	if (level) {
		client.guilds.cache.get(testServer).channels.fetch(level.channel).then(c => c.send('Done.'));
		await level.deleteOne();
	}
};