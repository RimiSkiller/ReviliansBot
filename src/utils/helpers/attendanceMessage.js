const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Checks = require('../../models/attendances');
const checkIn = require('../../../config.json').checkIn.show;

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const checks = (await Checks.find()).filter(c => c.online);
	const dataShow = checks.map(c => `- <@${c.staff}>: <t:${c.lastCheck}>`);
	const channel = client.channels.cache.get(checkIn);
	const embed = new EmbedBuilder()
		.setTitle('Staff Attendance System')
		.setDescription(dataShow.join(',\n') || '## No staff online.')
		.setThumbnail(channel.guild.iconURL())
		.setFooter({ text: `Staff Online: ${checks.length}` })
		.setColor(0x5865f2);
	const button1 = new ButtonBuilder({ customId: 'check-in', label: 'Check-In', style: ButtonStyle.Success });
	const button2 = new ButtonBuilder({ customId: 'check-out', label: 'Check-Out', style: ButtonStyle.Secondary });
	const messages = await channel.messages.fetch();
	if (messages.size == 0) channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button1, button2)] });
	else messages.first().edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button1, button2)] });
};