const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Giveaways = require('../../models/giveaways');
const ms = require('ms');

module.exports = {
	name: 'giveaway',
	description: 'make a giveaway on the server',
	options: [
		{
			name: 'prize',
			description: 'describe the prize you want to give',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'time',
			description: 'the time to end the giveaway',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
		{
			name: 'winners',
			description: 'the number of winners in the giveaway',
			type: ApplicationCommandOptionType.Number,
		},
	],
	permissions: PermissionFlagsBits.ManageEvents,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const time = ms(interaction.options.get('time').value);
		const winners = interaction.options.get('winners')?.value || 1;
		if (!time) return interaction.reply({ content: '**❌ - That\'s not a valid duration, ex: `15m, 10h, 3d`.**', ephemeral: true });
		const prize = interaction.options.get('prize').value;
		const embed = new EmbedBuilder()
			.setAuthor({ name: 'Giveaway' })
			.setColor(0x5865f2)
			.addFields({ name: '● Prize:', value: prize })
			.addFields({ name: '● Time:', value: `<t:${Math.floor((time + Date.now()) / 1000)}:R>` })
			.setFooter({ text: `By: ${interaction.member.displayName}\nWinners: ${winners}`, iconURL: interaction.member.displayAvatarURL() })
			.setThumbnail(interaction.guild.iconURL());

		const button = new ButtonBuilder()
			.setCustomId('giveawayEnter')
			.setEmoji('🎉')
			.setLabel('0')
			.setStyle(ButtonStyle.Primary);

		await interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] });
		const msg = await interaction.fetchReply();
		await new Giveaways({
			message: msg.id,
			prize: prize,
			winners: winners,
			channel: interaction.channelId,
			time: time + Date.now(),
		}).save();
	},
};