const { ApplicationCommandOptionType, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
	name: 'reset-permissions',
	description: 'reset all members or a specific member permissions in a channel',
	options: [
		{
			name: 'channel',
			description: 'the channel you want to reset',
			type: ApplicationCommandOptionType.Channel,
			channelTypes: [ChannelType.GuildText],
		},
		{
			name: 'member',
			description: 'the member you want to reset his permissions in the channel',
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
			ViewChannel: null,
			SendMessages: null,
		});
		interaction.reply(`**🔄️ - Reseted: ${channel} to ${!user ? 'everyone' : `<@${member.id}>`}.**`);
	},
};