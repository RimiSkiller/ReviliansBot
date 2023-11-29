const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const TRoles = require('../../models/temproles');
const { mainserver, mainlog } = require('../../../configs/config.json');

module.exports = {
	name: 'temprole',
	description: 'Manage a member temprole.',
	options: [
		{
			name: 'member',
			description: 'The member you want to manage his temprole',
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
		{
			name: 'role',
			description: 'The role you want to manage',
			required: true,
			type: ApplicationCommandOptionType.Role,
		},
		{
			name: 'action',
			description: 'The action you want to make',
			required: true,
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: 'Add Role/Time', value: 'add' },
				{ name: 'Remove Role', value: 'rr' },
				{ name: 'Remove Time', value: 'rt' },
				{ name: 'Check Time', value: 'ct' },
			],
		},
		{
			name: 'time',
			description: 'The duration you want to set',
			type: ApplicationCommandOptionType.String,
		},
	],
	permissions: PermissionFlagsBits.ManageRoles,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const logger = (m) => client.channels.cache.get(mainlog).send(m);
		const user = await client.guilds.cache.get(mainserver).members.fetch(interaction.options.get('member').value).catch(() => null);
		if (!user) return interaction.reply({ content: '**❌ - This Member isn\'t in the server.**', ephemeral: true });

		const role = await client.guilds.cache.get(mainserver).roles.fetch(interaction.options.get('role').value).catch(() => null);
		if (!role) return interaction.reply({ content: '**❌ - This role isn\'t in this server.**', ephemeral: true });

		const action = interaction.options.get('action').value;
		const tm = interaction.options.get('time')?.value;
		if (!tm && !(action == 'rr' || action == 'ct')) return interaction.reply('**❌ - This action need a provided time.**');
		const time = ms(tm || '1m');
		if (!time) return interaction.reply('**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**');

		const data = await TRoles.findOne({ role: role.id, member: user.id });
		let msg = '';
		if (action == 'add') {
			if (data) {
				data.time = Number(data.time) + time;
				msg = `**➕ - Added __${ms(time, { long: true })}__, Time remaining: \`${ms(data.time - Date.now(), { long: true })}\`**`;
				await data.save();
				logger(`**● Action By ${interaction.user}:**\`\`\`diff\n+ Added ${ms(time, { long: true })} to:\n+ [user: ${user.user.username} (${user.id}), temprole: ${role.name} (${role.id})]\`\`\``);
			}
			else {
				user.roles.add(role.id);
				await new TRoles({
					member: user.id,
					role: role.id,
					time: Date.now() + time,
				}).save();
				msg = `**⌛ - Added role \`${role.name}\` to user ${user} for __${ms(time, { long: true })}__.**`;
				logger(`**● Action By ${interaction.user}:**\`\`\`diff\n+ Added temprole: ${role.name} (${role.id}) to:\n+ user: ${user.user.username} (${user.id}) for ${ms(time, { long: true })}\`\`\``);
			}
		}
		else if (!data) { msg = '**❌ - This member don\'t have this temprole.**'; }
		else if (action == 'rr') {
			await data.deleteOne();
			user.roles.remove(role.id);
			msg = `**🗑️ - Removed temprole \`${role.name}\` from member.**`;
			logger(`**● Action By ${interaction.user}:**\`\`\`diff\n- Removed temprole: ${role.name} (${role.id}) from user: ${user.user.username} (${user.id})\`\`\``);
		}
		else if (action == 'rt') {
			data.time = Number(data.time) - time;
			msg = `**➕ - Removed __${ms(time, { long: true })}__ from role \`${role.name}\`, Time remaining: \`${ms(data.time - Date.now(), { long: true })}\`**`;
			logger(`**● Action By ${interaction.user}:**\`\`\`diff\n- Removed ${ms(time, { long: true })} from:\n- [user: ${user.user.username} (${user.id}), role: ${role.name} (${role.id})]\`\`\``);
			await data.save();
		}
		else if (action == 'ct') {
			msg = `**⌛ - Time remaining for role \`${role.name}\`: __${ms(data.time - Date.now(), { long: true })}__.**`;
		}
		interaction.reply({ embeds: [new EmbedBuilder().setDescription(msg)] });
	},
};
