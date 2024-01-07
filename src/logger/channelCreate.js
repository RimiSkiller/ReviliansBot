const { EmbedBuilder } = require('discord.js');
const { channels } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Channel} channel
 */
module.exports = (client, channel) => {
	if (channel.guildId != client.mainServer) return;
	const log = client.channels.cache.get(channels);
	const embed = new EmbedBuilder()
		.setColor(client.color)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Channel Created')
		.addFields({ name: 'Name:', value: channel.name })
		.addFields({ name: 'ID:', value: channel.id });
	log.send({ embeds: [embed] });
};