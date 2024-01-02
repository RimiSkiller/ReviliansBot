const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ComponentType } = require('discord.js');
const gpt = require('../../utils/helpers/gpt');

module.exports = {
	id: 'apply',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ButtonInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const applyType = interaction.message.embeds[0].data.title;
		const category = (await client.staffServer.channels.fetch()).find(ch => ch.name == applyType);
		if (!category) return interaction.reply({ content: '**❌ - Some thing went wrong, contact the staff team.**', ephemeral: true });
		const applyChannels = category.children.cache.filter(ch => ch.name.startsWith('apply')).sort();
		const applyChannel = applyChannels.first();
		const modal = new ModalBuilder()
			.setCustomId(`applyModal-${interaction.user.id}`)
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
		const button = new ButtonBuilder({ customId: 'startApply', label: 'Start Process', style: ButtonStyle.Success });
		interaction.deferReply({ ephemeral: true });
		const msg = await interaction.user.send({ content: '**● ' + await gpt(`a user named "${interaction.member.displayName}" want to start filling an application in the server, wishing him good luck and inform him to press the "Start Process" button.`, `I want you to act as a Discord bot, I'll write you a scenario that may happen in Discord server called "${interaction.guild.name}", you will send me the best message to reply to this scenario.`) + '**', components: [new ActionRowBuilder().addComponents(button)] }).catch(() => interaction.reply({ content: '**🤔 - Open your DM to start the apply.**', ephemeral: true }));
		interaction.editReply({ content: `**☑️ - You started a new appling process, [continue](<${msg.url}>)**`, ephemeral: true });
		const inter = await msg.awaitMessageComponent({ filter: m => m.user.id == interaction.user.id, componentType: ComponentType.Button, time: 180000, errors: ['time'] }).catch(() => msg.delete());
		if (inter.isButton) {
			inter.showModal(modal);
			await inter.awaitModalSubmit({ filter: m => m.customId == `applyModal-${interaction.user.id}`, time: 600_000 }).then(async collected => {
				const fields = answers.map(a => { return { name: a.label, value: collected.fields.getTextInputValue(a.id) || 'No answer' }; });
				const embed = new EmbedBuilder()
					.setTitle(`${applyType} #1`)
					.setFields(fields)
					.setColor(client.color);
				const bar = require('../../utils/helpers/barMaker')(1, applyChannels.size - 1);
				if (applyChannels.size > 1) {
					const button1 = new ButtonBuilder({ emoji: '📩', customId: 'apply-followUp', label: 'Continue', style: ButtonStyle.Primary });
					msg.edit({ content: `**● <@${interaction.user.id}>, Continue if the information is correct.\n● You can ignore this message and start over.**`, embeds: [embed, new EmbedBuilder().setDescription(`${bar.pb} **1/${applyChannels.size}**`).setColor(client.color)], components: [new ActionRowBuilder().addComponents(button1)], ephemeral: true });
				}
				else {
					const button1 = new ButtonBuilder({ emoji: '📨', customId: 'apply-finish', label: 'Finish', style: ButtonStyle.Primary });
					msg.edit({ content: `**● <@${interaction.user.id}>, Finish if the information is correct.\n● You can ignore this message and start over.**`, embeds: [embed, new EmbedBuilder().setDescription(`${bar.pb} **1/${applyChannels.size}**`).setColor(client.color)], components: [new ActionRowBuilder().addComponents(button1)], ephemeral: true });
				}
				collected.deferUpdate();
			});
		}
	},
};