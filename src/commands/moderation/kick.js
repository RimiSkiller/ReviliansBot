const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: 'kick',
	description: 'kick a member out of the server',
	options: [
		{
			name: 'member',
			description: 'The member to kick.',
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: 'reason',
			description: 'The reason to kick a member.',
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'dm',
			description: 'send a message to the member with the reason',
			type: ApplicationCommandOptionType.Boolean,
		},
	],
	permissions: PermissionFlagsBits.KickMembers,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').Interaction} interaction
	 */
	callback: async (client, interaction) => {
		const reason = interaction.options.get('reason')?.value || 'No reason provided';
		const dm = interaction.options.get('dm')?.value || false;
		await interaction.deferReply();
		const targetUser = await interaction.guild.members.fetch(interaction.options.get('member').value).catch(e => console.log(e.name));
		if (!targetUser) interaction.reply({ content: '❌ - This Member isn\'t in the server.', ephemeral: true });

		if (targetUser.id === interaction.guild.ownerId) return await interaction.editReply('**❌ - You can\'t kick that user because they\'re the server owner.**');

		const targetUserRolePosition = targetUser.roles.highest.position;
		const requestUserRolePosition = interaction.member.roles.highest.position;
		const botRolePosition = interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition && interaction.member.id != interaction.guild.ownerId) return await interaction.editReply('**❌ - You can\'t kick that user because they have the same/higher role than you.**');

		if (targetUserRolePosition >= botRolePosition) return await interaction.editReply('**❌ - I can\'t kick that user because they have the same/higher role than me.**');

		if (dm) targetUser.send(`**↘️ - You have been kicked from the server for: \`${reason}\`.**`);
		try {
			await targetUser.kick({ reason });
			await interaction.editReply(`**↘️ - User ${targetUser} was kicked from the server for: \`${reason}\`.**`);
		}
		catch (error) {
			console.log(`There was an error when kicking: ${error}`);
		}
	},
};
