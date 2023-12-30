const { EmbedBuilder } = require('discord.js');
const { nicknames } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').GuildMember} oldMember
 * @param {import('discord.js').GuildMember} newMember
 */
module.exports = (client, oldMember, newMember) => {
	if (newMember.guild.id != client.mainServer) return;
	if (oldMember.nickname == newMember.nickname) return;
	const log = client.channels.cache.get(nicknames);
	const embed = new EmbedBuilder()
		.setColor(client.color)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Nickname Changed')
		.addFields({ name: 'Old Nickname:', value: oldMember.nickname || 'No Nickname' })
		.addFields({ name: 'New Nickname:', value: newMember.nickname || 'No Nickname' })
		.addFields({ name: 'User:', value: `${newMember.user.username} (${newMember.user.id})` });
	log.send({ embeds: [embed] });
};