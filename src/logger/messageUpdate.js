const { EmbedBuilder } = require('discord.js');
const { messageEdited } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} oldMessage
 * @param {import('discord.js').Message} newMessage
 */
module.exports = (client, oldMessage, newMessage) => {
	if (newMessage.guild.id != client.mainServer.id) return;
	if (oldMessage.content == newMessage.content) return;
	const log = client.channels.cache.get(messageEdited);
	const embed = new EmbedBuilder()
		.setColor(0x5865f2)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Message Edited')
		.addFields({ name: 'Old Content:', value: '```' + oldMessage.content + '```' })
		.addFields({ name: 'New Content:', value: '```' + newMessage.content + '```' })
		.addFields({ name: 'Sender', value: `${newMessage.author.username} (${newMessage.author.id})` });
	log.send({ embeds: [embed] });
};