const { ApplicationCommandOptionType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const Mutes = require('../../models/mutes');

module.exports = {
	name: 'staff',
	description: 'Get the history of a staff mod actions on all members',
	options: [
		{
			name: 'staff',
			description: 'The staff to get his history.',
			required: true,
			type: ApplicationCommandOptionType.Mentionable,
		},
	],
	permissions: PermissionFlagsBits.ManageMessages,

	/**
	 * @param {import('discord.js').Client} client
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	callback: async (client, interaction) => {
		const user = interaction.options.get('staff').value;
		if (!await (client.users.fetch(user).catch(() => null))) interaction.editReply('**❌ - Invalid id, try again with a valid id.**');
		const button_b = new ButtonBuilder()
			.setCustomId('backward')
			.setEmoji('1170430004493033594')
			.setStyle(ButtonStyle.Primary);
		const button_f = new ButtonBuilder()
			.setCustomId('forward')
			.setEmoji('1170430025208696853')
			.setStyle(ButtonStyle.Primary);

		const data = await Mutes.where('staff').equals(user);
		if (!data || data.length == 0) return interaction.reply('**⁉️ - No history was found for this staff.**');
		let index = data.length - 1;
		const button_i = new ButtonBuilder()
			.setCustomId('index')
			.setStyle(ButtonStyle.Secondary)
			.setLabel(`${data.length - index}/${data.length}`);
		let res;
		await interaction.deferReply();
		try {
			while (res != 'no-res') {
				button_b.setDisabled(false); button_f.setDisabled(false);
				if (index == 0) button_b.setDisabled(true);
				if (index == data.length - 1) button_f.setDisabled(true);
				if (data[index].refused) data[index].embed.color = 16711680;
				const reply = await interaction.editReply({ embeds: [data[index].embed], components: [new ActionRowBuilder().addComponents(button_f, button_i, button_b)] });
				res = await require('../../utils/awaitInterraction/getButton')(reply, interaction.user.id);
				if (res == 'backward') { index--; }
				else if (res == 'forward') { index++; }
				else if (res == 'index') {
					const msg = await interaction.channel.send('**● Send page number:**');
					const resM = await require('../../utils/awaitInterraction/getMessage')(interaction.user.id, interaction.channel);
					if (!isNaN(resM) && resM > 0 && resM <= data.length) index = data.length - resM;
					await msg.delete();
				}
				button_i.setLabel(`${data.length - index}/${data.length}`);
			}
			interaction.editReply({ components: [new ActionRowBuilder().addComponents(button_f.setDisabled(true), button_i.setDisabled(true), button_b.setDisabled(true))] });
		}
		catch (e) {
			console.error(e);
		}
	},
};
