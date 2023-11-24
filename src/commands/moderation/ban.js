const {
	ApplicationCommandOptionType,
	PermissionFlagsBits,
} = require('discord.js');
const ms = require('ms');
const Ban = require('../../models/activeBan');
const { mainlog } = require('../../../config.json');

module.exports = {
	name: 'ban',
	description: 'Bans a user',
	options: [
		{
			name: 'user',
			description: 'The user to ban.',
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: 'duration',
			description: 'The required time to ban the user',
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'reason',
			description: 'The reason for banning a user.',
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'dm',
			description: 'send a message to the member with the reason',
			type: ApplicationCommandOptionType.Boolean,
		},
	],
	permissions: PermissionFlagsBits.BanMembers,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').Interaction} interaction
	 */
	callback: async (client, interaction) => {
		const { default: pms } = await import('pretty-ms');
		const reason = interaction.options.get('reason')?.value || 'No reason provided';
		const dm = interaction.options.get('dm')?.value || false;
		const targetUser = await client.users.fetch(interaction.options.get('user').value).catch(() => null);
		let time = interaction.options.get('duration')?.value || 'no-time';
		if (!targetUser) interaction.reply({ content: '❌ - This isn\'t a valid user.', ephemeral: true });

		if (targetUser.id === interaction.guild.ownerId) return await interaction.reply('**❌ - You can\'t ban that user because they\'re the server owner.**');

		if (await (interaction.guild.bans.fetch(targetUser.id).catch(() => null))) return await interaction.reply('**❌ - This user is already banned.**');

		const targetMem = await interaction.guild.members.fetch(targetUser.id).catch(e => console.log(e.name));

		if (targetMem) {
			const targetUserRolePosition = targetMem.roles.highest.position;
			const requestUserRolePosition = interaction.member.roles.highest.position;
			const botRolePosition = interaction.guild.members.me.roles.highest.position;

			if (targetUserRolePosition >= requestUserRolePosition && interaction.member.id != interaction.guild.ownerId) return await interaction.editReply('**❌ - You can\'t mute that user because they have the same/higher role than you.**');
			if (targetUserRolePosition >= botRolePosition) return await interaction.reply('**❌ - I can\'t mute that user because they have the same/higher role than me.**');
		}

		if (time != 'no-time') {
			time = ms(time);
			if (!time) return await interaction.reply('**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**');
		}

		const msg = `**🚫 - You have been  from the server for: \`${time == 'no-time' ? 'Eternity' : pms(time, { verbose: true })}\`.\nReason: \`${reason}\`**`;

		if (dm) targetUser.send(msg);
		try {
			if (time != 'no-time') {
				await new Ban({
					userId: targetUser.id,
					guildId: interaction.guildId,
					time: Date.now() + time,
				}).save();
			}
			interaction.guild.bans.create(targetUser.id, { reason: `${reason} | ${time == 'no-time' ? 'Eternity' : pms(time, { verbose: true })}` }).then(async () => {
				if (!dm) await interaction.reply(msg.replace('You', targetUser));
				else interaction.reply({ content: msg.replace('You', targetUser), ephemeral: true });
				client.channels.cache.get(mainlog).send(`**● Action By ${interaction.user} :**\`\`\`diff\n-  the user "${targetUser.username}" (${targetUser.id})\n- Reason: ${reason}\n- Time: ${time == 'no-time' ? 'Eternity' : pms(time, { verbose: true })}\`\`\``);
			});
		}

		catch (error) {
			console.log(`There was an error when banning: ${error}`);
		}
	},
};
