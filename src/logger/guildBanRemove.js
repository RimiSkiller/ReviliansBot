const { EmbedBuilder } = require('discord.js');
const { bans } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').GuildBan} ban
 */
module.exports = (client, ban) => {
	if (ban.guild.id != client.mainServer.id) return;
	const log = client.channels.cache.get(bans);
	const embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Unbanned a Member')
		.addFields({ name: 'Name:', value: ban.user.username })
		.addFields({ name: 'ID:', value: ban.user.id });
	log.send({ embeds: [embed] });
};