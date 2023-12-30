const Points = require('../../models/staffPoints');
const { pointsChannel } = require('../../../configs/config.json');
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, UserSelectMenuBuilder } = require('discord.js');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const data = await Points.find();
	data.sort((a, b) => b.points - a.points);
	const dataShow = data.map(a => `- <@${a.staff}><:arrow:1170430004493033594>${a.points}`);
	const channelShow = client.channels.cache.get(pointsChannel.show);
	const channelManage = client.channels.cache.get(pointsChannel.manage);
	const embed = new EmbedBuilder()
		.setTitle('Staff Points System')
		.setDescription(dataShow.join(',\n'))
		.setThumbnail(channelShow.guild.iconURL())
		.setFooter({ text: 'Last Updated' })
		.setColor(client.color)
		.setTimestamp(Date.now());
	const messageShow = await channelShow.messages.fetch();
	if (messageShow.size == 0) channelShow.send({ embeds: [embed] });
	else messageShow.first().edit({ embeds: [embed] });
	const messageManage = await channelManage.messages.fetch();
	const button1 = new ButtonBuilder({ emoji: '➕', customId: 'staffUp', style: ButtonStyle.Success });
	const button2 = new ButtonBuilder({ emoji: '➖', customId: 'staffDown', style: ButtonStyle.Success });
	const set = new ButtonBuilder({ customId: 'staffSet', label: 'Set', style: ButtonStyle.Primary });

	// const menu = new StringSelectMenuBuilder().setCustomId('test').addOptions(data.map(ad => new StringSelectMenuOptionBuilder().setLabel(client.users.cache.get(ad.staff).displayName).setValue(ad.staff)));
	const menu = new UserSelectMenuBuilder()
		.setCustomId('staffPointManage')
		.setPlaceholder('Select a staff to manage his points');
	if (messageManage.size == 0) channelManage.send({ components: [new ActionRowBuilder().setComponents(menu), new ActionRowBuilder().setComponents(button1, set, button2)] });
	else messageManage.first().edit({ components: [new ActionRowBuilder().setComponents(menu), new ActionRowBuilder().setComponents(button1, set, button2)] });
};
