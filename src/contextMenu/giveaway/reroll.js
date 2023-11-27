const { EmbedBuilder } = require('discord.js');
const giveaways = require('../../models/giveaways');


module.exports = {
	name: 'Reroll Giveaway',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').MessageContextMenuCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const message = interaction.targetMessage;
		const giveaway = await giveaways.findOne({ message: message.id, channel: interaction.channelId });
		if (!giveaway) return interaction.reply({ content: '**🤔 - This isn\'t a giveaway message.**', ephemeral: true });
		if (giveaway.time > Date.now()) return interaction.reply({ content: '**🤔 - This giveaway hasn\'t ended yet.**', ephemeral: true });
		const winners = [...giveaway.joins].sort(() => 0.5 - Math.random()).slice(0, giveaway.winners > giveaway.joins.length ? giveaway.joins.length : giveaway.winners);
		const winnerField = { name: '● New winners:', value: winners.map(m => `<@${m}>`).join(', ') || '\\- No one entered the giveaway.' };
		const embed = EmbedBuilder.from(message.embeds[0])
			.setFields([{ name: '● Prize:', value: giveaway.prize }, winnerField]);
		message.edit({ embeds: [embed] });
		const newEmbed = new EmbedBuilder()
			.addFields(winnerField)
			.setColor(0x5865f2);
		interaction.reply({ embeds: [newEmbed] });
	},
};