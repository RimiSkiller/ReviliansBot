const { ApplicationCommandOptionType, PermissionFlagsBits, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	name: 'apply',
	description: 'open the apply for staff',
	options: [
		{
			name: 'category',
			description: 'select the category to get the apply informations from',
			required: true,
			type: ApplicationCommandOptionType.String,
		},
	],
	permissions: PermissionFlagsBits.ManageGuild,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const category = (await client.staffServer.channels.fetch()).filter(ch => ch.type == ChannelType.GuildCategory).get(interaction.options.get('category').value);
		if (!category) return interaction.reply({ content: '**❌ - You didn\'t provide a valid category id.**', ephemeral: true });
		const messageChannel = category.children.cache.filter(ch => ch.name == 'message').first();
		if (!messageChannel) return interaction.reply({ content: '**❌ - This category doesn\'t have a "message" channel.**', ephemeral: true });
		const message = (await messageChannel.messages.fetch()).first();
		const embed = new EmbedBuilder()
			.setTitle(category.name)
			.setDescription(message.content)
			.setFooter({ text: 'Revilians Apply System' })
			.setTimestamp()
			.setColor(client.color)
			.setThumbnail(client.mainServer.iconURL());

		const button = new ButtonBuilder({ emoji: '📨', customId: 'apply', label: 'Apply Now!', style: ButtonStyle.Success });
		interaction.reply({ embeds: [embed], components: [new ActionRowBuilder().addComponents(button)] });
	},
};