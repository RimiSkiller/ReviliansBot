const { TextInputBuilder, TextInputStyle, ModalBuilder, ActionRowBuilder } = require('discord.js');
const nodeHtmlToImage = require('node-html-to-image');
const { generateFromMessages } = require('discord-html-transcripts');
const ms = require('ms');
const { muteRole, mainserver } = require('../../../config.json');
const TRoles = require('../../models/temproles');

module.exports = {
	name: 'Mute Member (proof)',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').MessageContextMenuCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const message = interaction.targetMessage;
		const member = await client.guilds.cache.get(mainserver).members.fetch(message.author.id).catch(() => null);


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
		const lengthInput = new TextInputBuilder()
			.setCustomId('length')
			.setLabel('Lenght:')
			.setStyle(TextInputStyle.Short)
			.setMinLength(1)
			.setMaxLength(2)
			.setPlaceholder('the amount of message to be shown in the proof. (defualt: 3)');
		const reasonInput = new TextInputBuilder()
			.setCustomId('reason')
			.setLabel('Reason:')
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			.setPlaceholder('Write the reason to mute this member.');
		const modal = new ModalBuilder()
			.setCustomId(`suggModal-${interaction.user.id}`)
			.setTitle('Suggestion Replier')
			.addComponents(new ActionRowBuilder().addComponents(timeInput), new ActionRowBuilder().addComponents(lengthInput), new ActionRowBuilder().addComponents(reasonInput));
		interaction.showModal(modal);
		const collected = await interaction.awaitModalSubmit({ filter: m => m.customId == `suggModal-${interaction.user.id}`, time: 300_000 });
		if (collected) {
			const length = collected.fields.getTextInputValue('length') || 3;

			const messages = await interaction.channel.messages.fetch({ around: message.id, limit: isNaN(length) ? 3 : length, cache: false });
			collected.deferReply();
			const html = await generateFromMessages(messages.reverse(), interaction.channel, {
				returnType: 'string',
				footerText: 'Revilians automatic mute system',
				poweredBy: false,
			});
			const image = await nodeHtmlToImage({
				html: html,
			});
			const time = ms(collected.fields.getTextInputValue('time'));
			if (!time) return collected.reply('**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**');
			const reason = collected.fields.getTextInputValue('reason');
			message.member.roles.add(muteRole);
			await new TRoles({
				role: muteRole,
				member: message.author.id,
				time: Date.now() + time,
			}).save();
			require('./muteRegistering/muteMessageRegister')(client, {
				member: message.author.id,
				staff: interaction.user.id,
				time: time,
				proof: image,
				reason: reason,
			}, interaction.createdTimestamp);
			collected.followUp({ content: `**🤐 - Muted ${member.user} for __${ms(time, { long: true })}__.**`, ephemeral: true });
		}
	},
};