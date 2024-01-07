const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');
const Votes = require('../../models/votes');

module.exports = {
	name: 'vote',
	description: 'Create a vote message in the server.',
	options: [
		{
			name: 'message',
			description: 'the message you want the members to vote for',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'time',
			description: 'the duration of the vote',
			required: false,
			type: ApplicationCommandOptionType.String,
		},
	],
	permissions: PermissionFlagsBits.ManageChannels,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const time = ms(interaction.options.get('time')?.value || '0');
		if (time == undefined) return interaction.reply('**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**');
		const embed = new EmbedBuilder()
			.setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL() })
			.setDescription(`**● ${interaction.options.get('message').value}**`)
			.setColor(client.color)
			.setFooter({ text: `Vote By: ${interaction.member.displayName}`, iconURL: interaction.member.displayAvatarURL() });
		const msg = await (await interaction.reply({ embeds: [embed] })).fetch();
		await msg.react('1193689532764270623');
		await msg.react('1193689536191012967');
		if (!time) return;
		await new Votes({
			author: interaction.user.id,
			message: msg.id,
			channel: interaction.channelId,
			time: Date.now() + time || 'no-time',
		}).save();
	},
};
