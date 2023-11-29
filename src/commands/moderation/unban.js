const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require('discord.js');
const Ban = require('../../models/activeBan');
const { mainlog } = require('../../../configs/config.json');

module.exports = {
	name: 'unban',
	description: 'removes the ban from user',
	options: [
		{
			name: 'user',
			description: 'The user to unban.',
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
	],
	permissions: PermissionFlagsBits.BanMembers,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').Interaction} interaction
	 */
	callback: async (client, interaction) => {
		const targetUser = await client.users.fetch(interaction.options.get('user').value).catch(() => null);
		if (!targetUser) interaction.reply({ content: '❌ - This isn\'t a valid user.', ephemeral: true });
		if (!await (interaction.guild.bans.fetch(targetUser.id).catch(() => null))) return await interaction.reply('**❌ - This user is not banned.**');
		const ban = await Ban.findOne({ userId: targetUser.id, guildId: interaction.guildId });
		if (ban) ban.deleteOne();
		interaction.guild.bans.remove(targetUser.id);
		interaction.reply(`**✅ - Removed the ban from "${targetUser.displayName}".**`);
		client.channels.cache.get(mainlog).send(`**● Action By ${interaction.user} :**\`\`\`diff\n+ Removed the ban from user "${targetUser.username}" (${targetUser.id})\`\`\``);
	},
};