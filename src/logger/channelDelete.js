const { EmbedBuilder } = require('discord.js');
const { channelDeleted } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Channel} channel
 */
module.exports = (client, channel) => {
	if (channel.guildId != client.mainServer) return;
	const log = client.channels.cache.get(channelDeleted);
	const embed = new EmbedBuilder()
		.setColor(0x5865f2)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Channel Deleted')
		.addFields({ name: 'Name:', value: channel.name })
		.addFields({ name: 'ID:', value: channel.id });
	log.send({ embeds: [embed] });
};