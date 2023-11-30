const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	id: 'apply',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const applyType = interaction.message.embeds[0].data.title;
		const category = (await client.staffServer.channels.fetch()).filter(ch => ch.name == applyType).first();
		if (!category) return interaction.reply({ content: '**❌ - You didn\'t provide a valid category id.**', ephemeral: true });
		const applyChannel = category.children.cache.filter(ch => ch.name == 'apply').first();
		const modal = new ModalBuilder()
			.setCustomId(`applyModal-${interaction.user.id}`)
			.setTitle(applyType);
		const questions = await applyChannel.messages.fetch();
		const answers = [];
		questions.reverse().forEach(question => {
			const style = question.content.split('```')[0] == 'short' ? TextInputStyle.Short : TextInputStyle.Paragraph;
			const label = question.content.split('```')[1];
			const text = new TextInputBuilder()
				.setCustomId(question.id)
				.setLabel(label)
				.setStyle(style)
				.setRequired(true);
			modal.addComponents(new ActionRowBuilder().addComponents(text));
			answers.push({ id: question.id, label: label });
		});
		interaction.showModal(modal);
		await interaction.awaitModalSubmit({ filter: m => m.customId == `applyModal-${interaction.user.id}`, time: 600_000 }).then(async collected => {
			try {
				await collected.reply({ content: '**📃 - Your application was sent to our staff to review.**', ephemeral: true });
				const responsesChannel = category.children.cache.filter(ch => ch.name == 'responses').first();
				const embed = new EmbedBuilder()
					.setTitle(category.name)
					.setThumbnail(interaction.member.displayAvatarURL())
					.setFooter({ text: `${interaction.member.displayName} - ${interaction.user.id}` })
					.setTimestamp()
					.setColor(0x5865f2)
					.setFields(answers.map(ans => {
						return { name: ans.label, value: collected.fields.getTextInputValue(ans.id) };
					}));
				responsesChannel.send({ embeds: [embed] });
			}
			catch (e) {
				console.error(e);
			}
		});
	},
};