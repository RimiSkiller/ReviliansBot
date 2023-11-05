const { ApplicationCommandOptionType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Mutes = require('../../models/mutes');
const Bans = require('../../models/bans');

module.exports = {
	name: 'log',
	description: 'Get the history of mod actions on a member',
	options: [
		{
			name: 'type',
			description: 'The type of mod action.',
			required: true,
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: 'Mute', value: 'mute' },
				{ name: 'Ban', value: 'ban' },
			],
		},
		{
			name: 'member',
			description: 'The member to get his history.',
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
	],
	permissionsRequired: [PermissionFlagsBits.ManageMessages],

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const user = interaction.options.get('member').value;
		const type = interaction.options.get('type').value;
		if (!await (interaction.client.users.fetch(user).catch(() => null))) interaction.editReply('**❌ - Invalid id, try again with a valid id.**');
		const button_b = new ButtonBuilder()
			.setCustomId('backward')
			// .setLabel('-->')
			.setEmoji('1170430004493033594')
			.setStyle(ButtonStyle.Primary);
		const button_f = new ButtonBuilder()
			.setCustomId('forward')
			// .setLabel('<--')
			.setEmoji('1170430025208696853')
			.setStyle(ButtonStyle.Primary);

		const data = type == 'mute' ? await Mutes.where('member').equals(user) : type == 'ban' ? await Bans.where('member').equals(user) : null;
		if (!data || data.length == 0) return interaction.reply('**⁉️ - No history was found for this member.**');
		let index = data.length - 1;
		const button_i = new ButtonBuilder()
			.setCustomId('index')
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(true)
			.setLabel(`${data.length - index}/${data.length}`);
		let res;
		await interaction.deferReply();
		try {
			while (res != 'no-res-3') {
				button_b.setDisabled(false); button_f.setDisabled(false);
				if (index == 0) button_b.setDisabled(true);
				if (index == data.length - 1) button_f.setDisabled(true);
				const reply = await interaction.editReply({ embeds: [data[index].embed.data], components: [new ActionRowBuilder().addComponents(button_f, button_i, button_b)] });
				res = await require('../../utils/getButton')(reply);
				if (res == 'backward') index--;
				else if (res == 'forward') index++;
				button_i.setLabel(`${data.length - index}/${data.length}`);
			}
			interaction.editReply({ components: [new ActionRowBuilder().addComponents(button_f.setDisabled(true), button_i, button_b.setDisabled(true))] });
		}
		catch (e) {
			console.error(e);
		}
	},
};