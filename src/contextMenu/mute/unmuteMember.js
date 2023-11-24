const { muteRole } = require('../../../config.json');
const TRoles = require('../../models/temproles');


module.exports = {
	name: 'Unmute Member',
	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').UserContextMenuCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const member = await interaction.guild.members.fetch(interaction.targetMember).catch(() => null);

		if (!member.roles.cache.has(muteRole)) return await interaction.reply({ content: '**❌ - This member is already unmuted.**', ephemeral: true });

		const targetUserRolePosition = member.roles.highest.position;
		const requestUserRolePosition = interaction.member.roles.highest.position;
		const botRolePosition = interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition && interaction.member.id != interaction.guild.ownerId) return await interaction.editReply({ content: '**❌ - You can\'t unmute that user because they have the same/higher role than you.**', ephemeral: true });
		if (targetUserRolePosition >= botRolePosition) return await interaction.reply({ content: '**❌ - I can\'t unmute that user because they have the same/higher role than me.**', ephemeral: true });

		member.roles.remove(muteRole);
		await TRoles.findOne({ role: muteRole, member: member.id }).deleteOne();
		interaction.reply(`**🤐 - Unmuted ${member.user}.**`);
	},
};