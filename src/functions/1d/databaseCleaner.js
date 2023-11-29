const Suggestions = require('../../models/suggestions');
const Giveaways = require('../../models/giveaways');
const { suggChannel } = require('../../../configs/config.json');
/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	// Suggestions cleaner
	const sChannel = await client.channels.fetch(suggChannel, { cache: false });
	const sMessages = await sChannel.messages.fetch({ cache: false });
	(await Suggestions.find()).forEach(async data => {
		if (!sMessages.has(data.message)) await data.deleteOne();
	});

	// Giveaways cleaner
	(await Giveaways.find()).forEach(async giveaway => {
		const channel = await client.channels.fetch(giveaway.channel, { cache: false });
		if (!channel) await giveaway.deleteOne();
		const message = await channel.messages.fetch(giveaway.message).catch(() => null);
		if (!message) await giveaway.deleteOne();
	});
};