const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('@discordjs/builders');
const { suggChannel } = require('../../../configs/config.json');
const barMaker = require('../../utils/helpers/barMaker');
const { ButtonStyle } = require('discord.js');
const Suggs = require('../../models/suggestions');

/**
 * @param {import('discord.js').Client} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
	if (message.author.id == client.user.id) return;
	if (message.channelId != suggChannel) return;
	const embed = new EmbedBuilder()
		.setColor(client.color)
		.setAuthor({ name: 'New Idea!', iconURL: 'https://media.discordapp.net/attachments/1167141932313608214/1193695684856119419/discotools-xyz-icon_11.png?ex=65ada6bd&is=659b31bd&hm=7aabb64e93158f2210487e053253758975b495d5a02dfc219bb2d50cface5457&=&format=webp&quality=lossless&width=497&height=497' })
		.setDescription(`**● ${message.content}**\n\n­`)
		.addFields({ name: '● Staff reply:', value: 'No reply yet' })
		.addFields({ name: '● Votes:', value: `**0% <:upVote:1193689532764270623> ${barMaker(0, 0).pb} <:downVote:1193689536191012967> 0%**` })
		.setThumbnail(message.guild.iconURL())
		.setFooter({ text: `Suggested by: ${message.member.displayName}`, iconURL: message.member.displayAvatarURL() });
	const upButton = new ButtonBuilder()
		.setCustomId('suggUp')
		.setEmoji({ id: '1193689532764270623' })
		.setStyle(ButtonStyle.Secondary);
	const downButton = new ButtonBuilder()
		.setCustomId('suggDown')
		.setEmoji({ id: '1193689536191012967' })
		.setStyle(ButtonStyle.Secondary);
	message.delete().then(() => {
		message.channel.send({ embeds: [embed], components: [new ActionRowBuilder().addComponents(upButton, downButton)] }).then(async msg => await new Suggs({ message: msg.id, author: message.author.id }).save());
	});
};