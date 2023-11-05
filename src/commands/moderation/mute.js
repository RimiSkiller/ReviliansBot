const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');
const { log } = require('../../../config.json');

module.exports = {
	name: 'mute',
	description: 'Mute a member for specific time',
	options: [
		{
			name: 'member',
			description: 'The member to mute.',
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: 'duration',
			description: 'The required time to mute the member',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'reason',
			description: 'The reason for muting a member.',
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'dm',
			description: 'send a message to the member with the reason',
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
		const { default: pms } = await import('pretty-ms');

		const reason = interaction.options.get('reason')?.value || 'No reason provided';
		const dm = interaction.options.get('dm')?.value || false;
		const time = ms(interaction.options.get('duration').value);
		const targetUser = await interaction.guild.members.fetch(interaction.options.get('member').value).catch(() => null);
		if (!targetUser) interaction.reply({ content: '❌ - This Member isn\'t in the server.', ephemeral: true });
		if (targetUser.isCommunicationDisabled()) return await interaction.reply('**❌ - This member is already muted.**');
		if (targetUser.id === interaction.guild.ownerId) return await interaction.reply('**❌ - You can\'t mute that user because they\'re the server owner.**');

		const targetUserRolePosition = targetUser.roles.highest.position;
		const requestUserRolePosition = interaction.member.roles.highest.position;
		const botRolePosition = interaction.guild.members.me.roles.highest.position;

		if (targetUserRolePosition >= requestUserRolePosition && interaction.member.id != interaction.guild.ownerId) return await interaction.editReply('**❌ - You can\'t mute that user because they have the same/higher role than you.**');
		if (targetUserRolePosition >= botRolePosition) return await interaction.reply('**❌ - I can\'t mute that user because they have the same/higher role than me.**');

		if (!time) return await interaction.reply('**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**');
		if (time > ms('28d') || time < ms('5m')) return await interaction.reply('**❌ - The duration must be between `5 minutes` and `28 days`.**');

		const msg = `**🤐 - You have been muted from the server for: \`${pms(time, { verbose: true })}\`.\nReason: \`${reason}\`**`;

		if (dm) targetUser.send(msg);
		try {
			await targetUser.timeout(time, reason);
			if (!dm) await interaction.reply(msg.replace('You', targetUser));
			else interaction.reply({ content: msg.replace('You', targetUser), ephemeral: true });
			client.channels.cache.get(log).send(`**● Action By ${interaction.user} :**\`\`\`diff\n- muted the user "${targetUser.user.username}" (${targetUser.id})\n- Reason: ${reason}\n- Time: ${pms(time, { verbose: true })}\`\`\``);
		}
		catch (error) {
			console.log(`There was an error when muting: ${error}`);
		}
	},
};