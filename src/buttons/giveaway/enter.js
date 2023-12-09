const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Giveaways = require('../../models/giveaways');

module.exports = {
	id: 'giveawayEnter',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const giveaway = await Giveaways.findOne({ message: interaction.message.id, channel: interaction.channelId });
		if (!giveaway) return interaction.deferUpdate();
		if (giveaway.joins.includes(interaction.user.id)) {
			await interaction.reply({ content: '**🤔 - You have left this giveaway. If you wish to win, repress the button.**', ephemeral: true });
			giveaway.joins = giveaway.joins.filter(a => a != interaction.user.id);
			console.log(giveaway.joins);
			await giveaway.save();
			const button1 = new ButtonBuilder({ emoji: '🎉', customId: 'giveawayEnter', label: giveaway.joins.length, style: ButtonStyle.Primary });
			interaction.message.edit({ components: [new ActionRowBuilder().addComponents(button1)] });

		}
		else {
			giveaway.joins.push(interaction.user.id);
			await giveaway.save();
			const button = new ButtonBuilder({ emoji: '🎉', customId: 'giveawayEnter', label: giveaway.joins.length, style: ButtonStyle.Primary });
			interaction.message.edit({ components: [new ActionRowBuilder().addComponents(button)] });
			interaction.reply({ content: `**🎉 - You have entered the giveaway. You have a chance to win:\n\`${giveaway.prize}\`**`, ephemeral: true });
		}
	},
};