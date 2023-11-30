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
		.setColor(0xff0000)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Banned a Member')
		.addFields({ name: 'Name:', value: ban.user.username })
		.addFields({ name: 'ID:', value: ban.user.id })
		.addFields({ name: 'Reason:', value: ban.reason || 'No reason' });
	log.send({ embeds: [embed] });
};