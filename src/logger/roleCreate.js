const { EmbedBuilder } = require('discord.js');
const { roles } = require('../../configs/logger.json');
/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Role} role
 */
module.exports = (client, role) => {
	if (role.guild.id != client.mainServer) return;
	const log = client.channels.cache.get(roles);
	const embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTimestamp()
		.setThumbnail()
		.setThumbnail(client.mainServer.iconURL())
		.setTitle('Role Created')
		.addFields({ name: 'Name:', value: role.name })
		.addFields({ name: 'ID:', value: role.id });
	log.send({ embeds: [embed] });
};