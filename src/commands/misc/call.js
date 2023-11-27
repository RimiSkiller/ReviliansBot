const { ApplicationCommandOptionType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: 'call',
	description: 'call a member to specific room',
	options: [
		{
			name: 'member',
			description: 'the member you want to call',
			required: true,
			type: ApplicationCommandOptionType.User,
		},
		{
			name: 'reason',
			description: 'the reason to call the member',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],
	permissions: PermissionFlagsBits.MentionEveryone,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const reason = interaction.options.get('reason').value;
		const user = await interaction.guild.members.fetch(interaction.options.get('member').value).catch(() => null);
		if (!user) return interaction.reply('**❌ - This isn\'t a valid member in this server.**');
		const reply = await (await interaction.deferReply()).fetch();
		const button1 = new ButtonBuilder({ label: 'Accept', style: ButtonStyle.Link, url: reply.url });
		const button2 = new ButtonBuilder({ customId: 'rejectCall', label: 'Reject', style: ButtonStyle.Danger });
		let check = true;
		const msg = await user.send({
			content: `**📢 - ${interaction.member.displayName} wants you in ${interaction.guild.name} for:**\n\`\`\`${reason}\`\`\``,
			components: [new ActionRowBuilder().addComponents(button2, button1)],
		}).catch(e => {
			console.log(e);
			check = false;
			interaction.editReply({ content: '**❌ - This user has his DMs locked.**', ephemeral: true });
		});
		if (check) {
			interaction.editReply(`**📢 - Called <@${user.id}>.**`);
			const res = await require('../../utils/awaitInterraction/getButton')(msg, user.id, 900_000);
			if (res == 'rejectCall') {
				interaction.user.send(`**${user.displayName} has rejected your call.**`);
			}
			msg.edit({ components: [] });
		}

	},
};