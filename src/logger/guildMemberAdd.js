const { EmbedBuilder } = require('discord.js');
const { joins } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = (client, member) => {
	if (member.guild.id != client.mainServer.id) return;
	const log = client.channels.cache.get(joins);
	const embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Member Joined')
		.addFields({ name: 'Name:', value: member.user.username })
		.addFields({ name: 'ID:', value: member.user.id });
	log.send({ embeds: [embed] });
};