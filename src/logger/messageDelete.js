const { EmbedBuilder } = require('discord.js');
const { messageDeleted } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = (client, message) => {
	if (message.guild.id != client.mainServer.id) return;
	if (message.author.id == client.user.id) return;
	const log = client.channels.cache.get(messageDeleted);
	const embed = new EmbedBuilder()
		.setColor(client.color)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Message Deleted')
		.addFields({ name: 'Content:', value: '```' + message.content + '```' })
		.addFields({ name: 'Sender:', value: `${message.author.username} (${message.author.id})` });
	log.send({ embeds: [embed] });
};