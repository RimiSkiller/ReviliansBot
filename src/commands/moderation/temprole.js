const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const { mainserver, mainlog } = require('../../../configs/config.json');

module.exports = {
	name: 'temprole',
	description: 'Manage a member temprole',
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'add',
			description: 'Add a temprole to specific member',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'member',
					description: 'the member you want to give him a temprole',
					required: true,
				},
				{
					name: 'role',
					description: 'The role you want to give to the member',
					required: true,
					type: ApplicationCommandOptionType.Role,
				},
				{
					name: 'time',
					description: 'The duration of the temprole',
					required: true,
					type: ApplicationCommandOptionType.String,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'remove',
			description: 'remove a temprole from specific member',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'member',
					description: 'the member you want to remove his temprole',
					required: true,
				},
				{
					name: 'role',
					description: 'The role you want to remove from the member',
					required: true,
					type: ApplicationCommandOptionType.Role,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'check',
			description: 'check the remining time of all temprole of a member',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'member',
					description: 'the member you want to check his temproles',
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: 'edit',
			description: 'edit the duration of a member\'s temprole',
			options: [
				{
					type: ApplicationCommandOptionType.User,
					name: 'member',
					description: 'the member you want to edit his temprole',
					required: true,
				},
				{
					name: 'role',
					description: 'The role you want to edit',
					required: true,
					type: ApplicationCommandOptionType.Role,
				},
				{
					name: 'time',
					description: 'the time to add of remove ex:(1d, -3h, +5m)',
					required: true,
					type: ApplicationCommandOptionType.String,
				},
			],
		},
	],
	permissions: PermissionFlagsBits.ManageRoles,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const subcmd = interaction.options.getSubcommand();
		const logger = (m) => client.channels.cache.get(mainlog).send(m);
		const user = await client.guilds.cache.get(mainserver).members.fetch(interaction.options.get('member').value).catch(() => null);
		if (!user) return interaction.reply({ content: '**❌ - This Member isn\'t in the server.**', ephemeral: true });
		let x = {};
		if (subcmd != 'check') {

			const role = await client.guilds.cache.get(mainserver).roles.fetch(interaction.options.get('role')?.value).catch(() => null);
			if (!role) return interaction.reply({ content: '**❌ - This role isn\'t in this server.**', ephemeral: true });

			const time = ms(interaction.options.get('time')?.value || '1m');
			if (!time) return interaction.reply('**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**');
			x = await require(`./temprole/${subcmd}`)(interaction, user, role, time);
		}
		else { x = await require(`./temprole/${subcmd}`)(interaction, user); }
		if (x.log) logger(x.log);
		interaction.reply({ embeds: [new EmbedBuilder().setDescription(x.msg)] });
	},
};
