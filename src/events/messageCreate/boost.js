const { MessageType } = require('discord.js');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
	if (message.guildId != client.mainServer.id) return;
	const types = [MessageType.GuildBoost, MessageType.GuildBoostTier1, MessageType.GuildBoostTier2, MessageType.GuildBoostTier3];
	if (!types.includes[message.type]) return;
	message.channel.send(`${message.author.id} boosted`);
};