const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder } = require('discord.js');

module.exports = {
	id: 'apply-followUp',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	*/
	callback: async (client, interaction) => {
		try {
			const applyType = interaction.message.embeds[0].data.title.slice(0, -3);
			const category = (await client.staffServer.channels.fetch()).find(ch => ch.name == applyType);
			if (!category) return interaction.reply({ content: '**❌ - Some thing went wrong, contact the staff team.**', ephemeral: true });
			const applyChannels = category.children.cache.filter(ch => ch.name.startsWith('apply')).sort();
			const formNumber = interaction.message.embeds.length + 1;
			const applyChannel = applyChannels.find(c => c.name.endsWith(formNumber));
			const modal = new ModalBuilder()
				.setCustomId(`apply${formNumber}Modal-${interaction.user.id}`)
				.setTitle(applyType);
			const questions = await applyChannel.messages.fetch();
			const answers = [];
			questions.filter(m => m.author.id != client.user.id).reverse().forEach(question => {
				const req = Boolean(parseInt(question.content.split('\n')[0]));
				const style = question.content.split('\n')[1] == 'short' ? TextInputStyle.Short : TextInputStyle.Paragraph;
				const label = question.content.split('\n')[2];
				const text = new TextInputBuilder()
					.setCustomId(question.id)
					.setLabel(label)
					.setStyle(style)
					.setRequired(req);
				modal.addComponents(new ActionRowBuilder().addComponents(text));
				answers.push({ id: question.id, label: label });
			});
			interaction.showModal(modal);
			await interaction.awaitModalSubmit({ filter: m => m.customId == `apply${formNumber}Modal-${interaction.user.id}`, time: 600_000 }).then(async collected => {
				const fields = answers.map(a => { return { name: a.label, value: collected.fields.getTextInputValue(a.id) || 'No answer' }; });
				const embed = new EmbedBuilder()
					.setTitle(`${applyType} #${formNumber}`)
					.setFields(fields)
					.setColor(client.color);
				if (applyChannels.size > formNumber) {
					const button = new ButtonBuilder({ emoji: '📩', customId: 'apply-followUp', label: 'Continue', style: ButtonStyle.Primary });
					collected.reply({ content: `**● <@${interaction.user.id}>, Continue if the information is correct.\n● You can dismiss this message and start over.**`, embeds: [...interaction.message.embeds.map(em => em.data), embed], components: [new ActionRowBuilder().addComponents(button)], ephemeral: true }).then(msg => setTimeout(() => msg.delete(), 20000));
				}
				else {
					const button = new ButtonBuilder({ emoji: '📨', customId: 'apply-finish', label: 'Finish', style: ButtonStyle.Primary });
					collected.reply({ content: `**● <@${interaction.user.id}>, Finish if the information is correct.\n● You can dismiss this message and start over.**`, embeds: [...interaction.message.embeds.map(em => em.data), embed], components: [new ActionRowBuilder().addComponents(button)], ephemeral: true }).then(msg => setTimeout(() => msg.delete(), 20000));
				}
			});
		}
		catch (e) {
			console.error(e);
		}
	},
};