const { TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder } = require('discord.js');
const { muteRole } = require('../../../configs/config.json');
const TRoles = require('../../models/temproles');
const ms = require('ms');

module.exports = {
	name: 'Mute Member',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').UserContextMenuCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const member = await interaction.guild.members.fetch(interaction.targetMember).catch(() => null);

		// check role order
		if (member.id === interaction.guild.ownerId) return await interaction.reply('**❌ - You can\'t mute that member because they\'re the server owner.**');

		const targetUserRolePosition = member.roles.highest.position;
		const requestUserRolePosition = interaction.member.roles.highest.position;
		const botRolePosition = interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition && interaction.member.id != interaction.guild.ownerId) return await interaction.reply('**❌ - You can\'t mute that user because they have the same/higher role than you.**');

		if (targetUserRolePosition >= botRolePosition) return await interaction.reply('**❌ - I can\'t mute that user because they have the same/higher role than me.**');

		if (member.roles.cache.has(muteRole)) return interaction.reply({ content: '**❌ - This member is already muted.**', ephemeral: true });
		// end

		const timeInput = new TextInputBuilder()
			.setCustomId('time')
			.setLabel('Time:')
			.setStyle(TextInputStyle.Short)
			.setMinLength(2)
			.setMaxLength(3)
			.setRequired(true)
			.setPlaceholder('3d, 1w, 6h...');
		const reasonInput = new TextInputBuilder()
			.setCustomId('reason')
			.setLabel('Reason:')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			.setPlaceholder('Write the reason to mute this member.');
		const modal = new ModalBuilder()
			.setCustomId(`suggModal-${interaction.user.id}`)
			.setTitle('Suggestion Replier')
			.addComponents(new ActionRowBuilder().addComponents(timeInput), new ActionRowBuilder().addComponents(reasonInput));
		interaction.showModal(modal);
		const collected = await interaction.awaitModalSubmit({ filter: m => m.customId == `suggModal-${interaction.user.id}`, time: 300_000 });
		if (collected) {
			await collected.deferReply();

			const time = ms(collected.fields.getTextInputValue('time'));
			if (!time) return collected.reply('**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**');
			const reason = collected.fields.getTextInputValue('reason');
			member.roles.add(muteRole);
			await new TRoles({
				role: muteRole,
				member: member.user.id,
				time: Date.now() + time,
			}).save();
			require('./muteRegistering/muteRegister')(client, {
				member: member.user.id,
				staff: interaction.user.id,
				time: time,
				reason: reason,
			}, interaction.createdTimestamp);
			collected.editReply(`**🤐 - Muted ${member.user} for __${ms(time, { long: true })}__.**`);
		}
	},
};