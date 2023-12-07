const { ApplicationCommandOptionType, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
	name: 'show',
	description: 'allow all members or a specific member to view a channel',
	options: [
		{
			name: 'channel',
			description: 'the channel you want to show',
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
		},
		{
			name: 'member',
			description: 'the member you want to allow him to view the channel',
			type: ApplicationCommandOptionType.User,
			channelTypes: [ChannelType.GuildText],
		},
	],
	permissions: PermissionFlagsBits.ManageChannels,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const user = interaction.options.get('member')?.value;
		const member = await interaction.guild.members.fetch(user).catch(() => null);
		if (!member && user) return interaction.reply({ content: '**❌ - You didn\'t provide a valid user.**', ephemeral: true });
		const perms = !user ? interaction.guild.roles.everyone : member.id;
		const channel = await interaction.guild.channels.fetch(interaction.options.get('channel')?.value || interaction.channelId, { cache: false }).catch(() => null);
		if (!channel) return interaction.reply({ content: '**❌ - You didn\'t provide a valid channel.**', ephemeral: true });
		channel.permissionOverwrites.edit(perms, {
			ViewChannel: true,
		});
		interaction.reply(`**👀 - Showed: ${channel} to ${!user ? 'everyone' : `<@${member.id}>`}.**`);
	},
};