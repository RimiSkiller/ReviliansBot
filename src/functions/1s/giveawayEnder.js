const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Giveaways = require('../../models/giveaways');

/**
 * @param {import('discord.js').Client} client
 */
module.exports = async (client) => {
	const giveaways = await Giveaways.where('time').lte(Date.now());
	giveaways.forEach(async giveaway => {
		const channel = await client.channels.fetch(giveaway.channel, { cache: false });
		const message = await channel.messages.fetch(giveaway.message);
		const winners = [...giveaway.joins].sort(() => 0.5 - Math.random()).slice(0, giveaway.winners > giveaway.joins.length ? giveaway.joins.length : giveaway.winners);

		const embed = EmbedBuilder.from(message.embeds[0])
			.setFields([{ name: '● Prize:', value: giveaway.prize }, { name: '● Winners:', value: winners.map(m => `<@${m}>`).join(', ') || '\\- No one entered the giveaway.' }]);
		const button = new ButtonBuilder({ emoji: '🎉', customId: 'giveawayEnter', label: giveaway.joins.length, style: ButtonStyle.Primary, disabled: true });
		message.edit({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] });
		if (winners.length) channel.send({ content: `**🎉 - Congratulations to ${winners.map(m => `<@${m}>`).join(', ')} for winning the __[${giveaway.prize}](<${message.url}>)__**` });
		giveaway.time = 'ended';
		await giveaway.save();
	});
};