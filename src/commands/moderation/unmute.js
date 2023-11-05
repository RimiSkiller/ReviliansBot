const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { log } = require('../../../config.json');

module.exports = {
	name: 'unmute',
	description: 'Unmute a member.',
	options: [
		{
			name: 'member',
			description: 'The member to unmute.',
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: 'dm',
			description: 'send a message to the member to notify him',
			type: ApplicationCommandOptionType.Boolean,
		},
	],
	botPermissions: [PermissionFlagsBits.ModerateMembers],
	permissionsRequired: [PermissionFlagsBits.ModerateMembers],

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').Interaction} interaction
	 */
	callback: async (client, interaction) => {

		const dm = interaction.options.get('dm')?.value || false;
		const targetUser = await interaction.guild.members.fetch(interaction.options.get('member').value).catch(() => null);
		if (!targetUser) interaction.reply({ content: '❌ - This Member isn\'t in the server.', ephemeral: true });

		if (!targetUser.isCommunicationDisabled()) return await interaction.reply('**❌ - This member is already unmuted.**');

		const targetUserRolePosition = targetUser.roles.highest.position;
		const requestUserRolePosition = interaction.member.roles.highest.position;
		const botRolePosition = interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition && interaction.member.id != interaction.guild.ownerId) return await interaction.editReply('**❌ - You can\'t unmute that user because they have the same/higher role than you.**');
		if (targetUserRolePosition >= botRolePosition) return await interaction.reply('**❌ - I can\'t unmute that user because they have the same/higher role than me.**');

		const msg = '**🤐 - You have been unmuted from the server.**';

		if (dm) targetUser.send(msg);
		try {
			await targetUser.timeout(null);
			if (!dm) await interaction.reply(msg.replace('You', targetUser));
			else interaction.reply({ content: msg.replace('You', targetUser), ephemeral: true });
			client.channels.cache.get(log).send(`**● Action By ${interaction.user} :**\`\`\`diff\n+ Unmuted the user "${targetUser.user.username}" (${targetUser.id})\`\`\``);
		}
		catch (error) {
			console.log(`There was an error when unmuting: ${error}`);
		}
	},
};
