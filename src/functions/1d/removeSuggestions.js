const Suggestions = require('../../models/suggestions');
const { suggChannel } = require('../../../config.json');
/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const channel = await client.channels.fetch(suggChannel, { cache: false });
	const messages = await channel.messages.fetch({ cache: false });
	(await Suggestions.find()).forEach(async data => {
		if (!messages.has(data.message)) await data.deleteOne();
	});
};