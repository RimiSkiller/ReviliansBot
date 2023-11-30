const { EmbedBuilder } = require('discord.js');
const { roles } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Role} role
 */
module.exports = (client, oldRole, newRole) => {
	if (newRole.guild.id != client.mainServer) return;
	if (oldRole.name == newRole.name) return;
	const log = client.channels.cache.get(roles);
	const embed = new EmbedBuilder()
		.setColor(0x5865f2)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Role Edited')
		.addFields({ name: 'Old Name:', value: oldRole.name })
		.addFields({ name: 'New Name:', value: newRole.name })
		.addFields({ name: 'ID:', value: newRole.id });
	log.send({ embeds: [embed] });
};