const { EmbedBuilder } = require('discord.js');
const { channelCreated } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Channel} newChannel
 * @param {import('discord.js').Channel} oldChannel
 */
module.exports = (client, oldChannel, newChannel) => {
	if (newChannel.guildId != client.mainServer) return;
	if (newChannel.name == oldChannel.name) return;
	const log = client.channels.cache.get(channelCreated);
	const embed = new EmbedBuilder()
		.setColor(0x5865f2)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Channel Updated')
		.addFields({ name: 'Old Name:', value: oldChannel.name })
		.addFields({ name: 'New Name:', value: newChannel.name })
		.addFields({ name: 'ID:', value: newChannel.id });
	log.send({ embeds: [embed] });
};