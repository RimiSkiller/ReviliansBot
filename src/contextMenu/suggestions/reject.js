const { EmbedBuilder, TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const { suggChannel } = require('../../../configs/config.json');
const Suggestion = require('../../models/suggestions');

module.exports = {
	name: 'Reject Suggestion',

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ContextMenuCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		if (interaction.channelId != suggChannel) return interaction.reply({ content: '**❌ - This is not a suggestion.**', ephemeral: true });

		const text = new TextInputBuilder()
			.setCustomId('suggRep')
			.setLabel('Reply:')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			.setPlaceholder('write the reply to be appeared to all members under the suggestion');
		const modal = new ModalBuilder()
			.setCustomId(`suggModal-${interaction.user.id}`)
			.setTitle('Suggestion Replier')
			.addComponents(new ActionRowBuilder().addComponents(text));

		const message = interaction.targetMessage;
		const suggestion = await Suggestion.findOne({ message: message.id });
		await interaction.showModal(modal);

		const collected = await interaction.awaitModalSubmit({ filter: m => m.customId == `suggModal-${interaction.user.id}`, time: 300_000 });
		if (collected) {
			const reply = collected.fields.getTextInputValue('suggRep');
			const embed = EmbedBuilder.from(message.embeds[0]);
			embed
				.setFields([
					{ name: '● Staff reply:', value: reply },
					embed.data.fields[1],
				])
				.setColor(0xff0000);
			message.edit({ embeds: [embed] });
			const user = await client.users.fetch(suggestion.author, { cache: false });
			const dmEmbed = new EmbedBuilder()
				.setDescription(`**🎟️ - Your suggestion got __rejected__ by a staff.\n● [Suggestion link](<${message.url}>)**`)
				.setColor(0xff0000);
			user.send({ embeds: [dmEmbed] }).then(() => collected.deferUpdate()).catch(() => collected.reply({ content: '**● The author of this suggestion has a locked DMs.**', ephemeral: true }));
		}
	},
};